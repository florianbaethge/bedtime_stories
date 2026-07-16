import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  deleteCategory,
  deleteStory,
  listEntries,
  resetStats,
  saveCategory,
  saveStory,
  subscribeLibrary,
} from "./api";
import { fireEvent } from "./fire-event";
import { localize } from "./i18n";
import { isMediaSource, resolveImage } from "./media-image";
import {
  DEFAULT_CONFIG,
  type BedtimeStoriesCardConfig,
  type Category,
  type EntryRow,
  type HomeAssistant,
  type LibrarySnapshot,
  type Story,
} from "./types";

interface MediaSelectorValue {
  entity_id?: string;
  media_content_id?: string;
  media_content_type?: string;
  metadata?: { title?: string; thumbnail?: string };
}

interface StoryDraft {
  id?: string;
  category_id: string;
  title: string;
  duration_min: number | null;
  image: string | null;
  media_content_id: string;
  media_content_type: string;
  media?: MediaSelectorValue;
  cover_media?: MediaSelectorValue;
}

interface CategoryDraft {
  id?: string;
  name: string;
  icon: string;
}

/** Force-load ha-form and friends (they ship with the entities card editor). */
async function loadHaForm(): Promise<void> {
  if (customElements.get("ha-form")) return;
  try {
    const helpers = await (
      window as unknown as {
        loadCardHelpers?: () => Promise<{
          createCardElement: (config: unknown) => Promise<{
            constructor: { getConfigElement?: () => Promise<unknown> };
          }>;
        }>;
      }
    ).loadCardHelpers?.();
    if (!helpers) return;
    const card = await helpers.createCardElement({
      type: "entities",
      entities: [],
    });
    await card.constructor.getConfigElement?.();
  } catch {
    // ha-form is usually already defined inside the edit dialog
  }
}

