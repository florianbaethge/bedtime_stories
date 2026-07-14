"""Bedtime Stories: a kid-friendly story library card with playback stats."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from homeassistant.helpers import config_validation as cv

from .const import CARD_REGISTERED_KEY, DOMAIN, WEBSOCKET_REGISTERED_KEY

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.typing import ConfigType

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up integration (YAML not used)."""
    from .services import async_setup_services

    hass.data.setdefault(DOMAIN, {})
    await async_setup_services(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Bedtime Stories from a config entry."""
    from homeassistant.const import Platform

    from .manager import BedtimeStoriesManager
    from .store import BedtimeStoriesStore

    store = BedtimeStoriesStore(hass, entry.entry_id)
    await store.async_load()

    manager = BedtimeStoriesManager(hass, entry, store)
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = manager

    await hass.config_entries.async_forward_entry_setups(
        entry, [Platform.SELECT, Platform.SENSOR]
    )
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    if not hass.data.get(WEBSOCKET_REGISTERED_KEY):
        from .websocket import async_register_websocket_api

        async_register_websocket_api(hass)
        hass.data[WEBSOCKET_REGISTERED_KEY] = True

    # Set the flag before awaiting: entries set up concurrently must not race
    # into a duplicate static-path registration (aiohttp raises RuntimeError).
    if not hass.data.get(CARD_REGISTERED_KEY):
        hass.data[CARD_REGISTERED_KEY] = True
        try:
            from .card import async_register_card

            await async_register_card(hass)
        except Exception:
            hass.data.pop(CARD_REGISTERED_KEY, None)
            raise

    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the entry when options (player list) change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload config entry."""
    from homeassistant.const import Platform

    unload_ok = await hass.config_entries.async_unload_platforms(
        entry, [Platform.SELECT, Platform.SENSOR]
    )
    if unload_ok:
        hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    return unload_ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Delete the store file when the entry is removed."""
    from .store import BedtimeStoriesStore

    store = BedtimeStoriesStore(hass, entry.entry_id)
    await store.async_remove()
