"""Manager tests: CRUD, player resolution, playback side effects."""

from __future__ import annotations

import pytest
from custom_components.bedtime_stories.const import DOMAIN, EVENT_STORY_PLAYED
from custom_components.bedtime_stories.manager import (
    BedtimeStoriesManager,
    get_manager,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_mock_service,
)


async def _setup(hass: HomeAssistant, entry: MockConfigEntry) -> BedtimeStoriesManager:
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    manager = hass.data[DOMAIN][entry.entry_id]
    assert isinstance(manager, BedtimeStoriesManager)
    return manager


async def _add_story(manager: BedtimeStoriesManager) -> str:
    category = await manager.async_save_category({"name": "Allgemein"})
    story = await manager.async_save_story(
        {
            "category_id": category.id,
            "title": "Leo Lausemaus",
            "media_content_id": "media-source://media_source/local/leo.m4a",
            "media_content_type": "audio/mp4",
            "duration_min": 20,
        }
    )
    return story.id


async def test_category_and_story_crud(
    hass: HomeAssistant, mock_entry: MockConfigEntry
):
    manager = await _setup(hass, mock_entry)
    category = await manager.async_save_category({"name": "Märchen"})
    assert manager.data.categories[category.id].name == "Märchen"

    story = await manager.async_save_story(
        {
            "category_id": category.id,
            "title": "Frau Holle",
            "media_content_id": "media-source://x",
        }
    )
    assert manager.data.stories[story.id].title == "Frau Holle"

    # Deleting the category cascades to stories and stats.
    await manager.async_delete_category(category.id)
    assert manager.data.categories == {}
    assert manager.data.stories == {}


async def test_story_validation(hass: HomeAssistant, mock_entry: MockConfigEntry):
    manager = await _setup(hass, mock_entry)
    with pytest.raises(HomeAssistantError):
        await manager.async_save_category({"name": "  "})
    with pytest.raises(HomeAssistantError):
        await manager.async_save_story(
            {"category_id": "missing", "title": "X", "media_content_id": "y"}
        )
    category = await manager.async_save_category({"name": "Allgemein"})
    with pytest.raises(HomeAssistantError):
        await manager.async_save_story(
            {"category_id": category.id, "title": "X", "media_content_id": ""}
        )


async def test_reorder_categories(hass: HomeAssistant, mock_entry: MockConfigEntry):
    manager = await _setup(hass, mock_entry)
    first = await manager.async_save_category({"name": "A"})
    second = await manager.async_save_category({"name": "B"})
    await manager.async_reorder_categories([second.id, first.id])
    snapshot = manager.snapshot()
    assert [c["id"] for c in snapshot["categories"]] == [second.id, first.id]


async def test_reorder_stories(hass: HomeAssistant, mock_entry: MockConfigEntry):
    manager = await _setup(hass, mock_entry)
    category = await manager.async_save_category({"name": "A"})
    first = await manager.async_save_story(
        {"category_id": category.id, "title": "One", "media_content_id": "ms://a"}
    )
    second = await manager.async_save_story(
        {"category_id": category.id, "title": "Two", "media_content_id": "ms://b"}
    )
    await manager.async_reorder_stories([second.id, first.id])
    stories = [
        s for s in manager.snapshot()["stories"] if s["category_id"] == category.id
    ]
    assert [s["id"] for s in stories] == [second.id, first.id]


async def test_update_preserves_manual_order(
    hass: HomeAssistant, mock_entry: MockConfigEntry
):
    """Editing an item without an explicit order keeps its position."""
    manager = await _setup(hass, mock_entry)
    category = await manager.async_save_category({"name": "A"})
    first = await manager.async_save_story(
        {"category_id": category.id, "title": "One", "media_content_id": "ms://a"}
    )
    second = await manager.async_save_story(
        {"category_id": category.id, "title": "Two", "media_content_id": "ms://b"}
    )
    await manager.async_reorder_stories([second.id, first.id])  # second=0, first=1

    await manager.async_save_story(
        {
            "id": second.id,
            "category_id": category.id,
            "title": "Two!",
            "media_content_id": "ms://b",
        }
    )
    assert manager.data.stories[second.id].order == 0
    assert manager.data.stories[second.id].title == "Two!"

    other = await manager.async_save_category({"name": "B"})
    await manager.async_reorder_categories([other.id, category.id])  # category=1
    await manager.async_save_category({"id": category.id, "name": "A!"})
    assert manager.data.categories[category.id].order == 1


