"""Service registration: bedtime_stories.play for automations and scripts."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv

from .const import (
    ATTR_MEDIA_PLAYER,
    ATTR_STORY_ID,
    DOMAIN,
    SERVICE_PLAY,
)

PLAY_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_STORY_ID): cv.string,
        vol.Optional(ATTR_MEDIA_PLAYER): cv.entity_id,
        vol.Optional("config_entry_id"): cv.string,
    }
)


async def async_setup_services(hass: HomeAssistant) -> None:
    """Register domain services (idempotent)."""
    if hass.services.has_service(DOMAIN, SERVICE_PLAY):
        return

    async def _handle_play(call: ServiceCall) -> None:
        from .manager import get_manager

        manager = get_manager(hass, call.data.get("config_entry_id"))
        if manager is None:
            raise HomeAssistantError(
                "Bedtime Stories is not loaded (or config_entry_id is required "
                "because multiple entries exist)"
            )
        await manager.async_play(
            call.data[ATTR_STORY_ID], call.data.get(ATTR_MEDIA_PLAYER)
        )

    hass.services.async_register(DOMAIN, SERVICE_PLAY, _handle_play, PLAY_SCHEMA)
