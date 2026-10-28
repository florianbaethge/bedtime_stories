"""Move legacy covers from "My media" into HA's image_upload store.

Before v0.3.0 the editor uploaded covers untouched into the local media
source. Those files are often multi-megabyte photos, and media_source serves
them full size behind a signed URL that changes on every resolve, so the
browser can never cache them. New uploads go through image_upload instead
(downscaled, served as cacheable thumbnails from a stable URL).

On startup this module gives every story whose cover is still a local
media_source id the same treatment: downscale a copy, store it in
image_upload and point the story at the thumbnail URL. The original file in
"My media" is left untouched. Once converted a story no longer matches, so
each cover is handled once; covers picked later from the media browser are
picked up on the next start.
"""

from __future__ import annotations

import io
import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any

from aiohttp.web_request import FileField
from homeassistant.util import raise_if_invalid_path
from multidict import CIMultiDict, CIMultiDictProxy

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from .manager import BedtimeStoriesManager

_LOGGER = logging.getLogger(__name__)

IMAGE_UPLOAD_DOMAIN = "image_upload"
LOCAL_MEDIA_PREFIX = "media-source://media_source/"

# Mirror the editor's upload path (_downscaleImage / _uploadCover).
MAX_DIMENSION = 1024
JPEG_QUALITY = 85
SERVE_SIZE = "512x512"


def is_legacy_cover(image: str | None) -> bool:
    """Return True for a cover that still points into the local media source."""
    return image is not None and image.startswith(LOCAL_MEDIA_PREFIX)


def _local_path(hass: HomeAssistant, media_id: str) -> Path | None:
    """Map a local media_source id onto its file, or None if it is not one."""
    source_dir_id, _, location = media_id.removeprefix(LOCAL_MEDIA_PREFIX).partition(
        "/"
    )
    base = hass.config.media_dirs.get(source_dir_id)
    if base is None or not location:
        return None
    try:
        raise_if_invalid_path(location)
    except ValueError:
        return None
    base_path = Path(base).resolve()
    path = (base_path / location).resolve()
    if not path.is_relative_to(base_path):
        return None
    return path


def _shrink(path: Path) -> tuple[bytes, str, str] | None:
    """Read and downscale a cover; returns (bytes, content type, filename).

    GIFs are kept as they are (animation); everything else is capped at
    MAX_DIMENSION and saved as JPEG, or PNG when it has transparency. Returns
    None when the file is missing or not an image Pillow can read.
    """
    from PIL import Image, ImageOps, UnidentifiedImageError

    if not path.is_file():
        return None
    try:
        with Image.open(path) as original:
            if original.format == "GIF":
                return path.read_bytes(), "image/gif", path.name
            image = ImageOps.exif_transpose(original)
            image.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
            buffer = io.BytesIO()
            if image.mode in ("RGBA", "LA") or "transparency" in image.info:
                image.save(buffer, format="PNG", optimize=True)
                return buffer.getvalue(), "image/png", f"{path.stem}.png"
            image.convert("RGB").save(
                buffer, format="JPEG", quality=JPEG_QUALITY, optimize=True
            )
            return buffer.getvalue(), "image/jpeg", f"{path.stem}.jpg"
    except (OSError, UnidentifiedImageError, ValueError):
        return None


async def _store_in_image_upload(
    hass: HomeAssistant, content: bytes, content_type: str, filename: str
) -> str:
    """Create an image_upload item from bytes; returns its id."""
    collection = hass.data[IMAGE_UPLOAD_DOMAIN]
    item: dict[str, Any] = await collection.async_create_item(
        {
            "file": FileField(
                name="file",
                filename=filename,
                file=io.BytesIO(content),  # type: ignore[arg-type]
                content_type=content_type,
                headers=CIMultiDictProxy(CIMultiDict()),
            )
        }
    )
    return str(item["id"])


async def async_optimize_legacy_covers(
    hass: HomeAssistant, manager: BedtimeStoriesManager
) -> int:
    """Convert legacy media_source covers of one library; returns how many."""
    if IMAGE_UPLOAD_DOMAIN not in hass.data:
        return 0
    pending = {
        story.id: story.image
        for story in manager.data.stories.values()
        if is_legacy_cover(story.image)
    }
    if not pending:
        return 0

    # Several stories may share one file; convert it only once.
    converted: dict[str, str | None] = {}
    for media_id in set(pending.values()):
        url: str | None = None
        path = _local_path(hass, media_id)
        shrunk = await hass.async_add_executor_job(_shrink, path) if path else None
        if shrunk is None:
            _LOGGER.debug("Leaving cover %s as is (not a readable image)", media_id)
        else:
            try:
                image_id = await _store_in_image_upload(hass, *shrunk)
            except Exception:
                _LOGGER.exception("Could not move cover %s to image_upload", media_id)
            else:
                url = f"/api/image/serve/{image_id}/{SERVE_SIZE}"
        converted[media_id] = url

    changed = 0
    for story_id, media_id in pending.items():
        story = manager.data.stories.get(story_id)
        url = converted.get(media_id)
        # The library may have been edited while we were busy converting.
        if story is None or story.image != media_id or url is None:
            continue
        story.image = url
        changed += 1

    if changed:
        await manager.async_save_and_notify()
        _LOGGER.info(
            "Optimized %d cover image(s) of %s for faster loading",
            changed,
            manager.name,
        )
    return changed
