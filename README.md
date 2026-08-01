[![CI](https://github.com/florianbaethge/bedtime_stories/actions/workflows/ci.yml/badge.svg)](https://github.com/florianbaethge/bedtime_stories/actions/workflows/ci.yml)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<p align="center">
  <img
    src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/bedtime-stories-logo.png"
    alt="Bedtime Stories"
    width="760"
  >
</p>

A kid-friendly story library for Home Assistant: a custom integration plus a
Lovelace card (`bedtime-stories-card`) that shows big, tappable cover tiles
grouped by category. One tap casts the story to a speaker — perfect for the
evening ritual.

Built as the successor to a hand-made wall of `picture-glance` cards: instead
of maintaining dozens of YAML cards, you manage categories and stories in a
graphical editor, and get play statistics, sorting and a switchable playback
target on top.

## Screenshots

<p align="center">
  <img
    src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_grid.png"
    alt="Grid layout — cover tiles grouped by category"
    width="460"
  >
</p>

<p align="center"><em>Grid layout — big, tappable cover tiles grouped by category.</em></p>

<p align="center">
  <img
    src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_stats.png"
    alt="Play statistics and in-card sort chips"
    width="460"
  >
  <img
    src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_list.png"
    alt="Compact list layout with playback controls"
    width="460"
  >
</p>

<p align="center"><em>Play statistics with sort chips (favorites first) · compact list layout with a playback target chip.</em></p>

<p align="center">
  <img
    src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_editor.png"
    alt="Bedtime Stories card editor with a live preview"
    width="620"
  >
</p>

<p align="center"><em>The graphical card editor — display options on the left, a live preview on the right.</em></p>

## Features

- **Full-width dashboard card** with a graphical editor (no YAML required)
- **Categories** shown as sub-headers with icons (e.g. "General",
  "Astrid Lindgren", "Fairy tales")
- **Stories** with title, cover image (browse the media library or upload
  straight from the editor — uploaded covers are automatically resized and
  cached, so the app never re-downloads full-size artwork), duration badge
  (`~20m`) and a media file picked from the media browser (local media upload
  works there too) or any URL
- **Layout options**: grid with column count, or list with cozy/compact
  density, show/hide titles and duration
- **Play statistics**: optional per-tile line ("played 12× · 2 days ago"),
  a `sensor.<name>_last_story` and a long-term `sensor.<name>_total_plays`
- **Sorting**: manual, alphabetical, most played or last played — ascending or
  descending — plus optional sort chips directly in the card (stored per
  browser, so the dashboard config stays untouched)
- **Switchable playback target**: the integration creates a
  `select.<name>_player` entity listing your configured media players.
  Toggle it from the card header chip, any dashboard, or an automation —
  e.g. Google Home Mini at home, your phone's companion-app player on the go.
  Alternatively, pin the card to one fixed `media_player`.
- **Play on _this device_**: a header toggle plays the story directly in the
  current browser tab or companion app (HTML5 audio — no media player or
  browser_mod needed), so you can listen on the phone in your hand. Plays are
  still counted. The choice is stored per browser; hide the toggle with
  `show_device_toggle: false`.
- **Playback controls**: an optional bar above the stories shows the cover and
  title of whatever is currently playing, with a play/pause button and a
  progress bar you can scrub. Works both for the selected media player (position
  and seeking come from the player, when it supports them) and for _this device_
  playback (full control of the in-browser audio). Hide it with
  `show_now_playing: false`.
- **Keep awake**: while a story plays on _this device_, the card takes a screen
  wake lock so the display doesn't sleep and cut off playback mid-story. Only
  affects this-device playback; disable with `keep_awake: false`.
- **Playing indicator**: the tile currently playing on the target player gets
  an animated equalizer and a highlight ring
- **History**: every playback fires a `bedtime_stories_story_played` event and
  shows up in the Home Assistant logbook/activity feed ("Bedtime Stories
  played “The Gruffalo” (Fairy tales) on Kids' room")
- **Kid-friendly**: big touch targets, rounded tiles, press/pop animations,
  no destructive actions reachable from the card itself

## Installation

### HACS (custom repository)

1. HACS → Integrations → ⋮ → *Custom repositories* →
   `https://github.com/florianbaethge/bedtime_stories` (category *Integration*)
2. Install **Bedtime Stories** and restart Home Assistant.

### Manual

Copy `custom_components/bedtime_stories` into your `config/custom_components`
folder and restart. The card JS is served by the integration itself and the
Lovelace resource is registered automatically (storage mode dashboards; in
YAML mode add `/bedtime_stories/bedtime-stories-card.js` as a module resource).

### Sandbox (this repository)

`sandbox/compose.yaml` bind-mounts the integration into the test instance:

```yaml
- ../bedtime_stories/custom_components/bedtime_stories:/config/custom_components/bedtime_stories
```

`docker compose up -d`, then add the integration via
*Settings → Devices & services → Add integration → Bedtime Stories*.

## Setup

1. **Add the integration** and pick the media players that should be offered
   as playback targets (e.g. the kid's room speaker and your phone). This
   creates the `select.<name>_player` helper entity.
2. **Add the card**: edit a dashboard → *Add card* → *Bedtime Stories Card*.
   In a sections view the card spans the full width by default.
3. **Add content** in the card editor (admins only): create categories, then
   add stories with title, cover image, duration and media file.

### Media files

Both the audio and the cover image offer two ways to set a file — **browse**
your Home Assistant media sources and pick an existing file, or **upload** a new
one straight from the editor with the *Upload* button — but they store uploads
differently:

- **Audio** lands in *My media* (`/media`), the same folder a Samba/SMB share
  exposes, so you don't need to leave Home Assistant to add stories. Uploading
  needs a writable local media source (the default *My media*); if none is found
  the editor says so and you can still upload via *Settings → Media* or a share.
- **Cover art** is downscaled in the browser and stored in Home Assistant's
  built-in image store, then served resized and cached from a stable
  `/api/image/serve/<id>/512x512` URL. That means the companion app loads covers
  from cache instead of re-downloading a multi-megabyte screenshot on every
  open. If the image store isn't reachable, the upload falls back to *My media*.

Existing `media-source://media_source/local/...` IDs can be pasted into the
*Media URL / content id* field as-is, and any `/api/image/serve/...` path or
image URL works in the cover's *Advanced* URL field.

## Card options

| Option | Default | Description |
| --- | --- | --- |
| `title` | – | Card headline |
| `entry_id` | only entry | Library, when several exist |
| `layout` | `grid` | `grid` or `list` |
| `columns` | `0` | Grid layout only: column count, `0` = responsive auto-fill |
| `density` | `cozy` | List layout only: `cozy` or `compact` rows |
| `show_titles` | `true` | Story titles on tiles |
| `show_duration` | `true` | `~20m` badge |
| `show_stats` | `false` | Play count + last played under each tile |
| `sort` | `manual` | `manual`, `alphabetical`, `play_count`, `last_played` |
| `sort_direction` | `asc` | `asc` or `desc` |
| `show_sort_selector` | `false` | Sort chips inside the card |
| `show_player` | `true` | Player chip in the header (tap to switch player) |
| `show_device_toggle` | `true` | Header toggle to play in this browser / app |
| `show_now_playing` | `true` | Play/pause + progress bar above the stories |
| `keep_awake` | `true` | Screen wake lock during _this device_ playback |
| `player_mode` | `select` | `select` (use the select entity) or `fixed` |
| `media_player` | – | Target when `player_mode: fixed` |
| `categories` | all | List of category IDs to show |

## Service, entities & events

- `bedtime_stories.play` — fields: `story_id` (shown in the story editor),
  optional `media_player`, optional `config_entry_id`. Use it in automations
  ("play the goodnight song at 19:00").
- `select.<name>_player` — current playback target; switch it from any UI or
  automation (`select.select_option`).
- `sensor.<name>_last_story` — title of the last played story with category
  and timestamp attributes.
- `sensor.<name>_total_plays` — total plays (long-term statistics graph).
- Event `bedtime_stories_story_played` — `story_id`, `title`, `category`,
  `media_player`, `played_at`; rendered in the logbook.

## Development

```bash
# Frontend (Lit + TypeScript, bundled with Rollup; dist/ is committed)
cd custom_components/bedtime_stories/frontend
npm install
npm run build        # or: npm run watch

# Tests run in CI (GitHub Actions: ruff, pytest, hassfest, HACS validation)
pytest tests/

# Hassfest locally (Docker, same image as CI)
./scripts/hassfest.sh
```

Storage lives in `.storage/bedtime_stories.<entry_id>` (categories, stories,
play stats) and survives restarts; removing the integration deletes it.

## License

MIT — see [LICENSE](LICENSE).