async def test_play_updates_stats_and_fires_event(
    hass: HomeAssistant, mock_entry: MockConfigEntry
):
    manager = await _setup(hass, mock_entry)
    story_id = await _add_story(manager)
    calls = async_mock_service(hass, "media_player", "play_media")
    events = []
    hass.bus.async_listen(EVENT_STORY_PLAYED, events.append)

    await manager.async_play(story_id, "media_player.explicit")
    await hass.async_block_till_done()

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["media_player.explicit"]
    assert (
        calls[0].data["media_content_id"] == "media-source://media_source/local/leo.m4a"
    )
    assert calls[0].data["extra"]["metadata"]["title"] == "Leo Lausemaus"

    stats = manager.data.stats[story_id]
    assert stats.play_count == 1
    assert stats.last_played is not None

    assert len(events) == 1
    assert events[0].data["title"] == "Leo Lausemaus"
    assert events[0].data["media_player"] == "media_player.explicit"
    assert events[0].data["category"] == "Allgemein"


async def test_play_record_only_skips_cast(
    hass: HomeAssistant, mock_entry: MockConfigEntry
):
    """'This device' playback records stats + event without casting."""
    manager = await _setup(hass, mock_entry)
    story_id = await _add_story(manager)
    calls = async_mock_service(hass, "media_player", "play_media")
    events = []
    hass.bus.async_listen(EVENT_STORY_PLAYED, events.append)

    await manager.async_play(story_id, record_only=True, source="Dieses Gerät")
    await hass.async_block_till_done()

    assert len(calls) == 0  # nothing was cast to a media player
    assert manager.data.stats[story_id].play_count == 1
    assert len(events) == 1
    assert events[0].data["media_player"] == "Dieses Gerät"


async def test_player_resolution_priority(
    hass: HomeAssistant, mock_entry: MockConfigEntry
):
    manager = await _setup(hass, mock_entry)
    story_id = await _add_story(manager)
    calls = async_mock_service(hass, "media_player", "play_media")

    # The select entity synced its restored choice into the manager.
    assert manager.current_player == "media_player.kinderzimmer"
    await manager.async_play(story_id)
    assert calls[-1].data["entity_id"] == ["media_player.kinderzimmer"]

    # Explicit override wins over the select choice.
    await manager.async_play(story_id, "media_player.handy")
    assert calls[-1].data["entity_id"] == ["media_player.handy"]


async def test_play_without_any_player_fails(hass: HomeAssistant):
    entry = MockConfigEntry(domain=DOMAIN, title="X", data={"name": "X", "players": []})
    manager = await _setup(hass, entry)
    story_id = await _add_story(manager)
    with pytest.raises(HomeAssistantError):
        await manager.async_play(story_id)


async def test_play_unknown_story(hass: HomeAssistant, mock_entry: MockConfigEntry):
    manager = await _setup(hass, mock_entry)
    with pytest.raises(HomeAssistantError):
        await manager.async_play("nope")


async def test_reset_stats(hass: HomeAssistant, mock_entry: MockConfigEntry):
    manager = await _setup(hass, mock_entry)
    story_id = await _add_story(manager)
    async_mock_service(hass, "media_player", "play_media")
    await manager.async_play(story_id, "media_player.x")
    assert manager.data.stats[story_id].play_count == 1
    await manager.async_reset_stats(story_id)
    assert story_id not in manager.data.stats


async def test_get_manager_resolution(hass: HomeAssistant, mock_entry: MockConfigEntry):
    manager = await _setup(hass, mock_entry)
    assert get_manager(hass, None) is manager
    assert get_manager(hass, mock_entry.entry_id) is manager
    assert get_manager(hass, "unknown") is None


async def test_snapshot_contains_players_and_select(
    hass: HomeAssistant, mock_entry: MockConfigEntry
):
    manager = await _setup(hass, mock_entry)
    snapshot = manager.snapshot()
    assert [p["entity_id"] for p in snapshot["players"]] == [
        "media_player.kinderzimmer",
        "media_player.handy",
    ]
    assert snapshot["select_entity"] is not None
    assert snapshot["current_player"] == "media_player.kinderzimmer"
