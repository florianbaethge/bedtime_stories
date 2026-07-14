"""Constants for Bedtime Stories."""

from typing import Final

from .version import __version__

DOMAIN: Final = "bedtime_stories"

INTEGRATION_VERSION: Final = __version__

CUSTOM_COMPONENTS: Final = "custom_components"
INTEGRATION_FOLDER: Final = DOMAIN

# --- Lovelace card ---
CARD_FOLDER: Final = "frontend"
CARD_FILENAME: Final = "dist/bedtime-stories-card.js"
CARD_URL: Final = "/bedtime_stories/bedtime-stories-card.js"

CARD_REGISTERED_KEY: Final = "_bedtime_stories_card_registered"
WEBSOCKET_REGISTERED_KEY: Final = "_bedtime_stories_websocket_registered"

STORE_VERSION: Final = 1

# --- Config entry ---
CONF_NAME: Final = "name"
CONF_PLAYERS: Final = "players"

# --- Events (picked up by logbook.py -> HA activity feed) ---
EVENT_STORY_PLAYED: Final = f"{DOMAIN}_story_played"

# --- Services ---
SERVICE_PLAY: Final = "play"

ATTR_STORY_ID: Final = "story_id"
ATTR_MEDIA_PLAYER: Final = "media_player"
ATTR_TITLE: Final = "title"
ATTR_CATEGORY: Final = "category"
ATTR_PLAYED_AT: Final = "played_at"

DEFAULT_CATEGORY_ICON: Final = "mdi:teddy-bear"
