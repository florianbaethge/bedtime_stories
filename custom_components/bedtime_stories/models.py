"""Dataclasses for the Bedtime Stories library (categories, stories, stats)."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Any

from .const import DEFAULT_CATEGORY_ICON


def new_id() -> str:
    """Return a short random id for categories and stories."""
    return uuid.uuid4().hex[:12]


@dataclass
class Category:
    """A group of stories shown as a sub-header in the card."""

    id: str
    name: str
    icon: str = DEFAULT_CATEGORY_ICON
    order: int = 0

    def to_dict(self) -> dict[str, Any]:
        """Serialize for storage / WebSocket."""
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "order": self.order,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Category:
        """Deserialize; tolerate missing optional fields."""
        return cls(
            id=str(data["id"]),
            name=str(data.get("name", "")),
            icon=str(data.get("icon") or DEFAULT_CATEGORY_ICON),
            order=int(data.get("order", 0)),
        )


@dataclass
class Story:
    """A single story/song tile: cover image plus a playable media item."""

    id: str
    category_id: str
    title: str
    image: str | None = None
    media_content_id: str = ""
    media_content_type: str = "audio/mpeg"
    duration_min: int | None = None
    order: int = 0

    def to_dict(self) -> dict[str, Any]:
        """Serialize for storage / WebSocket."""
        return {
            "id": self.id,
            "category_id": self.category_id,
            "title": self.title,
            "image": self.image,
            "media_content_id": self.media_content_id,
            "media_content_type": self.media_content_type,
            "duration_min": self.duration_min,
            "order": self.order,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Story:
        """Deserialize; tolerate missing optional fields."""
        duration = data.get("duration_min")
        return cls(
            id=str(data["id"]),
            category_id=str(data.get("category_id", "")),
            title=str(data.get("title", "")),
            image=data.get("image") or None,
            media_content_id=str(data.get("media_content_id", "")),
            media_content_type=str(data.get("media_content_type") or "audio/mpeg"),
            duration_min=int(duration) if duration not in (None, "") else None,
            order=int(data.get("order", 0)),
        )


@dataclass
class PlayStats:
    """Play counter and last-played timestamp for one story."""

    play_count: int = 0
    last_played: str | None = None  # ISO timestamp, local timezone

    def to_dict(self) -> dict[str, Any]:
        """Serialize for storage / WebSocket."""
        return {"play_count": self.play_count, "last_played": self.last_played}

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> PlayStats:
        """Deserialize; tolerate missing optional fields."""
        return cls(
            play_count=int(data.get("play_count", 0)),
            last_played=data.get("last_played") or None,
        )


@dataclass
class LibraryData:
    """Everything one config entry persists."""

    categories: dict[str, Category] = field(default_factory=dict)
    stories: dict[str, Story] = field(default_factory=dict)
    stats: dict[str, PlayStats] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Serialize for storage."""
        return {
            "categories": [c.to_dict() for c in self.categories.values()],
            "stories": [s.to_dict() for s in self.stories.values()],
            "stats": {sid: st.to_dict() for sid, st in self.stats.items()},
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> LibraryData:
        """Deserialize; drop stats of stories that no longer exist."""
        categories = {
            c["id"]: Category.from_dict(c) for c in data.get("categories", [])
        }
        stories = {s["id"]: Story.from_dict(s) for s in data.get("stories", [])}
        stats = {
            sid: PlayStats.from_dict(st)
            for sid, st in (data.get("stats") or {}).items()
            if sid in stories
        }
        return cls(categories=categories, stories=stories, stats=stats)
