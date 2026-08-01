import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import {
  playStory,
  recordPlay,
  resolveMediaSource,
  subscribeLibrary,
} from "./api";
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

/** Unified view of whatever is currently playing (cast target or this device). */
interface ActivePlayback {
  story: Story;
  /** True while actually producing sound (drives the equalizer / pause icon). */
  playing: boolean;
  /** True when the audio plays in this browser tab rather than on a player. */
  local: boolean;
  position: number;
  /** Total length in seconds, or 0 when unknown (streams). */
  duration: number;
  canSeek: boolean;
  canPause: boolean;
}

/** Media-player `supported_features` bits we care about. */
const FEATURE_PAUSE = 1;
const FEATURE_SEEK = 2;
const FEATURE_PLAY = 16384;

/** Minimal Screen Wake Lock typings (avoids depending on the DOM lib version). */
interface WakeLockLike {
  release(): Promise<void>;
  addEventListener(type: "release", listener: () => void): void;
}
type WakeLockNavigator = Navigator & {
  wakeLock?: { request(type: "screen"): Promise<WakeLockLike> };
};

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

  /** "This device" mode: play the audio in the browser instead of casting. */
  @state() private _playHere = false;

  @state() private _localPlayingId: string | null = null;

  @state() private _localPaused = false;

  @state() private _localPos = 0;

  @state() private _localDur = 0;

  /** While the user drags the seek slider, freeze the shown position. */
  @state() private _scrubbing = false;

  @state() private _scrubValue = 0;

  @query("audio") private _audioEl?: HTMLAudioElement;

  private _unsubscribe?: Promise<() => Promise<void>>;

  private _subscribedEntry?: string;

  /** Ticks the displayed position for external players between hass updates. */
  private _positionTimer?: number;

  private _wakeLock?: WakeLockLike;

  public static getConfigElement(): HTMLElement {
    return document.createElement("bedtime-stories-card-editor");
  }

  public static getStubConfig(): Partial<BedtimeStoriesCardConfig> {
    return { title: "Bedtime Stories" };
  }

  public setConfig(config: BedtimeStoriesCardConfig): void {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration");
    }
    if (config.layout && config.layout !== "grid" && config.layout !== "list") {
      throw new Error('layout must be "grid" or "list"');
    }
    if (config.player_mode === "fixed" && !config.media_player) {
      throw new Error('player_mode "fixed" requires a media_player');
    }
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._localSort = this._loadLocalSort();
    this._playHere = this._loadPlayHere();
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
    document.addEventListener("visibilitychange", this._onVisibility);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._teardown();
    this._stopLocal();
    document.removeEventListener("visibilitychange", this._onVisibility);
    this._stopPositionTimer();
  }

  protected updated(): void {
    if (this.hass && !this._unsubscribe) {
      this._resubscribe();
    }
    this._syncPositionTimer();
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

  // ---- "this device" playback ----------------------------------------------

  private _deviceStorageKey(): string {
    return `bedtime-stories-here:${this._config?.entry_id ?? "default"}`;
  }

  private _loadPlayHere(): boolean {
    try {
      return window.localStorage.getItem(this._deviceStorageKey()) === "1";
    } catch {
      return false;
    }
  }

  private _togglePlayHere(): void {
    this._playHere = !this._playHere;
    try {
      window.localStorage.setItem(
        this._deviceStorageKey(),
        this._playHere ? "1" : "0"
      );
    } catch {
      // private mode etc. — still works for this session
    }
    if (!this._playHere) this._stopLocal();
  }

  private _stopLocal(): void {
    this._audioEl?.pause();
    this._localPlayingId = null;
    this._localPaused = false;
    this._localPos = 0;
    this._localDur = 0;
    this._releaseWakeLock();
  }

  private _onAudioMeta = (): void => {
    const d = this._audioEl?.duration ?? 0;
    this._localDur = Number.isFinite(d) ? d : 0;
  };

  private _onAudioTime = (): void => {
    if (this._scrubbing) return;
    this._localPos = this._audioEl?.currentTime ?? 0;
  };

  private _onAudioPlay = (): void => {
    this._localPaused = false;
    void this._acquireWakeLock();
  };

  private _onAudioPause = (): void => {
    this._localPaused = true;
    this._releaseWakeLock();
  };

  private _onAudioEnded = (): void => {
    this._localPlayingId = null;
    this._localPaused = false;
    this._localPos = 0;
    this._releaseWakeLock();
  };

  private _onAudioError = (): void => {
    this._localPlayingId = null;
    this._releaseWakeLock();
    if (this._playHere) this._flashError(localize(this.hass, "play_failed"));
  };

  // ---- screen wake lock (keep the device awake while playing locally) -------

  private async _acquireWakeLock(): Promise<void> {
    if (this._config?.keep_awake === false) return;
    const nav = navigator as WakeLockNavigator;
    if (!nav.wakeLock || this._wakeLock) return;
    try {
      const lock = await nav.wakeLock.request("screen");
      this._wakeLock = lock;
      lock.addEventListener("release", () => {
        if (this._wakeLock === lock) this._wakeLock = undefined;
      });
    } catch {
      // Denied (page hidden / unsupported) — playback still works.
    }
  }

  private _releaseWakeLock(): void {
    this._wakeLock?.release().catch(() => undefined);
    this._wakeLock = undefined;
  }

  /** The lock is dropped when the screen turns off; re-take it once visible. */
  private _onVisibility = (): void => {
    if (
      document.visibilityState === "visible" &&
      this._localPlayingId &&
      !this._localPaused
    ) {
      void this._acquireWakeLock();
    }
  };

  // ---- external-player position ticker --------------------------------------

  private _syncPositionTimer(): void {
    const active = this._activePlayback();
    const needsTick =
      !!active &&
      !active.local &&
      active.playing &&
      this._config?.show_now_playing !== false &&
      !this._scrubbing;
    if (needsTick && this._positionTimer === undefined) {
      this._positionTimer = window.setInterval(
        () => this.requestUpdate(),
        1000
      );
    } else if (!needsTick) {
      this._stopPositionTimer();
    }
  }

  private _stopPositionTimer(): void {
    if (this._positionTimer !== undefined) {
      window.clearInterval(this._positionTimer);
      this._positionTimer = undefined;
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

  /** Whatever is currently loaded on the active target, unified across modes. */
  private _activePlayback(): ActivePlayback | null {
    const lib = this._library;
    if (!lib || !this.hass) return null;

    if (this._playHere) {
      if (!this._localPlayingId) return null;
      const story = lib.stories.find((s) => s.id === this._localPlayingId);
      if (!story) return null;
      const dur = Number.isFinite(this._localDur) ? this._localDur : 0;
      return {
        story,
        local: true,
        playing: !this._localPaused,
        position: this._localPos,
        duration: dur > 0 ? dur : 0,
        canSeek: dur > 0,
        canPause: true,
      };
    }

    const player = this._targetPlayer();
    const st = player ? this.hass.states[player] : undefined;
    if (!st || (st.state !== "playing" && st.state !== "paused")) return null;
    const title = st.attributes.media_title as string | undefined;
    if (!title) return null;
    const story = lib.stories.find((s) => s.title === title);
    if (!story) return null;

    const duration = Number(st.attributes.media_duration) || 0;
    let position = Number(st.attributes.media_position) || 0;
    const updatedAt = st.attributes.media_position_updated_at as
      | string
      | undefined;
    if (st.state === "playing" && updatedAt) {
      position += (Date.now() - Date.parse(updatedAt)) / 1000;
    }
    if (duration > 0) position = Math.min(position, duration);
    const feat = Number(st.attributes.supported_features) || 0;
    return {
      story,
      local: false,
      playing: st.state === "playing",
      position: Math.max(0, position),
      duration,
      canSeek: (feat & FEATURE_SEEK) !== 0 && duration > 0,
      canPause:
        (feat & FEATURE_PAUSE) !== 0 || (feat & FEATURE_PLAY) !== 0,
    };
  }

  private _togglePlayPause(active: ActivePlayback): void {
    if (active.local) {
      const audio = this._audioEl;
      if (!audio) return;
      if (audio.paused) void audio.play().catch(() => undefined);
      else audio.pause();
      return;
    }
    const player = this._targetPlayer();
    if (!player || !this.hass) return;
    void this.hass.callService(
      "media_player",
      active.playing ? "media_pause" : "media_play",
      { entity_id: player }
    );
  }

  private _onScrub(ev: Event): void {
    this._scrubbing = true;
    this._scrubValue = Number((ev.target as HTMLInputElement).value);
  }

  private _onSeek(ev: Event, active: ActivePlayback): void {
    const value = Number((ev.target as HTMLInputElement).value);
    this._scrubbing = false;
    if (active.local) {
      if (this._audioEl) this._audioEl.currentTime = value;
      this._localPos = value;
      return;
    }
    const player = this._targetPlayer();
    if (player && this.hass) {
      void this.hass.callService("media_player", "media_seek", {
        entity_id: player,
        seek_position: value,
      });
    }
  }

  private _fmtTime(sec: number): string {
    const total = Number.isFinite(sec) && sec > 0 ? Math.floor(sec) : 0;
    const m = Math.floor(total / 60);
    const r = total % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  }

  // ---- actions ----------------------------------------------------------------

  private _flashError(message: string): void {
    this._error = message;
    window.setTimeout(() => {
      this._error = undefined;
    }, 4000);
  }

  private async _play(story: Story): Promise<void> {
    if (!this.hass) return;
    if (this._playHere) {
      await this._playLocal(story);
      return;
    }
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
      this._flashError((err as { message?: string })?.message ?? "play failed");
    }
  }

  /** Resolve a story's media id into a URL the browser can play. */
  private async _resolveMediaUrl(mediaId: string): Promise<string | null> {
    if (!this.hass) return null;
    if (!isMediaSource(mediaId)) return mediaId;
    try {
      const { url } = await resolveMediaSource(this.hass, mediaId);
      return url;
    } catch {
      return null;
    }
  }

  /** Play a story's audio in this browser tab (companion app included). */
  private async _playLocal(story: Story): Promise<void> {
    const audio = this._audioEl;
    if (!audio || !this.hass) return;
    // Tapping the currently playing tile stops it.
    if (this._localPlayingId === story.id && !audio.paused) {
      this._stopLocal();
      return;
    }
    this._justPlayed = story.id;
    window.setTimeout(() => {
      if (this._justPlayed === story.id) this._justPlayed = null;
    }, 1600);
    const url = await this._resolveMediaUrl(story.media_content_id);
    if (!url) {
      this._justPlayed = null;
      this._flashError(localize(this.hass, "play_failed"));
      return;
    }
    try {
      this._localPos = 0;
      this._localDur = 0;
      this._localPaused = false;
      audio.src = url;
      await audio.play();
      this._localPlayingId = story.id;
      // Count the play (stats + logbook) without casting to a media player.
      void recordPlay(
        this.hass,
        story.id,
        localize(this.hass, "this_device"),
        this._config?.entry_id
      ).catch(() => undefined);
    } catch {
      // Autoplay blocked or codec unsupported — a second tap usually works.
      this._justPlayed = null;
      this._localPlayingId = null;
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
    const active = this._activePlayback();
    const activeId = active?.story.id ?? null;
    const playingNow = active?.playing ? active.story.id : null;
    const player = this._targetPlayer();
    const showChip =
      config.show_player !== false &&
      config.player_mode !== "fixed" &&
      (this._library?.players.length ?? 0) > 0;

    return html`
      <ha-card class=${classMap({ compact })}>
        <div class="header">
          ${config.title ? html`<h1>${config.title}</h1>` : nothing}
          <div class="header-chips">
            ${config.show_device_toggle !== false
              ? html`<button
                  class=${classMap({
                    "player-chip": true,
                    "device-chip": true,
                    active: this._playHere,
                  })}
                  title=${localize(this.hass, "this_device")}
                  @click=${this._togglePlayHere}
                >
                  <ha-icon icon="mdi:cellphone-play"></ha-icon>
                  <span>${localize(this.hass, "this_device")}</span>
                </button>`
              : nothing}
            ${showChip && !this._playHere
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
        </div>
        ${config.show_sort_selector ? this._renderSortChips() : nothing}
        ${config.show_now_playing !== false && active
          ? this._renderNowPlaying(active)
          : nothing}
        ${this._error
          ? html`<div class="error">${this._error}</div>`
          : nothing}
        ${categories.length === 0
          ? html`<div class="empty">
              <ha-icon icon="mdi:sleep"></ha-icon>
              ${localize(this.hass, "empty")}
            </div>`
          : categories.map((category) =>
              this._renderCategory(category, activeId, playingNow)
            )}
        <audio
          @loadedmetadata=${this._onAudioMeta}
          @timeupdate=${this._onAudioTime}
          @play=${this._onAudioPlay}
          @pause=${this._onAudioPause}
          @ended=${this._onAudioEnded}
          @error=${this._onAudioError}
        ></audio>
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

  private _renderNowPlaying(active: ActivePlayback): TemplateResult {
    const cover = this._coverUrl(active.story);
    const dur = active.duration;
    const pos = this._scrubbing ? this._scrubValue : active.position;
    return html`
      <div class="now-playing">
        <span
          class="np-cover"
          style=${styleMap(
            cover ? { backgroundImage: `url("${cover}")` } : {}
          )}
        >
          ${!cover
            ? html`<ha-icon icon="mdi:book-open-variant"></ha-icon>`
            : nothing}
        </span>
        <div class="np-main">
          <span class="np-title">${active.story.title}</span>
          <div class="np-seek">
            <span class="np-time">${this._fmtTime(pos)}</span>
            ${dur > 0
              ? html`<input
                  class="np-range"
                  type="range"
                  min="0"
                  max=${String(Math.ceil(dur))}
                  step="1"
                  .value=${String(Math.floor(pos))}
                  ?disabled=${!active.canSeek}
                  aria-label=${localize(this.hass, "now_playing")}
                  @input=${(e: Event) => this._onScrub(e)}
                  @change=${(e: Event) => this._onSeek(e, active)}
                />`
              : html`<span class="np-track"></span>`}
            <span class="np-time"
              >${dur > 0 ? this._fmtTime(dur) : "–:–"}</span
            >
          </div>
        </div>
        <button
          class="np-btn"
          ?disabled=${!active.canPause}
          title=${localize(this.hass, active.playing ? "pause" : "resume")}
          @click=${() => this._togglePlayPause(active)}
        >
          <ha-icon
            icon=${active.playing ? "mdi:pause" : "mdi:play"}
          ></ha-icon>
        </button>
      </div>
    `;
  }

  private _renderCategory(
    category: Category,
    activeId: string | null,
    playingNow: string | null
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
              ? this._renderTile(story, activeId, playingNow)
              : this._renderRow(story, activeId, playingNow)
          )}
        </div>
      </div>
    `;
  }

  private _renderTile(
    story: Story,
    activeId: string | null,
    playingNow: string | null
  ): TemplateResult {
    const config = this._config!;
    const isActive = activeId === story.id;
    const isPlaying = playingNow === story.id;
    const justPlayed = this._justPlayed === story.id;
    const cover = this._coverUrl(story);
    return html`
      <button
        class=${classMap({ tile: true, playing: isActive })}
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

  private _renderRow(
    story: Story,
    activeId: string | null,
    playingNow: string | null
  ): TemplateResult {
    const config = this._config!;
    const isActive = activeId === story.id;
    const isPlaying = playingNow === story.id;
    const justPlayed = this._justPlayed === story.id;
    const cover = this._coverUrl(story);
    return html`
      <button
        class=${classMap({ row: true, playing: isActive })}
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
    .header-chips {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .device-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .device-chip.active:hover {
      background: var(--primary-color);
    }
    audio {
      display: none;
    }
    /* --- now playing bar --- */
    .now-playing {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 12px 0 4px;
      padding: 8px 10px;
      border-radius: 14px;
      background: var(--secondary-background-color);
    }
    .np-cover {
      width: 44px;
      height: 44px;
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
    .np-cover ha-icon {
      --mdc-icon-size: 22px;
    }
    .np-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
      gap: 4px;
    }
    .np-title {
      color: var(--primary-text-color);
      font-size: 0.95rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .np-seek {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .np-time {
      color: var(--secondary-text-color);
      font-size: 0.72rem;
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
      min-width: 30px;
    }
    .np-time:last-child {
      text-align: right;
    }
    .np-range {
      flex: 1;
      min-width: 0;
      height: 4px;
      margin: 0;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .np-range:disabled {
      cursor: default;
      opacity: 0.7;
    }
    .np-track {
      flex: 1;
      min-width: 0;
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color);
    }
    .np-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 0.15s ease;
    }
    .np-btn:active {
      transform: scale(0.92);
    }
    .np-btn:disabled {
      background: var(--divider-color);
      color: var(--secondary-text-color);
      cursor: default;
    }
    .np-btn ha-icon {
      --mdc-icon-size: 26px;
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