@customElement("bedtime-stories-card-editor")
export class BedtimeStoriesCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: BedtimeStoriesCardConfig;

  @state() private _entries: EntryRow[] = [];

  @state() private _library?: LibrarySnapshot;

  /** story.id → resolved cover URL, for images stored as media-source ids. */
  @state() private _covers: Record<string, string> = {};

  @state() private _formReady = false;

  @state() private _categoryDraft: CategoryDraft | null = null;

  @state() private _storyDraft: StoryDraft | null = null;

  @state() private _storyAdvanced = false;

  @state() private _error?: string;

  private _unsubscribe?: Promise<() => Promise<void>>;

  private _subscribedEntry?: string;

  /** Debounced auto-save for content edits (see _autoSaveContent). */
  private _contentTimer?: ReturnType<typeof setTimeout>;

  private _savingContent = false;

  public setConfig(config: BedtimeStoriesCardConfig): void {
    this._config = { ...config };
    this._connectLibrary();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    void loadHaForm().then(() => {
      this._formReady = true;
    });
    this._connectLibrary();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.then((unsub) => unsub()).catch(() => undefined);
    this._unsubscribe = undefined;
    this._subscribedEntry = undefined;
    // Persist a still-pending edit if the dialog is closed mid-debounce.
    if (this._contentTimer) {
      clearTimeout(this._contentTimer);
      this._contentTimer = undefined;
      void this._autoSaveContent();
    }
  }

  protected updated(): void {
    if (this.hass && !this._unsubscribe) {
      this._connectLibrary();
    }
  }

  private _connectLibrary(): void {
    if (!this.hass || !this.isConnected) return;
    const entry = this._config?.entry_id ?? "";
    if (this._unsubscribe && this._subscribedEntry === entry) return;
    this._unsubscribe?.then((unsub) => unsub()).catch(() => undefined);
    this._subscribedEntry = entry;
    void listEntries(this.hass).then((entries) => {
      this._entries = entries;
    });
    this._unsubscribe = subscribeLibrary(
      this.hass,
      (snapshot) => {
        this._library = snapshot;
        this._error = undefined;
        void this._resolveCovers(snapshot);
      },
      this._config?.entry_id || undefined
    );
    this._unsubscribe.catch(() => {
      this._unsubscribe = undefined;
      this._library = undefined;
    });
  }

  private _l(key: string, vars?: Record<string, string | number>): string {
    return localize(this.hass, key, vars);
  }

  /** Resolve any media-source cover ids into displayable thumbnail URLs. */
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
  private _storyThumb(story: Story): string | null {
    if (!story.image) return null;
    if (isMediaSource(story.image)) return this._covers[story.id] ?? null;
    return story.image;
  }

  // ---- settings forms ------------------------------------------------------

  private _basicsSchema(): unknown[] {
    const schema: unknown[] = [];
    if (this._entries.length > 1) {
      schema.push({
        name: "entry_id",
        selector: {
          select: {
            mode: "dropdown",
            options: this._entries.map((e) => ({
              value: e.entry_id,
              label: e.name,
            })),
          },
        },
      });
    }
    schema.push({ name: "title", selector: { text: {} } });
    return schema;
  }

  private _appearanceSchema(): unknown[] {
    const config = { ...DEFAULT_CONFIG, ...this._config };
    const layoutRow: unknown[] = [
      {
        name: "layout",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "grid", label: this._l("layout_grid") },
              { value: "list", label: this._l("layout_list") },
            ],
          },
        },
      },
    ];
    if (config.layout === "list") {
      // Grid tiles scale via the column count; density only helps list rows.
      layoutRow.push({
        name: "density",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "cozy", label: this._l("density_cozy") },
              { value: "compact", label: this._l("density_compact") },
            ],
          },
        },
      });
    } else {
      layoutRow.push({
        name: "columns",
        selector: { number: { min: 0, max: 8, mode: "box" } },
      });
    }
    return [
      { name: "", type: "grid", schema: layoutRow },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "show_titles", selector: { boolean: {} } },
          { name: "show_duration", selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _sortingSchema(): unknown[] {
    return [
      {
        name: "",
        type: "grid",
        schema: [
          {
            name: "sort",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "manual", label: this._l("sort_manual") },
                  { value: "alphabetical", label: this._l("sort_alphabetical") },
                  { value: "play_count", label: this._l("sort_play_count") },
                  { value: "last_played", label: this._l("sort_last_played") },
                ],
              },
            },
          },
          {
            name: "sort_direction",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "asc", label: this._l("asc") },
                  { value: "desc", label: this._l("desc") },
                ],
              },
            },
          },
        ],
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "show_sort_selector", selector: { boolean: {} } },
          { name: "show_stats", selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _playbackSchema(): unknown[] {
    const config = { ...DEFAULT_CONFIG, ...this._config };
    const schema: unknown[] = [
      {
        name: "player_mode",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "select", label: this._l("player_mode_select") },
              { value: "fixed", label: this._l("player_mode_fixed") },
            ],
          },
        },
      },
    ];
    if (config.player_mode === "fixed") {
      schema.push({
        name: "media_player",
        selector: { entity: { domain: "media_player" } },
      });
    } else {
      schema.push({ name: "show_player", selector: { boolean: {} } });
    }
    return schema;
  }

  private _computeLabel = (schema: { name: string }): string =>
    schema.name === "entry_id" ? this._l("entry") : this._l(schema.name);

  private _computeHelper = (schema: { name: string }): string | undefined => {
    if (schema.name === "columns") return this._l("columns_help");
    return undefined;
  };

  /** The cover section has its own header, so the image selector stays unlabeled. */
  private _noLabel = (): string => "";

  private _settingsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as BedtimeStoriesCardConfig;
    this._config = {
      ...this._config,
      ...value,
      type: "custom:bedtime-stories-card",
    };
    fireEvent(this, "config-changed", { config: this._config });
    this._connectLibrary();
  }

  private _renderSettingsForm(schema: unknown[]): TemplateResult {
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ ...DEFAULT_CONFIG, ...this._config }}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `;
  }

  // ---- content management ---------------------------------------------------

  private get _entryId(): string | undefined {
    return this._config?.entry_id || undefined;
  }

  private _startCategory(category?: Category): void {
    this._clearContentTimer();
    this._storyDraft = null;
    this._categoryDraft = category
      ? { id: category.id, name: category.name, icon: category.icon }
      : { name: "", icon: "mdi:teddy-bear" };
  }

  private _startStory(categoryId: string, story?: Story): void {
    this._clearContentTimer();
    this._categoryDraft = null;
    this._storyAdvanced = false;
    this._storyDraft = story
      ? {
          id: story.id,
          category_id: story.category_id,
          title: story.title,
          duration_min: story.duration_min,
          image: story.image,
          media_content_id: story.media_content_id,
          media_content_type: story.media_content_type,
          media: {
            media_content_id: story.media_content_id,
            media_content_type: story.media_content_type,
          },
          cover_media: isMediaSource(story.image)
            ? { media_content_id: story.image, media_content_type: "image/*" }
            : undefined,
        }
      : {
          category_id: categoryId,
          title: "",
          duration_min: null,
          image: null,
          media_content_id: "",
          media_content_type: "audio/mpeg",
        };
  }

  private async _saveCategory(): Promise<void> {
    if (!this.hass || !this._categoryDraft) return;
    this._clearContentTimer();
    try {
      await saveCategory(this.hass, { ...this._categoryDraft }, this._entryId);
      this._categoryDraft = null;
    } catch (err) {
      this._error = (err as { message?: string })?.message;
    }
  }

  private async _deleteCategory(category: Category): Promise<void> {
    if (!this.hass) return;
    if (!window.confirm(this._l("confirm_delete_category"))) return;
    this._clearContentTimer();
    try {
      await deleteCategory(this.hass, category.id, this._entryId);
    } catch (err) {
      this._error = (err as { message?: string })?.message;
    }
  }

  private async _saveStory(): Promise<void> {
    if (!this.hass || !this._storyDraft) return;
    this._clearContentTimer();
    const { media: _media, cover_media: _coverMedia, ...story } =
      this._storyDraft;
    try {
      await saveStory(this.hass, { ...story }, this._entryId);
      this._storyDraft = null;
    } catch (err) {
      this._error = (err as { message?: string })?.message;
    }
  }

  private async _deleteStory(story: Story): Promise<void> {
    if (!this.hass) return;
    if (!window.confirm(this._l("confirm_delete_story"))) return;
    this._clearContentTimer();
    try {
      await deleteStory(this.hass, story.id, this._entryId);
    } catch (err) {
      this._error = (err as { message?: string })?.message;
    }
  }

  private async _resetStoryStats(): Promise<void> {
    if (!this.hass || !this._storyDraft?.id) return;
    await resetStats(this.hass, this._storyDraft.id, this._entryId);
  }

  private _clearContentTimer(): void {
    if (this._contentTimer) {
      clearTimeout(this._contentTimer);
      this._contentTimer = undefined;
    }
  }

  private _scheduleContentSave(): void {
    this._clearContentTimer();
    this._contentTimer = setTimeout(() => void this._autoSaveContent(), 700);
  }

  /**
   * Content (categories & stories) lives in the shared library, saved over the
   * websocket API — it is not part of the card's Lovelace config, so those
   * edits never enable Home Assistant's card-editor "Save" button. To avoid a
   * dead-end where a change looks unsaveable, edits to an existing item persist
   * automatically here (debounced). New items still use their explicit Save
   * button, since they aren't valid until they have the required fields.
   */
  private async _autoSaveContent(): Promise<void> {
    this._contentTimer = undefined;
    if (!this.hass) return;
    if (this._savingContent) {
      this._scheduleContentSave();
      return;
    }
    const story = this._storyDraft;
    const category = this._categoryDraft;
    this._savingContent = true;
    try {
      if (story?.id && story.title.trim() && story.media_content_id.trim()) {
        const { media: _media, cover_media: _coverMedia, ...payload } = story;
        await saveStory(this.hass, { ...payload }, this._entryId);
      } else if (category?.id && category.name.trim()) {
        await saveCategory(this.hass, { ...category }, this._entryId);
      }
    } catch (err) {
      this._error = (err as { message?: string })?.message;
    } finally {
      this._savingContent = false;
    }
  }

  /** Close an auto-saving draft, flushing any edit still inside the debounce. */
  private async _doneStory(): Promise<void> {
    this._clearContentTimer();
    await this._autoSaveContent();
    this._storyDraft = null;
  }

  private async _doneCategory(): Promise<void> {
    this._clearContentTimer();
    await this._autoSaveContent();
    this._categoryDraft = null;
  }

  private _categoryFormChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._categoryDraft = {
      ...this._categoryDraft!,
      ...(ev.detail.value as CategoryDraft),
    };
    if (this._categoryDraft.id) this._scheduleContentSave();
  }

  private _storyFormChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as StoryDraft;
    const draft: StoryDraft = { ...this._storyDraft!, ...value };
    // Copy the media browser pick into the raw content id/type fields.
    const media = value.media;
    if (
      media?.media_content_id &&
      media.media_content_id !== this._storyDraft?.media?.media_content_id
    ) {
      draft.media_content_id = media.media_content_id;
      draft.media_content_type =
        media.media_content_type ?? draft.media_content_type;
      if (!draft.title && media.metadata?.title) {
        draft.title = media.metadata.title;
      }
    }
    // Copy the cover image pick (a media-source id) into the image field;
    // clearing the picker clears the image too.
    const coverMedia = value.cover_media;
    if (
      coverMedia &&
      coverMedia.media_content_id !==
        this._storyDraft?.cover_media?.media_content_id
    ) {
      draft.image = coverMedia.media_content_id || null;
    }
    this._storyDraft = draft;
    if (draft.id) this._scheduleContentSave();
  }

  private _mediaDisplayName(draft: StoryDraft): string | undefined {
    if (draft.media?.metadata?.title) return draft.media.metadata.title;
    if (!draft.media_content_id) return undefined;
    const clean = draft.media_content_id.split("?")[0];
    const segment = decodeURIComponent(clean.split("/").pop() ?? "");
    return segment || draft.media_content_id;
  }

  private _coverDisplayName(draft: StoryDraft): string | undefined {
    if (draft.cover_media?.metadata?.title) {
      return draft.cover_media.metadata.title;
    }
    if (!draft.image) return undefined;
    const clean = draft.image.split("?")[0];
    const segment = decodeURIComponent(clean.split("/").pop() ?? "");
    return segment || draft.image;
  }

  // ---- rendering ----------------------------------------------------------

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    if (!this._formReady) {
      return html`<ha-circular-progress indeterminate></ha-circular-progress>`;
    }
    return html`
      ${this._renderSettingsForm(this._basicsSchema())}
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:palette-outline"></ha-icon>
          <span>${this._l("section_appearance")}</span>
        </div>
        ${this._renderSettingsForm(this._appearanceSchema())}
      </div>
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:sort"></ha-icon>
          <span>${this._l("section_sorting")}</span>
        </div>
        ${this._renderSettingsForm(this._sortingSchema())}
      </div>
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:cast-audio"></ha-icon>
          <span>${this._l("section_playback")}</span>
        </div>
        ${this._renderSettingsForm(this._playbackSchema())}
      </div>
      ${this.hass.user?.is_admin ? this._renderContent() : nothing}
    `;
  }

  private _renderContent(): TemplateResult {
    const lib = this._library;
    return html`
      <div class="section content">
        <div class="section-header">
          <ha-icon icon="mdi:bookshelf"></ha-icon>
          <span>${this._l("tab_content")}</span>
        </div>
        <p class="section-hint">${this._l("content_hint")}</p>
        ${this._error
          ? html`<ha-alert alert-type="error">${this._error}</ha-alert>`
          : nothing}
        ${!lib
          ? html`<p class="section-hint">${this._l("not_configured")}</p>`
          : html`
              ${lib.categories.length === 0 && !this._categoryDraft
                ? html`<p class="section-hint empty">
                    ${this._l("no_categories")}
                  </p>`
                : nothing}
              ${lib.categories.map((category) =>
                this._renderCategoryBlock(category, lib)
              )}
              ${this._categoryDraft && !this._categoryDraft.id
                ? this._renderCategoryForm()
                : html`
                    <mwc-button
                      outlined
                      class="add-category"
                      @click=${() => this._startCategory()}
                    >
                      <ha-icon slot="icon" icon="mdi:plus"></ha-icon>
                      ${this._l("add_category")}
                    </mwc-button>
                  `}
            `}
      </div>
    `;
  }

  private _renderCategoryBlock(
    category: Category,
    lib: LibrarySnapshot
  ): TemplateResult {
    const stories = lib.stories.filter((s) => s.category_id === category.id);
    const editingThis = this._categoryDraft?.id === category.id;
    return html`
      <div class="category-card">
        <div class="category-head">
          <div class="icon-chip">
            <ha-icon icon=${category.icon || "mdi:teddy-bear"}></ha-icon>
          </div>
          <div class="category-text">
            <span class="category-name">${category.name}</span>
            <span class="category-meta"
              >${this._l("stories_count", { count: stories.length })}</span
            >
          </div>
          <ha-icon-button
            .label=${this._l("edit")}
            @click=${() => this._startCategory(category)}
          >
            <ha-icon icon="mdi:pencil-outline"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            class="danger"
            .label=${this._l("delete")}
            @click=${() => this._deleteCategory(category)}
          >
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </ha-icon-button>
        </div>
        ${editingThis ? this._renderCategoryForm() : nothing}
        <div class="story-list">
          ${stories.map((story) => this._renderStoryRow(story, lib))}
        </div>
        ${this._storyDraft &&
        !this._storyDraft.id &&
        this._storyDraft.category_id === category.id
          ? this._renderStoryForm()
          : html`
              <button
                class="add-story"
                @click=${() => this._startStory(category.id)}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>${this._l("add_story")}</span>
              </button>
            `}
      </div>
    `;
  }

  private _renderStoryRow(story: Story, lib: LibrarySnapshot): TemplateResult {
    const editingThis = this._storyDraft?.id === story.id;
    const thumb = this._storyThumb(story);
    const stats = lib.stats[story.id];
    const meta: string[] = [];
    if (story.duration_min) meta.push(`~${story.duration_min}m`);
    if (stats?.play_count) {
      meta.push(
        stats.play_count === 1
          ? this._l("played_once")
          : this._l("played_times", { count: stats.play_count })
      );
    }
    return html`
      <div class="story-row ${editingThis ? "editing" : ""}">
        <span
          class="story-thumb"
          style=${thumb ? `background-image:url("${thumb}")` : ""}
        >
          ${!thumb
            ? html`<ha-icon icon="mdi:book-open-variant"></ha-icon>`
            : nothing}
        </span>
        <div class="story-text">
          <span class="story-title">${story.title}</span>
          ${meta.length
            ? html`<span class="story-meta">${meta.join(" · ")}</span>`
            : nothing}
        </div>
        <ha-icon-button
          .label=${this._l("edit")}
          @click=${() => this._startStory(story.category_id, story)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          class="danger"
          .label=${this._l("delete")}
          @click=${() => this._deleteStory(story)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </ha-icon-button>
      </div>
      ${editingThis ? this._renderStoryForm() : nothing}
    `;
  }

  private _renderCategoryForm(): TemplateResult {
    const draft = this._categoryDraft!;
    const schema = [
      {
        name: "",
        type: "grid",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
    ];
    return html`
      <div class="form-panel">
        <div class="form-title">
          ${this._l(draft.id ? "edit_category" : "new_category")}
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${draft}
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._categoryFormChanged}
        ></ha-form>
        <div class="form-actions">
          ${draft.id
            ? html`<mwc-button raised @click=${this._doneCategory}>
                ${this._l("done")}
              </mwc-button>`
            : html`
                <mwc-button @click=${() => (this._categoryDraft = null)}>
                  ${this._l("cancel")}
                </mwc-button>
                <mwc-button
                  raised
                  .disabled=${!draft.name.trim()}
                  @click=${this._saveCategory}
                >
                  ${this._l("save")}
                </mwc-button>
              `}
        </div>
      </div>
    `;
  }

  private _renderStoryForm(): TemplateResult {
    const draft = this._storyDraft!;
    const categories = this._library?.categories ?? [];
    const basicsSchema = [
      { name: "title", selector: { text: {} } },
      {
        name: "",
        type: "grid",
        schema: [
          {
            name: "category_id",
            selector: {
              select: {
                mode: "dropdown",
                options: categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                })),
              },
            },
          },
          {
            name: "duration_min",
            selector: { number: { min: 1, max: 600, mode: "box" } },
          },
        ],
      },
    ];
    const mediaSchema = [
      { name: "media", selector: { media: { accept: ["audio/*"] } } },
    ];
    const coverSchema = [
      { name: "cover_media", selector: { media: { accept: ["image/*"] } } },
    ];
    const advancedSchema = [
      { name: "media_content_id", selector: { text: {} } },
      { name: "media_content_type", selector: { text: {} } },
      { name: "image", selector: { text: {} } },
    ];
    const labels: Record<string, string> = {
      title: this._l("title"),
      category_id: this._l("category"),
      duration_min: this._l("duration"),
      media: this._l("media"),
      media_content_id: this._l("media_content_id"),
      media_content_type: this._l("media_content_type"),
      image: this._l("image_url"),
    };
    const helpers: Record<string, string> = {
      duration_min: this._l("duration_help"),
      media_content_id: this._l("media_content_id_help"),
      image: this._l("image_url_help"),
    };
    const computeLabel = (s: { name: string }) => labels[s.name] ?? s.name;
    const computeHelper = (s: { name: string }) => helpers[s.name];
    const mediaName = this._mediaDisplayName(draft);
    const coverName = this._coverDisplayName(draft);
    return html`
      <div class="form-panel">
        <div class="form-title">
          ${this._l(draft.id ? "edit_story" : "new_story")}
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${draft}
          .schema=${basicsSchema}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._storyFormChanged}
        ></ha-form>

        <div class="field-group">
          <div class="field-label">
            <ha-icon icon="mdi:music-note"></ha-icon>
            <span>${this._l("media")}</span>
          </div>
          <div class="field-help">${this._l("media_help")}</div>
          <ha-form
            .hass=${this.hass}
            .data=${draft}
            .schema=${mediaSchema}
            .computeLabel=${computeLabel}
            @value-changed=${this._storyFormChanged}
          ></ha-form>
          <div class="media-status ${draft.media_content_id ? "ok" : ""}">
            <ha-icon
              icon=${draft.media_content_id
                ? "mdi:check-circle"
                : "mdi:alert-circle-outline"}
            ></ha-icon>
            <span
              >${draft.media_content_id
                ? `${this._l("media_selected")}: ${mediaName}`
                : this._l("media_none")}</span
            >
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">
            <ha-icon icon="mdi:image-outline"></ha-icon>
            <span>${this._l("cover")}</span>
          </div>
          <div class="field-help">${this._l("cover_help")}</div>
          <ha-form
            .hass=${this.hass}
            .data=${draft}
            .schema=${coverSchema}
            .computeLabel=${this._noLabel}
            @value-changed=${this._storyFormChanged}
          ></ha-form>
          <div class="media-status ${draft.image ? "ok" : ""}">
            <ha-icon
              icon=${draft.image
                ? "mdi:check-circle"
                : "mdi:image-off-outline"}
            ></ha-icon>
            <span
              >${draft.image
                ? `${this._l("cover_selected")}: ${coverName}`
                : this._l("cover_none")}</span
            >
          </div>
        </div>

        <button
          class="advanced-toggle"
          @click=${() => (this._storyAdvanced = !this._storyAdvanced)}
        >
          <ha-icon
            icon=${this._storyAdvanced
              ? "mdi:chevron-down"
              : "mdi:chevron-right"}
          ></ha-icon>
          ${this._l("advanced")}
        </button>
        ${this._storyAdvanced
          ? html`
              <div class="advanced-body">
                <ha-form
                  .hass=${this.hass}
                  .data=${draft}
                  .schema=${advancedSchema}
                  .computeLabel=${computeLabel}
                  .computeHelper=${computeHelper}
                  @value-changed=${this._storyFormChanged}
                ></ha-form>
                ${draft.id
                  ? html`
                      <div class="story-id-row">
                        <span
                          >${this._l("story_id_hint")}:
                          <code>${draft.id}</code></span
                        >
                        <mwc-button dense @click=${this._resetStoryStats}>
                          ${this._l("reset_stats")}
                        </mwc-button>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}

        <div class="form-actions">
          ${draft.id
            ? html`<mwc-button raised @click=${this._doneStory}>
                ${this._l("done")}
              </mwc-button>`
            : html`
                <mwc-button @click=${() => (this._storyDraft = null)}>
                  ${this._l("cancel")}
                </mwc-button>
                <mwc-button
                  raised
                  .disabled=${!draft.title.trim() ||
                  !draft.media_content_id.trim()}
                  @click=${this._saveStory}
                >
                  ${this._l("save")}
                </mwc-button>
              `}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .section {
      margin-top: 24px;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      font-weight: 500;
      color: var(--primary-text-color);
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .section-header ha-icon {
      color: var(--primary-color);
      --mdc-icon-size: 20px;
    }
    .section-hint {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      line-height: 1.4;
      margin: 0 0 12px;
    }
    .section-hint.empty {
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }
    ha-form {
      display: block;
    }
    ha-alert {
      display: block;
      margin-bottom: 12px;
    }
    /* --- category cards --- */
    .category-card {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
      background: var(--card-background-color);
    }
    .category-head {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .icon-chip {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.12);
      color: var(--primary-color);
      flex-shrink: 0;
    }
    .icon-chip ha-icon {
      --mdc-icon-size: 22px;
    }
    .category-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .category-name {
      font-weight: 500;
      font-size: 0.95rem;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .category-meta {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    /* --- story rows --- */
    .story-list {
      margin-top: 4px;
    }
    .story-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 4px;
      border-radius: 8px;
      transition: background 0.15s ease;
    }
    .story-row:hover {
      background: var(--secondary-background-color);
    }
    .story-row.editing {
      background: var(--secondary-background-color);
    }
    .story-thumb {
      width: 56px;
      height: 40px;
      border-radius: 8px;
      background-color: var(--secondary-background-color);
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color);
    }
    .story-thumb ha-icon {
      --mdc-icon-size: 20px;
    }
    .story-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .story-title {
      font-size: 0.9rem;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .story-meta {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    /* --- buttons --- */
    ha-icon-button {
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }
    ha-icon-button.danger:hover {
      color: var(--error-color);
    }
    .add-story {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      margin-top: 8px;
      padding: 8px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      background: none;
      color: var(--primary-color);
      font: inherit;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .add-story:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
    .add-story ha-icon {
      --mdc-icon-size: 18px;
    }
    .add-category {
      width: 100%;
      --mdc-shape-small: 8px;
    }
    /* --- form panels --- */
    .form-panel {
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 16px;
      margin: 12px 0;
    }
    .form-title {
      font-weight: 500;
      font-size: 0.95rem;
      color: var(--primary-text-color);
      margin-bottom: 12px;
    }
    .field-group {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .field-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--primary-text-color);
      margin-bottom: 2px;
    }
    .field-label ha-icon {
      --mdc-icon-size: 16px;
      color: var(--secondary-text-color);
    }
    .field-help {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      line-height: 1.35;
      margin-bottom: 8px;
    }
    .media-status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .media-status.ok {
      color: var(--success-color, #4caf50);
    }
    .media-status ha-icon {
      --mdc-icon-size: 16px;
    }
    .advanced-toggle {
      display: flex;
      align-items: center;
      gap: 2px;
      width: 100%;
      margin-top: 16px;
      border: none;
      border-top: 1px solid var(--divider-color);
      background: none;
      padding: 12px 0 4px;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.82rem;
      cursor: pointer;
    }
    .advanced-toggle ha-icon {
      --mdc-icon-size: 18px;
    }
    .advanced-body {
      margin-top: 8px;
    }
    .story-id-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
    code {
      font-size: 0.78rem;
      background: var(--card-background-color);
      padding: 1px 5px;
      border-radius: 4px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "bedtime-stories-card-editor": BedtimeStoriesCardEditor;
  }
}
