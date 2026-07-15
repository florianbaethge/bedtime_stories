# Bedtime Stories 🧸🌙

A kid-friendly story library for Home Assistant: a custom integration plus a
Lovelace card (`bedtime-stories-card`) that shows big, tappable cover tiles
grouped by category. One tap casts the story to a speaker — perfect for the
evening ritual.

Built as the successor to a hand-made wall of `picture-glance` cards: instead
of maintaining dozens of YAML cards, you manage categories and stories in a
graphical editor, and get play statistics, sorting and a switchable playback
target on top.

## Features

- **Full-width dashboard card** with a graphical editor (no YAML required)
- **Categories** shown as sub-headers with icons (e.g. "Allgemein",
  "Astrid Lindgren", "Märchen")
- **Stories** with title, cover image (browse existing images or upload via
  the media picker — same dialog as the audio file), duration badge (`~20m`)
  and a media file picked from the media browser (local media upload works
  there too) or any URL
- **Layout options**: grid with column count, or list with cozy/compact
  density, show/hide titles and duration
- **Play statistics**: optional per-tile line ("12× gehört · vor 2 Tagen"),
  a `sensor.<name>_last_story` and a long-term `sensor.<name>_total_plays`
- **Sorting**: manual, alphabetical, most played or last played — ascending or
  descending — plus optional sort chips directly in the card (stored per
  browser, so the dashboard config stays untouched)
- **Switchable playback target**: the integration creates a
  `select.<name>_player` entity listing your configured media players.
  Toggle it from the card header chip, any dashboard, or an automation —
  e.g. Google Home Mini at home, your phone's companion-app player on the go.
  Alternatively, pin the card to one fixed `media_player`.
- **Playing indicator**: the tile currently playing on the target player gets
  an animated equalizer and a highlight ring
- **History**: every playback fires a `bedtime_stories_story_played` event and
  shows up in the Home Assistant logbook/activity feed ("Bedtime Stories
  played “Leo Lausemaus” (Allgemein) on Kinderzimmer")
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

The media picker browses your Home Assistant media sources, including
*My media* (`/media`), where you can upload MP3/M4A files directly in the
browse dialog. The **cover image** uses the same picker (filtered to images),
so you can browse existing cover art or upload a new picture the same way.
Existing `media-source://media_source/local/...` IDs from your old
`picture-glance` cards can be pasted into the *Media URL / content id* field
as-is, and cover URLs like `/api/image/serve/<id>/512x512` still work — paste
them into the cover's *Advanced* URL field.

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
