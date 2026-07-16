import type { HomeAssistant } from "./types";

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    empty: "No stories yet — add some in the card editor.",
    no_player: "No player available",
    sort_manual: "My order",
    sort_alphabetical: "A–Z",
    sort_play_count: "Favorites",
    sort_last_played: "Recent",
    played_never: "never played",
    played_once: "played once",
    played_times: "played {count}×",
    playing: "Playing…",
    // editor
    tab_settings: "Settings",
    tab_content: "Content",
    section_appearance: "Appearance",
    section_sorting: "Sorting & statistics",
    section_playback: "Playback",
    content_hint:
      "Categories group your stories and show up as sub-headers in the card. Edits to existing categories and stories save automatically and are shared by all Bedtime Stories cards — the card's own Save button below only applies to the display options.",
    new_category: "New category",
    edit_category: "Edit category",
    new_story: "New story",
    edit_story: "Edit story",
    advanced: "Advanced",
    media_selected: "Selected media",
    media_none: "No media file selected yet",
    media_help:
      "Browse Home Assistant media — files can be uploaded to “My media” right in the browse dialog.",
    cover_selected: "Selected image",
    cover_none: "No cover image selected yet",
    cover_help:
      "Pick a cover from Home Assistant media — browse existing images or upload one, just like the audio file.",
    image_url: "Cover image URL / content id",
    image_url_help:
      "Direct image URL, /api/image/serve/… path or media-source id — overrides the picker.",
    duration_help: "Shown as a badge on the tile, e.g. “~20m”.",
    media_content_id_help:
      "Direct media-source URI or stream URL — overrides the picked media.",
    columns_help: "0 = automatic, based on the available width.",
    no_categories:
      "No categories yet. Start by creating one — for example “General” or “Fairy tales”.",
    title: "Title",
    layout: "Layout",
    layout_grid: "Grid",
    layout_list: "List",
    columns: "Columns (0 = automatic)",
    density: "Density",
    density_cozy: "Cozy",
    density_compact: "Compact",
    show_titles: "Show story titles",
    show_duration: "Show duration badge",
    show_stats: "Show play statistics",
    sort: "Sort stories by",
    sort_direction: "Sort direction",
    asc: "Ascending",
    desc: "Descending",
    show_sort_selector: "Show sort chips in the card",
    show_player: "Show player chip in the header",
    player_mode: "Playback target",
    player_mode_select: "Player select entity (switchable)",
    player_mode_fixed: "Fixed media player",
    media_player: "Media player",
    entry: "Library",
    categories: "Categories",
    add_category: "Add category",
    add_story: "Add story",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    done: "Done",
    name: "Name",
    icon: "Icon",
    category: "Category",
    duration: "Duration (minutes)",
    cover: "Cover image",
    media: "Media file",
    media_hint:
      "Pick a file from the media browser (upload possible there) or paste a media-source URL / stream URL below.",
    media_content_id: "Media URL / content id",
    media_content_type: "Content type",
    story_id_hint: "Story ID (for automations)",
    stories_count: "{count} stories",
    confirm_delete_category:
      "Delete this category and all of its stories?",
    confirm_delete_story: "Delete this story?",
    not_configured:
      "Bedtime Stories integration is not set up yet. Add it under Settings → Devices & services.",
    reset_stats: "Reset statistics",
  },
  de: {
    empty: "Noch keine Geschichten – füge welche im Karten-Editor hinzu.",
    no_player: "Kein Player verfügbar",
    sort_manual: "Meine Reihenfolge",
    sort_alphabetical: "A–Z",
    sort_play_count: "Lieblinge",
    sort_last_played: "Zuletzt",
    played_never: "noch nie gehört",
    played_once: "1× gehört",
    played_times: "{count}× gehört",
    playing: "Läuft…",
    tab_settings: "Einstellungen",
    tab_content: "Inhalte",
    section_appearance: "Darstellung",
    section_sorting: "Sortierung & Statistik",
    section_playback: "Wiedergabe",
    content_hint:
      "Kategorien gruppieren deine Geschichten und erscheinen als Zwischenüberschriften in der Karte. Änderungen an bestehenden Kategorien und Geschichten werden automatisch gespeichert und gelten für alle Bedtime-Stories-Karten — die Save-Schaltfläche der Karte selbst betrifft nur die Darstellungsoptionen.",
    new_category: "Neue Kategorie",
    edit_category: "Kategorie bearbeiten",
    new_story: "Neue Geschichte",
    edit_story: "Geschichte bearbeiten",
    advanced: "Erweitert",
    media_selected: "Ausgewählte Medien",
    media_none: "Noch keine Mediendatei ausgewählt",
    media_help:
      "Durchsuche die Home-Assistant-Medien — Dateien kannst du direkt im Dialog unter „Meine Medien“ hochladen.",
    cover_selected: "Ausgewähltes Bild",
    cover_none: "Noch kein Cover-Bild ausgewählt",
    cover_help:
      "Wähle ein Cover aus den Home-Assistant-Medien — bestehende Bilder durchsuchen oder hochladen, genau wie die Audiodatei.",
    image_url: "Cover-Bild-URL / Content-ID",
    image_url_help:
      "Direkte Bild-URL, /api/image/serve/…-Pfad oder media-source-ID — übersteuert die Auswahl.",
    duration_help: "Wird als Badge auf der Kachel angezeigt, z. B. „~20m“.",
    media_content_id_help:
      "Direkte media-source-URI oder Stream-URL — übersteuert die ausgewählte Datei.",
    columns_help: "0 = automatisch, passend zur verfügbaren Breite.",
    no_categories:
      "Noch keine Kategorien. Leg zuerst eine an — zum Beispiel „Allgemein“ oder „Märchen“.",
    title: "Titel",
    layout: "Darstellung",
    layout_grid: "Raster",
    layout_list: "Liste",
    columns: "Spalten (0 = automatisch)",
    density: "Dichte",
    density_cozy: "Gemütlich",
    density_compact: "Kompakt",
    show_titles: "Titel der Geschichten anzeigen",
    show_duration: "Dauer-Badge anzeigen",
    show_stats: "Hörstatistik anzeigen",
    sort: "Geschichten sortieren nach",
    sort_direction: "Sortierrichtung",
    asc: "Aufsteigend",
    desc: "Absteigend",
    show_sort_selector: "Sortier-Chips in der Karte anzeigen",
    show_player: "Player-Chip im Kopf anzeigen",
    player_mode: "Wiedergabeziel",
    player_mode_select: "Player-Auswahl-Entität (umschaltbar)",
    player_mode_fixed: "Fester Medienplayer",
    media_player: "Medienplayer",
    entry: "Bibliothek",
    categories: "Kategorien",
    add_category: "Kategorie hinzufügen",
    add_story: "Geschichte hinzufügen",
    edit: "Bearbeiten",
    delete: "Löschen",
    save: "Speichern",
    cancel: "Abbrechen",
    done: "Fertig",
    name: "Name",
    icon: "Icon",
    category: "Kategorie",
    duration: "Dauer (Minuten)",
    cover: "Cover-Bild",
    media: "Mediendatei",
    media_hint:
      "Wähle eine Datei aus dem Medienbrowser (Upload dort möglich) oder trage unten eine media-source-URL / Stream-URL ein.",
    media_content_id: "Medien-URL / Content-ID",
    media_content_type: "Content-Type",
    story_id_hint: "Geschichten-ID (für Automationen)",
    stories_count: "{count} Geschichten",
    confirm_delete_category:
      "Diese Kategorie samt aller Geschichten löschen?",
    confirm_delete_story: "Diese Geschichte löschen?",
    not_configured:
      "Die Bedtime-Stories-Integration ist noch nicht eingerichtet. Füge sie unter Einstellungen → Geräte & Dienste hinzu.",
    reset_stats: "Statistik zurücksetzen",
  },
};

export function localize(
  hass: HomeAssistant | undefined,
  key: string,
  vars?: Record<string, string | number>
): string {
  const lang = (hass?.locale?.language ?? hass?.language ?? "en").split("-")[0];
  const table = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  let text = table[key] ?? TRANSLATIONS.en[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
}

/** "vor 2 Tagen" / "2 days ago" via Intl, falling back to the raw date. */
export function relativeTime(
  hass: HomeAssistant | undefined,
  iso: string
): string {
  const lang = hass?.locale?.language ?? hass?.language ?? "en";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffSec = Math.round((then - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const table: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  for (const [unit, seconds] of table) {
    if (Math.abs(diffSec) >= seconds) {
      return rtf.format(Math.round(diffSec / seconds), unit);
    }
  }
  return rtf.format(0, "minute");
}
