import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import { playStory, subscribeLibrary } from "./api";
import { localize, relativeTime } from "./i18n";
import { isMediaSource, resolveImage } from "./media-image";
import {
  DEFAULT_CONFIG,
  type BedtimeStoriesCardConfig,
  type Category,
  type HomeAssistant,
  type LibrarySnapshot,
  type SortDirection,
  type SortMode,
  type Story,
} from "./types";

import "./bedtime-stories-card-editor";

declare global {
  interface Window {
    customCards?: unknown[];
  }
}

const SORT_MODES: SortMode[] = [
  "manual",
  "alphabetical",
  "play_count",
  "last_played",
];

/** Chips that imply "most first" flip their default direction. */
const DEFAULT_DESC: SortMode[] = ["play_count", "last_played"];

interface SortChoice {
  sort: SortMode;
  direction: SortDirection;
}

@customElement("bedtime-stories-card")
export class BedtimeStoriesCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: BedtimeStoriesCardConfig;

  @state() private _library?: LibrarySnapshot;

  /** story.id → resolved cover URL, for images stored as media-source ids. */
  @state() private _covers: Record<string, string> = {};

  @state() private _error?: string;

  @state() private _justPlayed: string | null = null;

  @state() private _localSort?: SortChoice;

  private _unsubscribe?: Promise<() => Promise<void>>;

  private _subscribedEntry?: string;

  public static getConfigElement(): HTMLElement {
    return document.createElement("bedtime-stories-card-editor");
  }

  public static getStubConfig(): Partial<BedtimeStoriesCardConfig> {
    return { title: "Gute-Nacht-Geschichten" };
  }

  public setConfig(config: BedtimeStoriesCardConfig): void {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._localSort = this._loadLocalSort();
    this._resubscribe();
  }

  public getCardSize(): number {
    const stories = this._library?.stories.length ?? 6;
    return 2 + Math.ceil(stories / 3) * 2;
  }

  /** Sections view: span the full width by default (resizable by the user). */
  public getGridOptions(): Record<string, unknown> {
    return { columns: "full", rows: "auto" };
  }

  public getLayoutOptions(): Record<string, unknown> {
    return { grid_columns: "full", grid_rows: "auto" };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._resubscribe();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._teardown();
  }

  protected updated(): void {
    if (this.hass && !this._unsubscribe) {
      this._resubscribe();
    }
  }

  private _teardown(): void {
    this._unsubscribe?.then((unsub) => unsub()).catch(() => undefined);
    this._unsubscribe = undefined;
    this._subscribedEntry = undefined;
  }

  private _resubscribe(): void {
    if (!this.hass || !this._config || !this.isConnected) return;
    const entry = this._config.entry_id ?? "";
    if (this._unsubscribe && this._subscribedEntry === entry) return;
    this._teardown();
    this._subscribedEntry = entry;
    this._unsubscribe = subscribeLibrary(
      this.hass,
      (snapshot) => {
        this._library = snapshot;
        this._error = undefined;
        void this._resolveCovers(snapshot);
      },
      this._config.entry_id
    );
    this._unsubscribe.catch((err: { message?: string }) => {
      this._unsubscribe = undefined;
      this._error = err?.message ?? "unknown error";
    });
  }

  // ---- sorting -------------------------------------------------------------

  private _sortStorageKey(): string {
    return `bedtime-stories-sort:${this._config?.entry_id ?? "default"}`;
  }

  private _loadLocalSort(): SortChoice | undefined {
    if (!this._config?.show_sort_selector) return undefined;
    try {
      const raw = window.localStorage.getItem(this._sortStorageKey());
      return raw ? (JSON.parse(raw) as SortChoice) : undefined;
    } catch {
      return undefined;
    }
  }

  private _activeSort(): SortChoice {
    if (this._config?.show_sort_selector && this._localSort) {
      return this._localSort;
    }
    return {
      sort: this._config?.sort ?? "manual",
      direction: this._config?.sort_direction ?? "asc",
    };
  }

  private _pickSort(mode: SortMode): void {
    const current = this._activeSort();
    const choice: SortChoice =
      current.sort === mode
        ? {
            sort: mode,
            direction: current.direction === "asc" ? "desc" : "asc",
          }
        : {
            sort: mode,
            direction: DEFAULT_DESC.includes(mode) ? "desc" : "asc",
          };
    this._localSort = choice;
    try {
      window.localStorage.setItem(
        this._sortStorageKey(),
        JSON.stringify(choice)
      );
    } catch {
      // private mode etc. — sorting still works for this session
    }
  }

  private _sortedStories(category: Category): Story[] {
    const lib = this._library;
    if (!lib) return [];
    const { sort, direction } = this._activeSort();
    const stories = lib.stories.filter((s) => s.category_id === category.id);
    const stat = (id: string) => lib.stats[id];
    stories.sort((a, b) => {
      let cmp = 0;
      switch (sort) {
        case "alphabetical":
          cmp = a.title.localeCompare(b.title, undefined, {
            sensitivity: "base",
          });
          break;
        case "play_count":
          cmp = (stat(a.id)?.play_count ?? 0) - (stat(b.id)?.play_count ?? 0);
          break;
        case "last_played": {
          const ta = Date.parse(stat(a.id)?.last_played ?? "") || 0;
          const tb = Date.parse(stat(b.id)?.last_played ?? "") || 0;
          cmp = ta - tb;
          break;
        }
        default:
          cmp = a.order - b.order;
      }
      if (cmp === 0) {
        cmp = a.title.localeCompare(b.title, undefined, {
          sensitivity: "base",
        });
      }
      return direction === "desc" ? -cmp : cmp;
    });
    return stories;
  }

  // ---- players ---------------------------------------------------------------

  private _targetPlayer(): string | undefined {
    if (this._config?.player_mode === "fixed" && this._config.media_player) {
      return this._config.media_player;
    }
    const lib = this._library;
    if (lib?.select_entity && this.hass?.states[lib.select_entity]) {
      const option = this.hass.states[lib.select_entity].state;
      if (option && option !== "unknown" && option !== "unavailable") {
        return option;
      }
    }
    return lib?.current_player ?? undefined;
  }

  private _playerName(entityId?: string): string | undefined {
    if (!entityId) return undefined;
    const info = this._library?.players.find((p) => p.entity_id === entityId);
    if (info) return info.name;
    const st = this.hass?.states[entityId];
    return (
      (st?.attributes.friendly_name as string | undefined) ?? entityId
    );
  }

  private _cyclePlayer(): void {
    const lib = this._library;
    if (!this.hass || !lib?.select_entity || lib.players.length < 2) return;
    const current = this._targetPlayer();
    const idx = lib.players.findIndex((p) => p.entity_id === current);
    const next = lib.players[(idx + 1) % lib.players.length];
    void this.hass.callService("select", "select_option", {
      entity_id: lib.select_entity,
      option: next.entity_id,
    });
  }

  private _playingStoryId(): string | null {
    const player = this._targetPlayer();
    if (!player || !this.hass) return null;
    const st = this.hass.states[player];
    if (!st || st.state !== "playing") return null;
    const title = st.attributes.media_title as string | undefined;
    if (!title) return null;
    const story = this._library?.stories.find((s) => s.title === title);
    return story?.id ?? null;
  }

  // ---- actions ----------------------------------------------------------------

  private async _play(story: Story): Promise<void> {
    if (!this.hass) return;
    this._justPlayed = story.id;
    window.setTimeout(() => {
      if (this._justPlayed === story.id) this._justPlayed = null;
    }, 1600);
    try {
      await playStory(
        this.hass,
        story.id,
        this._config?.player_mode === "fixed"
          ? this._config.media_player
          : undefined,
        this._config?.entry_id
      );
    } catch (err) {
      this._justPlayed = null;
      this._error = (err as { message?: string })?.message ?? "play failed";
      window.setTimeout(() => {
        this._error = undefined;
      }, 4000);
    }
  }

  // ---- rendering ----------------------------------------------------------------

  private _visibleCategories(): Category[] {
    const lib = this._library;
    if (!lib) return [];
    const filter = this._config?.categories ?? [];
    return lib.categories.filter(
      (c) => filter.length === 0 || filter.includes(c.id)
    );
  }

  /** Resolve any media-source cover ids into displayable URLs. */
  private async _resolveCovers(lib: LibrarySnapshot): Promise<void> {
    if (!this.hass) return;
    const updates: Record<string, string> = {};
    await Promise.all(
      lib.stories.map(async (story) => {
        if (!isMediaSource(story.image)) return;
        const url = await resolveImage(this.hass!, story.image);
        if (url && url !== this._covers[story.id]) updates[story.id] = url;
      })
    );
    if (Object.keys(updates).length) {
      this._covers = { ...this._covers, ...updates };
    }
  }

  /** Direct URLs pass through; media-source ids use the resolved cache. */
  private _coverUrl(story: Story): string | null {
    if (!story.image) return null;
    if (isMediaSource(story.image)) return this._covers[story.id] ?? null;
    return story.image;
  }

  private _statsLine(story: Story): string | undefined {
    const stats = this._library?.stats[story.id];
    if (!stats || stats.play_count === 0) {
      return localize(this.hass, "played_never");
    }
    const count =
      stats.play_count === 1
        ? localize(this.hass, "played_once")
        : localize(this.hass, "played_times", { count: stats.play_count });
    return stats.last_played
      ? `${count} · ${relativeTime(this.hass, stats.last_played)}`
      : count;
  }

  protected render(): TemplateResult {
    const config = this._config;
    if (!config) return html``;
    if (this._error && !this._library) {
      return html`<ha-card
        ><div class="empty">${localize(this.hass, "not_configured")}</div>
      </ha-card>`;
    }

    const categories = this._visibleCategories();
    // Density only applies to the list layout; grid tiles scale via columns.
    const compact = config.layout === "list" && config.density === "compact";
    const playing = this._playingStoryId();
    const player = this._targetPlayer();
    const showChip =
      config.show_player !== false &&
      config.player_mode !== "fixed" &&
      (this._library?.players.length ?? 0) > 0;

    return html`
      <ha-card class=${classMap({ compact })}>
        <div class="header">
          ${config.title ? html`<h1>${config.title}</h1>` : nothing}
          ${showChip
            ? html`<button
                class="player-chip"
                title=${this._library?.select_entity ?? ""}
                @click=${this._cyclePlayer}
              >
                <ha-icon icon="mdi:cast-audio"></ha-icon>
                <span
                  >${this._playerName(player) ??
                  localize(this.hass, "no_player")}</span
                >
              </button>`
            : nothing}
        </div>
        ${config.show_sort_selector ? this._renderSortChips() : nothing}
        ${this._error
          ? html`<div class="error">${this._error}</div>`
          : nothing}
        ${categories.length === 0
          ? html`<div class="empty">
              <ha-icon icon="mdi:sleep"></ha-icon>
              ${localize(this.hass, "empty")}
            </div>`
          : categories.map((category) =>
              this._renderCategory(category, playing)
            )}
      </ha-card>
    `;
  }

  private _renderSortChips(): TemplateResult {
    const active = this._activeSort();
    return html`
      <div class="sort-chips">
        ${SORT_MODES.map(
          (mode) => html`
            <button
              class=${classMap({ chip: true, active: active.sort === mode })}
              @click=${() => this._pickSort(mode)}
            >
              ${localize(this.hass, `sort_${mode}`)}
              ${active.sort === mode
                ? html`<ha-icon
                    icon=${active.direction === "asc"
                      ? "mdi:arrow-up-thin"
                      : "mdi:arrow-down-thin"}
                  ></ha-icon>`
                : nothing}
            </button>
          `
        )}
      </div>
    `;
  }

  private _renderCategory(
    category: Category,
    playing: string | null
  ): TemplateResult {
    const stories = this._sortedStories(category);
    if (stories.length === 0) return html``;
    const config = this._config!;
    const grid = config.layout !== "list";
    const columns = config.columns ?? 0;
    const gridStyle =
      grid && columns > 0
        ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
        : {};
    return html`
      <div class="category">
        <div class="category-header">
          <ha-icon icon=${category.icon || "mdi:teddy-bear"}></ha-icon>
          <span>${category.name}</span>
        </div>
        <div
          class=${classMap({ tiles: grid, rows: !grid })}
          style=${styleMap(gridStyle)}
        >
          ${stories.map((story) =>
            grid
              ? this._renderTile(story, playing)
              : this._renderRow(story, playing)
          )}
        </div>
      </div>
    `;
  }

  private _renderTile(story: Story, playing: string | null): TemplateResult {
    const config = this._config!;
    const isPlaying = playing === story.id;
    const justPlayed = this._justPlayed === story.id;
    const cover = this._coverUrl(story);
    return html`
      <button
        class=${classMap({ tile: true, playing: isPlaying })}
        style=${styleMap(
          cover ? { backgroundImage: `url("${cover}")` } : {}
        )}
        aria-label=${story.title}
        @click=${() => this._play(story)}
      >
        ${!cover
          ? html`<ha-icon class="fallback" icon="mdi:book-open-variant"></ha-icon>`
          : nothing}
        ${config.show_duration && story.duration_min
          ? html`<span class="badge">~${story.duration_min}m</span>`
          : nothing}
        ${isPlaying
          ? html`<span class="equalizer" aria-hidden="true"
              ><i></i><i></i><i></i
            ></span>`
          : nothing}
        ${justPlayed
          ? html`<span class="pop" aria-hidden="true">
              <ha-icon icon="mdi:play-circle"></ha-icon>
            </span>`
          : nothing}
        <span class="tile-footer">
          ${config.show_titles !== false
            ? html`<span class="tile-title">${story.title}</span>`
            : nothing}
          ${config.show_stats
            ? html`<span class="tile-stats">${this._statsLine(story)}</span>`
            : nothing}
        </span>
      </button>
    `;
  }

  private _renderRow(story: Story, playing: string | null): TemplateResult {
    const config = this._config!;
    const isPlaying = playing === story.id;
    const justPlayed = this._justPlayed === story.id;
    const cover = this._coverUrl(story);
    return html`
      <button
        class=${classMap({ row: true, playing: isPlaying })}
        aria-label=${story.title}
        @click=${() => this._play(story)}
      >
        <span
          class="thumb"
          style=${styleMap(
            cover ? { backgroundImage: `url("${cover}")` } : {}
          )}
        >
          ${!cover
            ? html`<ha-icon icon="mdi:book-open-variant"></ha-icon>`
            : nothing}
          ${isPlaying
            ? html`<span class="equalizer" aria-hidden="true"
                ><i></i><i></i><i></i
              ></span>`
            : nothing}
        </span>
        <span class="row-main">
          <span class="row-title">${story.title}</span>
          ${config.show_stats
            ? html`<span class="row-stats">${this._statsLine(story)}</span>`
            : nothing}
        </span>
        ${config.show_duration && story.duration_min
          ? html`<span class="row-duration">~${story.duration_min}m</span>`
          : nothing}
        <ha-icon
          class="row-play"
          icon=${justPlayed || isPlaying ? "mdi:volume-high" : "mdi:play-circle"}
        ></ha-icon>
      </button>
    `;
  }

  static styles = css`
    ha-card {
      padding: 16px;
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 1.4rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .player-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      padding: 4px 12px;
      font: inherit;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }
    .player-chip:hover {
      background: var(--divider-color);
    }
    .player-chip ha-icon {
      --mdc-icon-size: 16px;
    }
    .sort-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0 4px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 4px 12px;
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .error {
      color: var(--error-color);
      font-size: 0.85rem;
      margin: 8px 0;
    }
    .empty {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
      padding: 24px 8px;
      justify-content: center;
      text-align: center;
    }
    .category {
      margin-top: 16px;
    }
    .category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
      font-size: 1.05rem;
      margin-bottom: 10px;
    }
    .category-header ha-icon {
      --mdc-icon-size: 20px;
    }
    /* --- grid tiles --- */
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }
    .tile {
      position: relative;
      aspect-ratio: 16 / 10;
      border: none;
      border-radius: 16px;
      background-color: var(--secondary-background-color);
      background-size: cover;
      background-position: center;
      cursor: pointer;
      overflow: hidden;
      padding: 0;
      display: flex;
      align-items: flex-end;
      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .tile:active {
      transform: scale(0.95);
    }
    @media (hover: hover) {
      .tile:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      }
    }
    .tile.playing {
      outline: 3px solid var(--primary-color);
      outline-offset: -3px;
    }
    .tile .fallback {
      position: absolute;
      inset: 0;
      margin: auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 42px;
    }
    .badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 0.75rem;
    }
    .tile-footer {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 20px 10px 8px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
      text-align: left;
    }
    .tile-title {
      color: #fff;
      font-size: 1rem;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tile-stats,
    .row-stats {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.72rem;
      margin-top: 2px;
    }
    .row-stats {
      color: var(--secondary-text-color);
    }
    /* --- list rows --- */
    .rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .compact .rows {
      gap: 4px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      border: none;
      border-radius: 14px;
      background: var(--secondary-background-color);
      cursor: pointer;
      padding: 8px;
      font: inherit;
      text-align: left;
      transition: transform 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .compact .row {
      padding: 4px 8px;
      border-radius: 10px;
    }
    .row:active {
      transform: scale(0.98);
    }
    .row.playing {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .thumb {
      position: relative;
      width: 64px;
      height: 48px;
      flex-shrink: 0;
      border-radius: 10px;
      background-color: var(--card-background-color);
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      overflow: hidden;
    }
    .compact .thumb {
      width: 48px;
      height: 36px;
      border-radius: 8px;
    }
    .row-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .row-title {
      color: var(--primary-text-color);
      font-size: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .compact .row-title {
      font-size: 0.9rem;
    }
    .row-duration {
      color: var(--secondary-text-color);
      font-size: 0.8rem;
      flex-shrink: 0;
    }
    .row-play {
      color: var(--primary-color);
      --mdc-icon-size: 28px;
      flex-shrink: 0;
    }
    /* --- playing equalizer --- */
    .equalizer {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 14px;
      background: rgba(0, 0, 0, 0.55);
      border-radius: 6px;
      padding: 3px 5px;
      box-sizing: content-box;
    }
    .equalizer i {
      width: 3px;
      background: #fff;
      border-radius: 1px;
      animation: eq 0.9s ease-in-out infinite;
    }
    .equalizer i:nth-child(2) {
      animation-delay: 0.25s;
    }
    .equalizer i:nth-child(3) {
      animation-delay: 0.5s;
    }
    @keyframes eq {
      0%,
      100% {
        height: 4px;
      }
      50% {
        height: 14px;
      }
    }
    /* --- tap feedback --- */
    .pop {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      animation: pop 1.6s ease forwards;
      pointer-events: none;
    }
    .pop ha-icon {
      --mdc-icon-size: 56px;
    }
    @keyframes pop {
      0% {
        opacity: 0;
        transform: scale(0.6);
      }
      15% {
        opacity: 1;
        transform: scale(1.15);
      }
      30% {
        transform: scale(1);
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `;
}

declare const __VERSION__: string;

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "bedtime-stories-card",
  name: "Bedtime Stories Card",
  description:
    "Kid-friendly story tiles with categories, play statistics and a switchable playback target.",
  preview: true,
  documentationURL: "https://github.com/florianbaethge/bedtime_stories",
});

// eslint-disable-next-line no-console
console.info(
  `%c BEDTIME-STORIES-CARD %c ${__VERSION__} `,
  "color: #fff; background: #5c6bc0; font-weight: 700;",
  "color: #5c6bc0; background: #fff; font-weight: 700;"
);

declare global {
  interface HTMLElementTagNameMap {
    "bedtime-stories-card": BedtimeStoriesCard;
  }
}
