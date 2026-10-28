[![CI](https://github.com/florianbaethge/bedtime_stories/actions/workflows/ci.yml/badge.svg)](https://github.com/florianbaethge/bedtime_stories/actions/workflows/ci.yml)
[![HACS Default](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://hacs.xyz)
[![License: MIT](https://img.shields.io/github/license/florianbaethge/bedtime_stories)](https://github.com/florianbaethge/bedtime_stories/blob/main/LICENSE)

<p align="center">
  <img
    src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/bedtime-stories-logo.png"
    alt="Bedtime Stories"
    width="760"
  >
</p>

**A kid-friendly story library for [Home Assistant](https://www.home-assistant.io/) — big cover tiles on a dashboard, one tap and the story plays on a speaker.**

- **One card instead of a wall of YAML** — categories and stories are managed in a graphical editor, no `picture-glance` card per story.
- **Big, tappable tiles** — covers grouped by category, as a grid or a list, with press animations and nothing destructive within a child's reach.
- **Switchable playback target** — the kids' room speaker at home, your phone on the go: one `select` entity, switchable from the card, any dashboard or an automation.
- **Play on this device** — the story plays right in the browser or companion app, no media player needed; the screen stays awake while it runs.
- **Playback controls** — cover, title, play / pause and a progress bar you can scrub, for the speaker and for this device.
- **Random story** — a rainbow-framed button for kids who cannot decide.
- **Play statistics** — "played 12× · 2 days ago" on each tile, sorting by most or last played, a last-story sensor and a long-term total.
- **Fast covers** — uploaded covers are downscaled and served cached, so the app does not download full-size artwork on every open.

Every playback shows up in the logbook. The card speaks **English** and **German**.

**Requirements:** Home Assistant **2024.6** or newer.

## Contents

- [How it works](#how-it-works)
- [The card](#the-card)
- [Installation](#installation)
- [First-time setup](#first-time-setup)
- [Entities, service and event](#entities-service-and-event)
- [Documentation](#documentation)
- [Logs and debugging](#logs-and-debugging)
- [Development](#development)
- [Contributing and support](#contributing-and-support)

## How it works

You fill one **library** with two things — **categories** and **stories** — and the card turns them into cover tiles.

- **A category** is a sub-header with an icon: "Fairy tales", "Astrid Lindgren", "Songs".
- **A story** is one tile: a title, a cover image, an optional duration (`~20m`) and a media file — picked from Home Assistant's media browser, uploaded straight from the editor, or any URL.

A tap on a tile casts the story to the **playback target**: the player chosen in `select.<name>_player`, a player pinned to the card, or *this device*. Each playback counts towards the statistics and fires an event that the logbook renders as "Bedtime Stories played “The Gruffalo” (Fairy tales) on Kids' room".

The library lives in the integration, not in the card config: every card on every dashboard shows the same stories, and only administrators can change them.

## The card

`custom:bedtime-stories-card` is registered automatically and has a graphical editor with a live preview. In a sections view it spans the full width.

<p align="center">
  <img src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_grid.png" alt="Grid layout — cover tiles grouped by category" width="460">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_stats.png" alt="Play statistics and in-card sort chips" width="380">
  <img src="https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_list.png" alt="Compact list layout with playback controls" width="380">
</p>

```yaml
type: custom:bedtime-stories-card
title: Bedtime
layout: grid
show_stats: true
```

All options, layouts, sorting, the playback target and the editor: [Dashboard card](https://github.com/florianbaethge/bedtime_stories/blob/main/docs/card.md).

## Installation

### HACS (recommended)

1. Open HACS → search **Bedtime Stories**.
2. Click **Download** and restart Home Assistant.
3. **Settings → Devices & services → Add integration** → search **Bedtime Stories**.

### Manual install

Copy the folder `custom_components/bedtime_stories/` into your Home Assistant configuration directory (next to `configuration.yaml`), then restart. Add the integration as above.

The card's JavaScript is served by the integration and registered as a dashboard resource automatically. Dashboards kept in YAML mode cannot be written to: add `/bedtime_stories/bedtime-stories-card.js` as a `module` resource yourself.

## First-time setup

1. Complete the **config flow**: a name for the library and the media players to offer as playback targets (for example the kids' room speaker and your phone). This creates `select.<name>_player`.
2. Edit a dashboard → **Add card** → **Bedtime Stories Card**.
3. In the card editor (administrators only), create **categories**, then add **stories** with title, cover, duration and media file. Drag rows to reorder them.

The players can be changed later under **Settings → Devices & services → Bedtime Stories → Configure**. Several libraries are possible; a card picks one with `entry_id`.

## Entities, service and event

| Entity | Purpose |
|--------|---------|
| `select.<name>_player` | Current playback target; switch it from the card, a dashboard or `select.select_option` |
| `sensor.<name>_last_story` | Title of the last played story, with category and time as attributes |
| `sensor.<name>_total_plays` | Total plays, with long-term statistics |

`bedtime_stories.play` plays a story by `story_id` (shown in the story editor), optionally on a given `media_player` — "play the goodnight song at 19:00". Every playback fires `bedtime_stories_story_played` with `story_id`, `title`, `category`, `media_player` and `played_at`.

Examples and field details: [Automations](https://github.com/florianbaethge/bedtime_stories/blob/main/docs/automations.md).

## Documentation

| Page | Content |
|------|---------|
| [Dashboard card](https://github.com/florianbaethge/bedtime_stories/blob/main/docs/card.md) | Layouts, all options, sorting, playback target, this-device playback, controls, random story, the editor |
| [Media and covers](https://github.com/florianbaethge/bedtime_stories/blob/main/docs/media.md) | Browsing and uploading audio and covers, where files land, how covers are optimized, older covers |
| [Automations](https://github.com/florianbaethge/bedtime_stories/blob/main/docs/automations.md) | The `play` service with examples, the entities, the playback event and the logbook |

## Logs and debugging

```yaml
logger:
  logs:
    custom_components.bedtime_stories: debug
```

The library (categories, stories, play statistics) lives in `.storage/bedtime_stories.<entry_id>` and survives restarts; removing the integration deletes it.

## Development

```bash
# Card (Lit + TypeScript, bundled with Rollup; dist/ is committed)
cd custom_components/bedtime_stories/frontend
npm ci
npm run build        # or: npm run watch
cd ../../..

# Python tests (CI installs pytest-homeassistant-custom-component)
pip install -r requirements_test.txt
pytest tests/

# Hassfest locally (Docker, same image as CI)
./scripts/hassfest.sh

# Regenerate the screenshots against a sandbox (the script's header lists
# what the sandbox needs)
HA_URL=http://localhost:8123 HA_TOKEN=<long-lived-token> \
  node scripts/make_screenshots.js
```

Commit the updated bundle in `frontend/dist/` when you change the card sources so HACS users do not need Node. CI runs ruff (lint + format), pytest with the card build, hassfest and HACS validation.

### Version management

The version is centrally managed in the `VERSION` file:

```bash
make update-version VERSION=1.0.0   # or: python3 update_version.py 1.0.0
make version                        # show current version
```

This updates `VERSION`, `manifest.json`, `frontend/package.json` and `version.py`, and rebuilds the card bundle.

## Contributing and support

- **Issues:** [GitHub Issues](https://github.com/florianbaethge/bedtime_stories/issues)
- **License:** [MIT](https://github.com/florianbaethge/bedtime_stories/blob/main/LICENSE)
