"""Entry setup/unload and entity platform tests."""

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


async def test_setup_creates_entities(hass: HomeAssistant, mock_entry: MockConfigEntry):
    await _setup(hass, mock_entry)

    select = hass.states.get("select.bedtime_stories_player")
    assert select is not None
    assert select.attributes["options"] == [
        "media_player.kinderzimmer",
        "media_player.handy",
    ]
    assert select.state == "media_player.kinderzimmer"

    assert hass.states.get("sensor.bedtime_stories_last_story") is not None
    total = hass.states.get("sensor.bedtime_stories_total_plays")
    assert total is not None
    assert total.state == "0"


async def test_no_select_without_players(hass: HomeAssistant):
    entry = MockConfigEntry(domain=DOMAIN, title="X", data={"name": "X", "players": []})
    await _setup(hass, entry)
    assert hass.states.get("select.x_player") is None


async def test_select_option_updates_manager(
    hass: HomeAssistant, mock_entry: MockConfigEntry
):
    await _setup(hass, mock_entry)
    await hass.services.async_call(
        "select",
        "select_option",
        {
            "entity_id": "select.bedtime_stories_player",
            "option": "media_player.handy",
        },
        blocking=True,
    )
    manager = hass.data[DOMAIN][mock_entry.entry_id]
    assert manager.current_player == "media_player.handy"


async def test_sensors_track_playback(hass: HomeAssistant, mock_entry: MockConfigEntry):
    await _setup(hass, mock_entry)
    manager = hass.data[DOMAIN][mock_entry.entry_id]
    category = await manager.async_save_category({"name": "Allgemein"})
    story = await manager.async_save_story(
        {
            "category_id": category.id,
            "title": "Leo Lausemaus",
            "media_content_id": "media-source://x",
        }
    )
    async_mock_service(hass, "media_player", "play_media")

    await manager.async_play(story.id)
    await hass.async_block_till_done()

    last = hass.states.get("sensor.bedtime_stories_last_story")
    assert last.state == "Leo Lausemaus"
    assert last.attributes["category"] == "Allgemein"
    assert hass.states.get("sensor.bedtime_stories_total_plays").state == "1"


async def test_play_service(hass: HomeAssistant, mock_entry: MockConfigEntry):
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

    await hass.services.async_call(
        DOMAIN,
        "play",
        {"story_id": story.id, "media_player": "media_player.wohnzimmer"},
        blocking=True,
    )
    assert calls[0].data["entity_id"] == ["media_player.wohnzimmer"]


async def test_two_entries_setup_without_route_conflict(
    hass: HomeAssistant, mock_entry: MockConfigEntry
):
    """Concurrent entries must not race into duplicate static-path routes."""
    import asyncio

    from homeassistant.config_entries import ConfigEntryState

    second = MockConfigEntry(
        domain=DOMAIN, title="Zweite", data={"name": "Zweite", "players": []}
    )
    mock_entry.add_to_hass(hass)
    second.add_to_hass(hass)
    results = await asyncio.gather(
        hass.config_entries.async_setup(mock_entry.entry_id),
        hass.config_entries.async_setup(second.entry_id),
    )
    await hass.async_block_till_done()
    assert results == [True, True]
    assert mock_entry.state is ConfigEntryState.LOADED
    assert second.state is ConfigEntryState.LOADED


async def test_unload_entry(hass: HomeAssistant, mock_entry: MockConfigEntry):
    await _setup(hass, mock_entry)
    assert await hass.config_entries.async_unload(mock_entry.entry_id)
    await hass.async_block_till_done()
    assert mock_entry.entry_id not in hass.data[DOMAIN]
