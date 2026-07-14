"""Store tests: persistence roundtrip and version migration."""

from __future__ import annotations

from custom_components.bedtime_stories.models import Category, PlayStats, Story
from custom_components.bedtime_stories.store import BedtimeStoriesStore
from homeassistant.core import HomeAssistant


async def test_load_empty(hass: HomeAssistant):
    store = BedtimeStoriesStore(hass, "entry1")
    data = await store.async_load()
    assert data.categories == {}
    assert data.stories == {}


async def test_save_and_reload(hass: HomeAssistant):
    store = BedtimeStoriesStore(hass, "entry1")
    await store.async_load()
    store.data.categories["c1"] = Category(id="c1", name="Allgemein")
    store.data.stories["s1"] = Story(
        id="s1", category_id="c1", title="Leo", media_content_id="x"
    )
    store.data.stats["s1"] = PlayStats(play_count=2, last_played="2026-07-04T19:00:00")
    await store.async_save()

    fresh = BedtimeStoriesStore(hass, "entry1")
    data = await fresh.async_load()
    assert data.categories["c1"].name == "Allgemein"
    assert data.stories["s1"].title == "Leo"
    assert data.stats["s1"].play_count == 2


async def test_migration_from_version_zero(hass: HomeAssistant):
    store = BedtimeStoriesStore(hass, "entry1")
    await store._store.async_save({"version": 0, "data": {"junk": True}})
    data = await store.async_load()
    assert data.categories == {}


async def test_remove(hass: HomeAssistant):
    store = BedtimeStoriesStore(hass, "entry1")
    await store.async_load()
    store.data.categories["c1"] = Category(id="c1", name="X")
    await store.async_save()
    await store.async_remove()

    fresh = BedtimeStoriesStore(hass, "entry1")
    data = await fresh.async_load()
    assert data.categories == {}
