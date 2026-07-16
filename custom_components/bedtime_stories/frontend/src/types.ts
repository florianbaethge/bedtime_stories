import type { HassEntities } from "home-assistant-js-websocket";

/** Minimal hass shape used by the card. */
export interface HomeAssistant {
  states: HassEntities;
  language?: string;
  locale?: { language: string };
  user?: { is_admin?: boolean };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): Promise<unknown>;
  fetchWithAuth(path: string, init?: RequestInit): Promise<Response>;
  connection: {
    subscribeMessage<Result>(
      callback: (result: Result) => void,
      message: Record<string, unknown>
    ): Promise<() => Promise<void>>;
  };
}

// ---- Domain payloads (mirror the Python models' to_dict output) ----

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface Story {
  id: string;
  category_id: string;
  title: string;
  image: string | null;
  media_content_id: string;
  media_content_type: string;
  duration_min: number | null;
  order: number;
}

export interface PlayStats {
  play_count: number;
  last_played: string | null;
}

export interface PlayerInfo {
  entity_id: string;
  name: string;
}

export interface LibrarySnapshot {
  entry_id: string;
  name: string;
  categories: Category[];
  stories: Story[];
  stats: Record<string, PlayStats>;
  players: PlayerInfo[];
  current_player: string | null;
  select_entity: string | null;
}

export interface EntryRow {
  entry_id: string;
  name: string;
}

// ---- Card configuration ----

export type SortMode = "manual" | "alphabetical" | "play_count" | "last_played";
export type SortDirection = "asc" | "desc";

export interface BedtimeStoriesCardConfig {
  type: string;
  entry_id?: string;
  title?: string;
  layout?: "grid" | "list";
  columns?: number;
  density?: "cozy" | "compact";
  show_titles?: boolean;
  show_duration?: boolean;
  show_stats?: boolean;
  sort?: SortMode;
  sort_direction?: SortDirection;
  show_sort_selector?: boolean;
  show_player?: boolean;
  show_device_toggle?: boolean;
  player_mode?: "select" | "fixed";
  media_player?: string;
  categories?: string[];
}

export const DEFAULT_CONFIG: Required<
  Pick<
    BedtimeStoriesCardConfig,
    | "layout"
    | "columns"
    | "density"
    | "show_titles"
    | "show_duration"
    | "show_stats"
    | "sort"
    | "sort_direction"
    | "show_sort_selector"
    | "show_player"
    | "show_device_toggle"
    | "player_mode"
  >
> = {
  layout: "grid",
  columns: 0, // 0 = automatic
  density: "cozy",
  show_titles: true,
  show_duration: true,
  show_stats: false,
  sort: "manual",
  sort_direction: "asc",
  show_sort_selector: false,
  show_player: true,
  show_device_toggle: true,
  player_mode: "select",
};
