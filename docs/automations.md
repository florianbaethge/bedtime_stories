# Automations

[← Back to the README](../README.md)

## Contents

- [Service](#service)
- [Entities](#entities)
- [Event](#event)

## Service

`bedtime_stories.play` plays one story.

| Field | Required | Description |
|-------|----------|-------------|
| `story_id` | yes | The story's id, shown in the story editor |
| `media_player` | no | Where to play; without it the player in `select.<name>_player` is used, or the only configured player |
| `config_entry_id` | no | The library, needed only when there are several |

The goodnight song at seven, in the kids' room:

```yaml
triggers:
  - trigger: time
    at: "19:00:00"
actions:
  - action: bedtime_stories.play
    data:
      story_id: a1b2c3d4e5f6
      media_player: media_player.kids_room
```

The playback counts towards the statistics and fires the event below, like a tap on the card.

## Entities

| Entity | Purpose |
|--------|---------|
| `select.<name>_player` | The current playback target. Options are the players configured in the integration; only there when at least one player is configured. |
| `sensor.<name>_last_story` | Title of the last played story; attributes `story_id`, `category` and `played_at` |
| `sensor.<name>_total_plays` | Total plays of the library, with long-term statistics |

Switch the target from an automation, for example to the phone when nobody is home:

```yaml
actions:
  - action: select.select_option
    target:
      entity_id: select.bedtime_stories_player
    data:
      option: media_player.phone
```

## Event

Every playback — from the card, this device or the service — fires `bedtime_stories_story_played`:

| Field | Content |
|-------|---------|
| `story_id` | The story's id |
| `title` | The story's title |
| `category` | Its category's name |
| `media_player` | The player, or the name of the device for this-device playback |
| `played_at` | ISO timestamp |

The logbook renders it as "Bedtime Stories played “The Gruffalo” (Fairy tales) on Kids' room".
