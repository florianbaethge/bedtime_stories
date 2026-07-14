"""Describe playback events for the Home Assistant logbook (activity feed)."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.components.logbook import (
    LOGBOOK_ENTRY_ENTITY_ID,
    LOGBOOK_ENTRY_ICON,
    LOGBOOK_ENTRY_MESSAGE,
    LOGBOOK_ENTRY_NAME,
)
from homeassistant.core import Event, HomeAssistant, callback

from .const import (
    ATTR_CATEGORY,
    ATTR_MEDIA_PLAYER,
    ATTR_TITLE,
    DOMAIN,
    EVENT_STORY_PLAYED,
)


@callback
def async_describe_events(
    hass: HomeAssistant,
    async_describe_event: Callable[[str, str, Callable[[Event], dict[str, Any]]], None],
) -> None:
    """Register the story_played event description."""

    @callback
    def _describe(event: Event) -> dict[str, Any]:
        data = event.data
        title = data.get(ATTR_TITLE) or "a story"
        player = data.get(ATTR_MEDIA_PLAYER)
        player_state = hass.states.get(player) if player else None
        player_name = (
            player_state.attributes.get("friendly_name", player)
            if player_state
            else player
        )
        message = f'played "{title}"'
        if category := data.get(ATTR_CATEGORY):
            message += f" ({category})"
        if player_name:
            message += f" on {player_name}"
        entry: dict[str, Any] = {
            LOGBOOK_ENTRY_NAME: "Bedtime Stories",
            LOGBOOK_ENTRY_MESSAGE: message,
            LOGBOOK_ENTRY_ICON: "mdi:book-open-page-variant",
        }
        if player:
            entry[LOGBOOK_ENTRY_ENTITY_ID] = player
        return entry

    async_describe_event(DOMAIN, EVENT_STORY_PLAYED, _describe)
