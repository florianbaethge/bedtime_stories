"""Player select: switch the playback target from any dashboard or automation."""

from __future__ import annotations

import logging

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import DOMAIN
from .entity import BedtimeStoriesEntity
from .manager import BedtimeStoriesManager

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Create the player select when players are configured."""
    manager: BedtimeStoriesManager = hass.data[DOMAIN][entry.entry_id]
    if not manager.players:
        _LOGGER.info(
            "No media players configured for %s; skipping player select entity",
            manager.name,
        )
        return
    async_add_entities([BedtimeStoriesPlayerSelect(manager)])


class BedtimeStoriesPlayerSelect(BedtimeStoriesEntity, SelectEntity, RestoreEntity):
    """Which media player stories are cast to (external toggle friendly)."""

    _attr_translation_key = "player"
    _attr_icon = "mdi:cast-audio"

    def __init__(self, manager: BedtimeStoriesManager) -> None:
        """Initialize the select."""
        super().__init__(manager)
        self._attr_unique_id = f"{manager.entry.entry_id}_player"
        self._attr_options = manager.players

    async def async_added_to_hass(self) -> None:
        """Restore the previous choice and publish it to the manager."""
        await super().async_added_to_hass()
        restored = await self.async_get_last_state()
        if restored and restored.state in self.options:
            self._attr_current_option = restored.state
        else:
            self._attr_current_option = self.options[0]
        self.manager.current_player = self._attr_current_option
        self.async_write_ha_state()

    async def async_select_option(self, option: str) -> None:
        """Change the playback target."""
        self._attr_current_option = option
        self.manager.current_player = option
        self.async_write_ha_state()
