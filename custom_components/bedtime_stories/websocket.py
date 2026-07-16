"""WebSocket API for the Lovelace card.

Read/play commands are available to every user (the card runs on kid-facing
dashboards); library mutations require admin (card editor).
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN
from .manager import BedtimeStoriesManager, get_manager

_LOGGER = logging.getLogger(__name__)

ERR_NOT_FOUND = "not_found"
ERR_INVALID = "invalid_format"


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register all WebSocket commands."""
    websocket_api.async_register_command(hass, ws_entries_list)
    websocket_api.async_register_command(hass, ws_get)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_play)
    websocket_api.async_register_command(hass, ws_category_save)
    websocket_api.async_register_command(hass, ws_category_delete)
    websocket_api.async_register_command(hass, ws_category_reorder)
    websocket_api.async_register_command(hass, ws_story_save)
    websocket_api.async_register_command(hass, ws_story_delete)
    websocket_api.async_register_command(hass, ws_story_reorder)
    websocket_api.async_register_command(hass, ws_stats_reset)


def _resolve_or_error(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> BedtimeStoriesManager | None:
    """Resolve the manager or send a not-found error."""
    manager = get_manager(hass, msg.get("entry_id"))
    if manager is None:
        connection.send_error(msg["id"], ERR_NOT_FOUND, "Config entry not loaded")
    return manager


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/entries/list"})
@callback
def ws_entries_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List loaded config entries for the card editor's entry picker."""
    result = [
        {"entry_id": entry_id, "name": manager.name}
        for entry_id, manager in hass.data.get(DOMAIN, {}).items()
        if isinstance(manager, BedtimeStoriesManager)
    ]
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/get",
        vol.Optional("entry_id"): str,
    }
)
@callback
def ws_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the full library snapshot."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    connection.send_result(msg["id"], manager.snapshot())


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/subscribe",
        vol.Optional("entry_id"): str,
    }
)
@callback
def ws_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Push the library snapshot on every change."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return

    @callback
    def _push() -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], manager.snapshot())
        )

    connection.subscriptions[msg["id"]] = manager.async_add_listener(_push)
    connection.send_result(msg["id"])
    _push()


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/play",
        vol.Optional("entry_id"): str,
        vol.Required("story_id"): str,
        vol.Optional("media_player"): str,
    }
)
@websocket_api.async_response
async def ws_play(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Play a story (card tap)."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    try:
        result = await manager.async_play(msg["story_id"], msg.get("media_player"))
    except HomeAssistantError as err:
        connection.send_error(msg["id"], ERR_INVALID, str(err))
        return
    connection.send_result(msg["id"], {"success": True, **result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/category/save",
        vol.Optional("entry_id"): str,
        vol.Required("category"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_category_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create or update a category."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    try:
        category = await manager.async_save_category(msg["category"])
    except HomeAssistantError as err:
        connection.send_error(msg["id"], ERR_INVALID, str(err))
        return
    connection.send_result(msg["id"], {"success": True, "id": category.id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/category/delete",
        vol.Optional("entry_id"): str,
        vol.Required("category_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_category_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a category including its stories."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    try:
        await manager.async_delete_category(msg["category_id"])
    except HomeAssistantError as err:
        connection.send_error(msg["id"], ERR_NOT_FOUND, str(err))
        return
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/category/reorder",
        vol.Optional("entry_id"): str,
        vol.Required("category_ids"): [str],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_category_reorder(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Apply a new category order."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    await manager.async_reorder_categories(msg["category_ids"])
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/story/save",
        vol.Optional("entry_id"): str,
        vol.Required("story"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_story_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create or update a story."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    try:
        story = await manager.async_save_story(msg["story"])
    except HomeAssistantError as err:
        connection.send_error(msg["id"], ERR_INVALID, str(err))
        return
    connection.send_result(msg["id"], {"success": True, "id": story.id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/story/delete",
        vol.Optional("entry_id"): str,
        vol.Required("story_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_story_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a story."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    try:
        await manager.async_delete_story(msg["story_id"])
    except HomeAssistantError as err:
        connection.send_error(msg["id"], ERR_NOT_FOUND, str(err))
        return
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/story/reorder",
        vol.Optional("entry_id"): str,
        vol.Required("story_ids"): [str],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_story_reorder(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Apply a new story order (within a category)."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    await manager.async_reorder_stories(msg["story_ids"])
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/stats/reset",
        vol.Optional("entry_id"): str,
        vol.Optional("story_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_stats_reset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Reset play statistics for one story or all."""
    if (manager := _resolve_or_error(hass, connection, msg)) is None:
        return
    await manager.async_reset_stats(msg.get("story_id"))
    connection.send_result(msg["id"], {"success": True})
