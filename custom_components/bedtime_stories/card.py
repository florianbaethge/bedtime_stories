"""Serve the Lovelace card and auto-register it as a dashboard resource."""

from __future__ import annotations

import logging
import os
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    CARD_FILENAME,
    CARD_FOLDER,
    CARD_URL,
    CUSTOM_COMPONENTS,
    INTEGRATION_FOLDER,
    INTEGRATION_VERSION,
)

_LOGGER = logging.getLogger(__name__)


def _versioned_url(card_file: str) -> str:
    """Card URL with version + mtime cache-buster."""
    try:
        cache_bust = int(os.path.getmtime(card_file))
    except OSError:
        _LOGGER.warning("Card file missing at %s", card_file)
        cache_bust = 0
    return f"{CARD_URL}?v={INTEGRATION_VERSION}&m={cache_bust}"


def _lovelace_resources(hass: HomeAssistant) -> Any | None:
    """Return the Lovelace resource collection in storage mode, else None."""
    lovelace = hass.data.get("lovelace")
    if lovelace is None:
        return None
    if isinstance(lovelace, dict):  # HA < 2024.x kept a plain dict here
        if lovelace.get("mode") != "storage":
            return None
        return lovelace.get("resources")
    # HA 2026.x renamed LovelaceData.mode to resource_mode.
    mode = getattr(lovelace, "resource_mode", None) or getattr(lovelace, "mode", None)
    if mode != "storage":
        return None
    return getattr(lovelace, "resources", None)


async def async_register_card(hass: HomeAssistant) -> None:
    """Serve the card JS and add/refresh the Lovelace resource entry."""
    root_dir = os.path.join(hass.config.path(CUSTOM_COMPONENTS), INTEGRATION_FOLDER)
    card_file = os.path.join(root_dir, CARD_FOLDER, CARD_FILENAME)

    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, card_file, cache_headers=False)]
        )
    except RuntimeError:
        # Route already registered (e.g. leftover from a failed setup attempt).
        _LOGGER.debug("Static path %s already registered", CARD_URL)

    resources = _lovelace_resources(hass)
    if resources is None or not hasattr(resources, "async_items"):
        _LOGGER.info(
            "Lovelace runs in YAML mode; add %s as a dashboard resource manually",
            CARD_URL,
        )
        return

    if not getattr(resources, "loaded", True):
        await resources.async_load()
        resources.loaded = True

    url = _versioned_url(card_file)
    existing = [
        item
        for item in resources.async_items()
        if str(item.get("url", "")).startswith(CARD_URL)
    ]
    if not existing:
        await resources.async_create_item({"res_type": "module", "url": url})
        _LOGGER.info("Registered Lovelace resource %s", url)
        return
    for item in existing:
        if item.get("url") != url:
            await resources.async_update_item(
                item["id"], {"res_type": "module", "url": url}
            )
            _LOGGER.info("Updated Lovelace resource to %s", url)
