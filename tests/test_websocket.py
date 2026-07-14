"""WebSocket API tests via the real websocket client."""

from __future__ import annotations

from custom_components.bedtime_stories.const import DOMAIN
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_mock_service,
)


async def _setup(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


async def test_category_and_story_lifecycle(
    hass: HomeAssistant, hass_ws_client, mock_entry: MockConfigEntry
):
    await _setup(hass, mock_entry)
    client = await hass_ws_client(hass)

    await client.send_json(
        {
            "id": 1,
            "type": f"{DOMAIN}/category/save",
            "category": {"name": "Märchen", "icon": "mdi:castle"},
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    category_id = msg["result"]["id"]

    await client.send_json(
        {
            "id": 2,
            "type": f"{DOMAIN}/story/save",
            "story": {
                "category_id": category_id,
                "title": "Frau Holle",
                "media_content_id": "media-source://x",
                "duration_min": 8,
            },
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    story_id = msg["result"]["id"]

    await client.send_json({"id": 3, "type": f"{DOMAIN}/get"})
    msg = await client.receive_json()
    assert msg["success"]
    snapshot = msg["result"]
    assert snapshot["categories"][0]["name"] == "Märchen"
    assert snapshot["stories"][0]["id"] == story_id

    await client.send_json(
        {"id": 4, "type": f"{DOMAIN}/story/delete", "story_id": story_id}
    )
    msg = await client.receive_json()
    assert msg["success"]

    await client.send_json(
        {"id": 5, "type": f"{DOMAIN}/category/delete", "category_id": category_id}
    )
    msg = await client.receive_json()
    assert msg["success"]

    await client.send_json({"id": 6, "type": f"{DOMAIN}/get"})
    msg = await client.receive_json()
    assert msg["result"]["categories"] == []


async def test_invalid_story_rejected(
    hass: HomeAssistant, hass_ws_client, mock_entry: MockConfigEntry
):
    await _setup(hass, mock_entry)
    client = await hass_ws_client(hass)
    await client.send_json(
        {
            "id": 1,
            "type": f"{DOMAIN}/story/save",
            "story": {"category_id": "missing", "title": "X", "media_content_id": "y"},
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_format"


async def test_play_via_websocket(
    hass: HomeAssistant, hass_ws_client, mock_entry: MockConfigEntry
):
    await _setup(hass, mock_entry)
    manager = hass.data[DOMAIN][mock_entry.entry_id]
    category = await manager.async_save_category({"name": "Allgemein"})
    story = await manager.async_save_story(
        {
            "category_id": category.id,
            "title": "Leo",
            "media_content_id": "media-source://x",
        }
    )
    calls = async_mock_service(hass, "media_player", "play_media")
    client = await hass_ws_client(hass)

    await client.send_json({"id": 1, "type": f"{DOMAIN}/play", "story_id": story.id})
    msg = await client.receive_json()
    assert msg["success"]
    assert len(calls) == 1

    await client.send_json({"id": 2, "type": f"{DOMAIN}/play", "story_id": "unknown"})
    msg = await client.receive_json()
    assert not msg["success"]


async def test_subscribe_pushes_updates(
    hass: HomeAssistant, hass_ws_client, mock_entry: MockConfigEntry
):
    await _setup(hass, mock_entry)
    client = await hass_ws_client(hass)

    await client.send_json({"id": 1, "type": f"{DOMAIN}/subscribe"})
    msg = await client.receive_json()
    assert msg["success"]
    msg = await client.receive_json()  # initial snapshot
    assert msg["event"]["categories"] == []

    manager = hass.data[DOMAIN][mock_entry.entry_id]
    await manager.async_save_category({"name": "Neu"})
    msg = await client.receive_json()
    assert msg["event"]["categories"][0]["name"] == "Neu"


async def test_entries_list(
    hass: HomeAssistant, hass_ws_client, mock_entry: MockConfigEntry
):
    await _setup(hass, mock_entry)
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": f"{DOMAIN}/entries/list"})
    msg = await client.receive_json()
    assert msg["result"] == [
        {"entry_id": mock_entry.entry_id, "name": "Bedtime Stories"}
    ]
