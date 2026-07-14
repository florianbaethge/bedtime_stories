"""Sensors: last played story and total play count (long-term statistics)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    ATTR_CATEGORY,
    ATTR_PLAYED_AT,
    ATTR_STORY_ID,
    DOMAIN,
)
from .entity import BedtimeStoriesEntity
from .manager import BedtimeStoriesManager
from .models import PlayStats, Story


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Create the statistics sensors."""
    manager: BedtimeStoriesManager = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([LastStorySensor(manager), TotalPlaysSensor(manager)])


def _last_played_story(
    manager: BedtimeStoriesManager,
) -> tuple[Story, PlayStats] | None:
    """Return the most recently played story, derived from stored stats."""
    best: tuple[Story, PlayStats] | None = None
    for story_id, stats in manager.data.stats.items():
        story = manager.data.stories.get(story_id)
        if story is None or stats.last_played is None:
            continue
        if best is None or stats.last_played > best[1].last_played:  # type: ignore[operator]
            best = (story, stats)
    return best


class LastStorySensor(BedtimeStoriesEntity, SensorEntity):
    """Title of the story played last (shows up in history/activity)."""

    _attr_translation_key = "last_story"
    _attr_icon = "mdi:book-open-variant"

    def __init__(self, manager: BedtimeStoriesManager) -> None:
        """Initialize the sensor."""
        super().__init__(manager)
        self._attr_unique_id = f"{manager.entry.entry_id}_last_story"

    @property
    def native_value(self) -> str | None:
        """Return the story title."""
        if (best := _last_played_story(self.manager)) is None:
            return None
        return best[0].title

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Story id, category and timestamp of the last playback."""
        if (best := _last_played_story(self.manager)) is None:
            return None
        story, stats = best
        category = self.manager.data.categories.get(story.category_id)
        return {
            ATTR_STORY_ID: story.id,
            ATTR_CATEGORY: category.name if category else None,
            ATTR_PLAYED_AT: stats.last_played,
        }


class TotalPlaysSensor(BedtimeStoriesEntity, SensorEntity):
    """Total number of playbacks across the library."""

    _attr_translation_key = "total_plays"
    _attr_icon = "mdi:counter"
    _attr_state_class = SensorStateClass.TOTAL_INCREASING

    def __init__(self, manager: BedtimeStoriesManager) -> None:
        """Initialize the sensor."""
        super().__init__(manager)
        self._attr_unique_id = f"{manager.entry.entry_id}_total_plays"

    @property
    def native_value(self) -> int:
        """Sum of all play counters."""
        return sum(st.play_count for st in self.manager.data.stats.values())
