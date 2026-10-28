"""Legacy cover optimization (media_source → image_upload)."""

from __future__ import annotations

from pathlib import Path

import pytest
from custom_components.bedtime_stories.const import DOMAIN
from custom_components.bedtime_stories.covers import (
    MAX_DIMENSION,
    async_optimize_legacy_covers,
)
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from PIL import Image
from pytest_homeassistant_custom_component.common import MockConfigEntry

LOCAL = "media-source://media_source/local"


@pytest.fixture
def media_dir(hass: HomeAssistant, tmp_path: Path) -> Path:
    """Point the local media source at a temp folder."""
    folder = tmp_path / "media"
    folder.mkdir()
    hass.config.media_dirs = {"local": str(folder)}
    return folder


def _write_image(path: Path, size: tuple[int, int], mode: str = "RGB") -> None:
    Image.new(mode, size, (200, 100, 50, 128)[: len(mode)]).save(path)


async def _setup(hass: HomeAssistant, entry: MockConfigEntry):
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)
    return hass.data[DOMAIN][entry.entry_id]


async def _story(manager, image: str | None):
    category = next(iter(manager.data.categories.values()), None)
    if category is None:
        category = await manager.async_save_category({"name": "Allgemein"})
    return await manager.async_save_story(
        {
            "category_id": category.id,
            "title": "Leo",
            "media_content_id": "media-source://x",
            "image": image,
        }
    )


def _stored_size(hass: HomeAssistant, url: str) -> tuple[int, int]:
    image_id = url.split("/")[4]
    with Image.open(Path(hass.config.path("image")) / image_id / "original") as img:
        return img.size


async def test_converts_large_local_cover(
    hass: HomeAssistant, mock_entry: MockConfigEntry, media_dir: Path
):
    _write_image(media_dir / "big.png", (3000, 2000))
    assert await async_setup_component(hass, "image_upload", {})
    manager = await _setup(hass, mock_entry)
    story = await _story(manager, f"{LOCAL}/big.png")

    assert await async_optimize_legacy_covers(hass, manager) == 1

    image = manager.data.stories[story.id].image
    assert image.startswith("/api/image/serve/")
    assert image.endswith("/512x512")
    width, height = _stored_size(hass, image)
    assert max(width, height) == MAX_DIMENSION
    # The user's original in "My media" stays where it was.
    assert (media_dir / "big.png").is_file()


async def test_shared_file_is_stored_once(
    hass: HomeAssistant, mock_entry: MockConfigEntry, media_dir: Path
):
    _write_image(media_dir / "shared.jpg", (800, 600))
    assert await async_setup_component(hass, "image_upload", {})
    manager = await _setup(hass, mock_entry)
    first = await _story(manager, f"{LOCAL}/shared.jpg")
    second = await _story(manager, f"{LOCAL}/shared.jpg")

    assert await async_optimize_legacy_covers(hass, manager) == 2
    assert manager.data.stories[first.id].image == manager.data.stories[second.id].image
    assert len(hass.data["image_upload"].data) == 1


async def test_leaves_other_covers_alone(
    hass: HomeAssistant, mock_entry: MockConfigEntry, media_dir: Path
):
    (media_dir / "not-an-image.png").write_text("nope")
    assert await async_setup_component(hass, "image_upload", {})
    manager = await _setup(hass, mock_entry)
    covers = [
        "/api/image/serve/abc/512x512",
        "https://example.com/cover.jpg",
        f"{LOCAL}/missing.png",
        f"{LOCAL}/not-an-image.png",
        f"{LOCAL}/../escape.png",
        None,
    ]
    stories = [await _story(manager, cover) for cover in covers]

    assert await async_optimize_legacy_covers(hass, manager) == 0
    assert [manager.data.stories[s.id].image for s in stories] == covers


async def test_noop_without_image_upload(
    hass: HomeAssistant, mock_entry: MockConfigEntry, media_dir: Path
):
    _write_image(media_dir / "big.png", (3000, 2000))
    manager = await _setup(hass, mock_entry)
    story = await _story(manager, f"{LOCAL}/big.png")

    assert await async_optimize_legacy_covers(hass, manager) == 0
    assert manager.data.stories[story.id].image == f"{LOCAL}/big.png"


async def test_runs_on_setup(
    hass: HomeAssistant, mock_entry: MockConfigEntry, media_dir: Path, hass_storage
):
    _write_image(media_dir / "big.png", (3000, 2000))
    hass_storage[f"{DOMAIN}.{mock_entry.entry_id}"] = {
        "version": 1,
        "key": f"{DOMAIN}.{mock_entry.entry_id}",
        "data": {
            "version": 1,
            "data": {
                "categories": [{"id": "c1", "name": "Allgemein"}],
                "stories": [
                    {
                        "id": "s1",
                        "category_id": "c1",
                        "title": "Leo",
                        "image": f"{LOCAL}/big.png",
                        "media_content_id": "media-source://x",
                    }
                ],
            },
        },
    }
    assert await async_setup_component(hass, "image_upload", {})
    manager = await _setup(hass, mock_entry)

    assert manager.data.stories["s1"].image.startswith("/api/image/serve/")
