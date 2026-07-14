"""Pure model tests: serialization roundtrips and tolerant parsing."""

from __future__ import annotations

from custom_components.bedtime_stories.models import (
    Category,
    LibraryData,
    PlayStats,
    Story,
    new_id,
)


def test_new_id_is_unique_and_short():
    ids = {new_id() for _ in range(100)}
    assert len(ids) == 100
    assert all(len(i) == 12 for i in ids)


def test_category_roundtrip():
    category = Category(id="c1", name="Märchen", icon="mdi:castle", order=2)
    assert Category.from_dict(category.to_dict()) == category


def test_category_defaults():
    category = Category.from_dict({"id": "c1"})
    assert category.name == ""
    assert category.icon == "mdi:teddy-bear"
    assert category.order == 0


def test_story_roundtrip():
    story = Story(
        id="s1",
        category_id="c1",
        title="Leo Lausemaus",
        image="/api/image/serve/abc/512x512",
        media_content_id="media-source://media_source/local/leo.m4a",
        media_content_type="audio/mp4",
        duration_min=20,
        order=1,
    )
    assert Story.from_dict(story.to_dict()) == story


def test_story_defaults_and_empty_duration():
    story = Story.from_dict({"id": "s1", "duration_min": ""})
    assert story.duration_min is None
    assert story.media_content_type == "audio/mpeg"
    assert story.image is None


def test_play_stats_roundtrip():
    stats = PlayStats(play_count=3, last_played="2026-07-04T19:00:00+02:00")
    assert PlayStats.from_dict(stats.to_dict()) == stats


def test_library_roundtrip_drops_orphan_stats():
    library = LibraryData(
        categories={"c1": Category(id="c1", name="Allgemein")},
        stories={
            "s1": Story(id="s1", category_id="c1", title="A", media_content_id="x")
        },
        stats={"s1": PlayStats(play_count=1)},
    )
    raw = library.to_dict()
    raw["stats"]["ghost"] = {"play_count": 5}
    restored = LibraryData.from_dict(raw)
    assert set(restored.stats) == {"s1"}
    assert restored.categories["c1"].name == "Allgemein"
    assert restored.stories["s1"].title == "A"


def test_library_from_empty_dict():
    library = LibraryData.from_dict({})
    assert library.categories == {}
    assert library.stories == {}
    assert library.stats == {}
