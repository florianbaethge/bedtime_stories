"""Runtime manager: library CRUD, playback, stats and change notifications."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from homeassistant.components.media_player import (
    ATTR_MEDIA_CONTENT_ID,
    ATTR_MEDIA_CONTENT_TYPE,
    ATTR_MEDIA_EXTRA,
    SERVICE_PLAY_MEDIA,
)
from homeassistant.components.media_player import (
    DOMAIN as MEDIA_PLAYER_DOMAIN,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID, ATTR_FRIENDLY_NAME
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.network import NoURLAvailableError, get_url
from homeassistant.util import dt as dt_util

from .const import (
    ATTR_CATEGORY,
    ATTR_MEDIA_PLAYER,
    ATTR_PLAYED_AT,
    ATTR_STORY_ID,
    ATTR_TITLE,
    CONF_NAME,
    CONF_PLAYERS,
    DOMAIN,
    EVENT_STORY_PLAYED,
)
from .models import Category, LibraryData, PlayStats, Story, new_id
from .store import BedtimeStoriesStore

_LOGGER = logging.getLogger(__name__)


class BedtimeStoriesManager:
    """Own the library of one config entry and play stories."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        store: BedtimeStoriesStore,
    ) -> None:
        """Initialize the manager."""
        self.hass = hass
        self.entry = entry
        self.store = store
        # Currently selected target player (kept in sync by the select entity).
        self.current_player: str | None = None
        self._listeners: list[Callable[[], None]] = []

    # ---- basics -----------------------------------------------------------

    @property
    def data(self) -> LibraryData:
        """Return the library data."""
        return self.store.data

    @property
    def name(self) -> str:
        """Return the entry name."""
        return str(self.entry.data.get(CONF_NAME, "Bedtime Stories"))

    @property
    def players(self) -> list[str]:
        """Configured target players (options override initial data)."""
        players = self.entry.options.get(
            CONF_PLAYERS, self.entry.data.get(CONF_PLAYERS, [])
        )
        return [str(p) for p in players]

    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        """Register a change listener; returns an unsubscribe callback."""
        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    @callback
    def _notify(self) -> None:
        for listener in list(self._listeners):
            listener()

    async def async_save_and_notify(self) -> None:
        """Persist the library and notify subscribers (card, entities)."""
        await self.store.async_save()
        self._notify()

    # ---- snapshot for the card --------------------------------------------

    def _player_name(self, entity_id: str) -> str:
        state = self.hass.states.get(entity_id)
        if state is None:
            return entity_id
        return str(state.attributes.get(ATTR_FRIENDLY_NAME) or entity_id)

    def _select_entity_id(self) -> str | None:
        """Entity id of the player select (card uses it to cycle players)."""
        registry = er.async_get(self.hass)
        return registry.async_get_entity_id(
            "select", DOMAIN, f"{self.entry.entry_id}_player"
        )

    def snapshot(self) -> dict[str, Any]:
        """Full card state: library, stats and player info."""
        data = self.data
        return {
            "entry_id": self.entry.entry_id,
            "name": self.name,
            "categories": sorted(
                (c.to_dict() for c in data.categories.values()),
                key=lambda c: (c["order"], str(c["name"]).casefold()),
            ),
            "stories": sorted(
                (s.to_dict() for s in data.stories.values()),
                key=lambda s: (s["order"], str(s["title"]).casefold()),
            ),
            "stats": {sid: st.to_dict() for sid, st in data.stats.items()},
            "players": [
                {"entity_id": p, "name": self._player_name(p)} for p in self.players
            ],
            "current_player": self.current_player,
            "select_entity": self._select_entity_id(),
        }

    # ---- category CRUD -----------------------------------------------------

    async def async_save_category(self, payload: dict[str, Any]) -> Category:
        """Create or update a category."""
        data = dict(payload)
        if not str(data.get("name") or "").strip():
            raise HomeAssistantError("Category name must not be empty")
        if not data.get("id"):
            data["id"] = new_id()
            data.setdefault("order", len(self.data.categories))
        category = Category.from_dict(data)
        self.data.categories[category.id] = category
        await self.async_save_and_notify()
        return category

    async def async_delete_category(self, category_id: str) -> None:
        """Delete a category and all of its stories."""
        if category_id not in self.data.categories:
            raise HomeAssistantError(f"Unknown category: {category_id}")
        self.data.categories.pop(category_id)
        for story_id in [
            sid
            for sid, story in self.data.stories.items()
            if story.category_id == category_id
        ]:
            self.data.stories.pop(story_id)
            self.data.stats.pop(story_id, None)
        await self.async_save_and_notify()

    async def async_reorder_categories(self, category_ids: list[str]) -> None:
        """Apply a new category order (missing ids keep their position)."""
        for index, category_id in enumerate(category_ids):
            if category := self.data.categories.get(category_id):
                category.order = index
        await self.async_save_and_notify()

    # ---- story CRUD ---------------------------------------------------------

    async def async_save_story(self, payload: dict[str, Any]) -> Story:
        """Create or update a story."""
        data = dict(payload)
        if not str(data.get("title") or "").strip():
            raise HomeAssistantError("Story title must not be empty")
        if not str(data.get("media_content_id") or "").strip():
            raise HomeAssistantError("Story needs a media file")
        if data.get("category_id") not in self.data.categories:
            raise HomeAssistantError("Story needs an existing category")
        if not data.get("id"):
            data["id"] = new_id()
            data.setdefault("order", len(self.data.stories))
        story = Story.from_dict(data)
        self.data.stories[story.id] = story
        await self.async_save_and_notify()
        return story

    async def async_delete_story(self, story_id: str) -> None:
        """Delete a story and its stats."""
        if story_id not in self.data.stories:
            raise HomeAssistantError(f"Unknown story: {story_id}")
        self.data.stories.pop(story_id)
        self.data.stats.pop(story_id, None)
        await self.async_save_and_notify()

    async def async_reset_stats(self, story_id: str | None = None) -> None:
        """Reset play stats for one story or the whole library."""
        if story_id is None:
            self.data.stats.clear()
        else:
            self.data.stats.pop(story_id, None)
        await self.async_save_and_notify()

    # ---- playback -----------------------------------------------------------

    def _resolve_player(self, override: str | None) -> str:
        """Explicit override > select entity choice > single configured player."""
        if override:
            return override
        if self.current_player:
            return self.current_player
        if len(self.players) == 1:
            return self.players[0]
        raise HomeAssistantError(
            "No media player selected. Configure players in the integration "
            "options or pass one explicitly."
        )

    def _media_extra(self, story: Story) -> dict[str, Any]:
        """Cast metadata so the speaker/app shows title and cover."""
        metadata: dict[str, Any] = {"title": story.title}
        if story.image:
            image = story.image
            if image.startswith("/"):
                try:
                    image = f"{get_url(self.hass, prefer_external=False)}{image}"
                except NoURLAvailableError:
                    image = None
            if image:
                metadata["images"] = [{"url": image}]
        return {"metadata": metadata}

    async def async_play(
        self, story_id: str, media_player: str | None = None
    ) -> dict[str, Any]:
        """Play a story, update stats and fire the logbook event."""
        story = self.data.stories.get(story_id)
        if story is None:
            raise HomeAssistantError(f"Unknown story: {story_id}")
        player = self._resolve_player(media_player)

        await self.hass.services.async_call(
            MEDIA_PLAYER_DOMAIN,
            SERVICE_PLAY_MEDIA,
            {
                ATTR_ENTITY_ID: player,
                ATTR_MEDIA_CONTENT_ID: story.media_content_id,
                ATTR_MEDIA_CONTENT_TYPE: story.media_content_type,
                ATTR_MEDIA_EXTRA: self._media_extra(story),
            },
            blocking=True,
        )

        played_at = dt_util.now().isoformat()
        stats = self.data.stats.setdefault(story_id, PlayStats())
        stats.play_count += 1
        stats.last_played = played_at
        await self.async_save_and_notify()

        category = self.data.categories.get(story.category_id)
        event_data = {
            ATTR_STORY_ID: story.id,
            ATTR_TITLE: story.title,
            ATTR_CATEGORY: category.name if category else None,
            ATTR_MEDIA_PLAYER: player,
            ATTR_PLAYED_AT: played_at,
        }
        self.hass.bus.async_fire(EVENT_STORY_PLAYED, event_data)
        _LOGGER.debug("Played %s on %s", story.title, player)
        return event_data


@callback
def get_manager(
    hass: HomeAssistant, entry_id: str | None
) -> BedtimeStoriesManager | None:
    """Resolve the manager for an entry id (or the only loaded entry)."""
    managers: dict[str, BedtimeStoriesManager] = {
        k: v
        for k, v in hass.data.get(DOMAIN, {}).items()
        if isinstance(v, BedtimeStoriesManager)
    }
    if entry_id:
        return managers.get(entry_id)
    if len(managers) == 1:
        return next(iter(managers.values()))
    return None
