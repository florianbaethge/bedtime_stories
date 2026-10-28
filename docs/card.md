# Dashboard card

[← Back to the README](../README.md)

The integration ships a Lovelace card, `custom:bedtime-stories-card`, and registers it as a dashboard resource automatically — nothing to add under **Settings → Dashboards → Resources**. Pick it from the card picker as *Bedtime Stories Card*. (Dashboards kept in YAML mode cannot be written to: add `/bedtime_stories/bedtime-stories-card.js` as a `module` resource yourself.)

Dropped on a dashboard with no options at all it picks the only library and shows every category as a grid:

```yaml
type: custom:bedtime-stories-card
```

![Grid layout — cover tiles grouped by category](https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_grid.png)

## Contents

- [Layouts](#layouts)
- [Options](#options)
- [Sorting and statistics](#sorting-and-statistics)
- [Playback target](#playback-target)
- [Play on this device](#play-on-this-device)
- [Playback controls](#playback-controls)
- [Random story](#random-story)
- [The editor](#the-editor)

## Layouts

| `layout` | Shows |
|----------|-------|
| `grid` *(default)* | Big cover tiles. `columns: 0` fills the width automatically; any other number fixes the column count. |
| `list` | One row per story with a small cover. `density: cozy` or `compact`. |

`show_titles` and `show_duration` switch the title and the `~20m` badge on the tiles. `categories` limits the card to some categories, for example one card per child.

![Compact list layout with playback controls](https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_list.png)

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `title` | – | Card headline |
| `entry_id` | only library | Library, when there are several |
| `layout` | `grid` | `grid` or `list` |
| `columns` | `0` | Grid only: column count, `0` = automatic |
| `density` | `cozy` | List only: `cozy` or `compact` rows |
| `show_titles` | `true` | Story titles on the tiles |
| `show_duration` | `true` | `~20m` badge |
| `show_stats` | `false` | Play count and last played under each tile |
| `sort` | `manual` | `manual`, `alphabetical`, `play_count`, `last_played` |
| `sort_direction` | `asc` | `asc` or `desc` |
| `show_sort_selector` | `false` | Sort chips inside the card |
| `show_random` | `true` | Full-width *Random story* button above the stories |
| `random_label` | *Random story* | Text on that button |
| `show_player` | `true` | Player chip in the header (tap to switch player) |
| `show_device_toggle` | `true` | Header toggle to play in this browser or app |
| `show_now_playing` | `true` | Play / pause and progress bar above the stories |
| `keep_awake` | `true` | Keep the screen on while a story plays on this device |
| `player_mode` | `select` | `select` (use the select entity) or `fixed` |
| `media_player` | – | Target when `player_mode: fixed` |
| `categories` | all | Category ids to show |

## Sorting and statistics

`sort` orders the stories within each category: by hand (the order from the editor), alphabetically, by play count or by last played, in either `sort_direction`. With `show_sort_selector: true` the card shows chips to change the order on the spot; that choice is stored per browser, so the dashboard config stays untouched.

`show_stats: true` adds a line under each tile — "played 12× · 2 days ago".

![Play statistics with sort chips](https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_stats.png)

## Playback target

With `player_mode: select` (the default) the card plays on whatever `select.<name>_player` names. The header chip shows the current player; a tap cycles through the players configured in the integration. Any dashboard or automation can switch it too — the Google Home Mini at home, the companion app's player on the go.

`player_mode: fixed` with `media_player: media_player.kids_room` pins the card to one player and ignores the select entity.

The tile that is playing on the target gets an animated equalizer and a highlight ring.

## Play on this device

The header toggle plays the story in the current browser tab or companion app (HTML5 audio — no media player or browser_mod needed), so you can listen on the phone in your hand. Plays are still counted. The choice is stored per browser; `show_device_toggle: false` hides the toggle.

While a story plays on this device the card takes a screen wake lock, so the display does not sleep and cut the story off. `keep_awake: false` turns that off.

## Playback controls

A bar above the stories shows the cover and title of what is playing, a play / pause button and a progress bar you can scrub. On a media player, position and seeking come from the player when it supports them; on this device the card controls the audio itself. `show_now_playing: false` hides the bar.

## Random story

A full-width button above the stories — fairy icon and label, framed by a slowly drifting rainbow border that works on light and dark themes — plays one of the shown stories at random, never the one already running. `random_label` changes its text, `show_random: false` hides it.

## The editor

Besides the display options, the card editor manages the library — categories and stories, for administrators only. The library is stored in the integration, not in the card config, so a change shows up on every card at once.

- **Categories** have a name and an icon. Deleting a category deletes its stories.
- **Stories** have a title, a category, a cover, an optional duration and a media file. The story id shown there is what `bedtime_stories.play` needs.
- **Drag** categories and stories to reorder them; that is the `manual` sort order.

Covers and media files can be browsed or uploaded; see [Media and covers](media.md).

![The card editor with a live preview](https://raw.githubusercontent.com/florianbaethge/bedtime_stories/main/screenshots/card_editor.png)
