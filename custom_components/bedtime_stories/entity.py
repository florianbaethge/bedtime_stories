"""Base entity: shared device info and manager change subscription."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, INTEGRATION_VERSION
from .manager import BedtimeStoriesManager


class BedtimeStoriesEntity(Entity):
    """Entity bound to one Bedtime Stories config entry."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, manager: BedtimeStoriesManager) -> None:
        """Initialize with shared device info."""
        self.manager = manager
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, manager.entry.entry_id)},
            name=manager.name,
            manufacturer="Bedtime Stories",
            model="Story library",
            sw_version=INTEGRATION_VERSION,
            entry_type=DeviceEntryType.SERVICE,
        )

    async def async_added_to_hass(self) -> None:
        """Refresh on every library change."""
        await super().async_added_to_hass()
        self.async_on_remove(self.manager.async_add_listener(self.async_write_ha_state))
