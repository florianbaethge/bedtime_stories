import type {
  EntryRow,
  HomeAssistant,
  LibrarySnapshot,
} from "./types";

const D = "bedtime_stories";

function withEntry(
  msg: Record<string, unknown>,
  entryId?: string
): Record<string, unknown> {
  return entryId ? { ...msg, entry_id: entryId } : msg;
}

export const listEntries = (hass: HomeAssistant): Promise<EntryRow[]> =>
  hass.callWS({ type: `${D}/entries/list` });

/** Resolve a `media-source://…` id to a directly usable (signed) URL. */
export const resolveMediaSource = (
  hass: HomeAssistant,
  mediaContentId: string
): Promise<{ url: string; mime_type: string }> =>
  hass.callWS({
    type: "media_source/resolve_media",
    media_content_id: mediaContentId,
  });

export const getLibrary = (
  hass: HomeAssistant,
  entryId?: string
): Promise<LibrarySnapshot> => hass.callWS(withEntry({ type: `${D}/get` }, entryId));

export const subscribeLibrary = (
  hass: HomeAssistant,
  callback: (snapshot: LibrarySnapshot) => void,
  entryId?: string
): Promise<() => Promise<void>> =>
  hass.connection.subscribeMessage(
    callback,
    withEntry({ type: `${D}/subscribe` }, entryId)
  );

export const playStory = (
  hass: HomeAssistant,
  storyId: string,
  mediaPlayer?: string,
  entryId?: string
): Promise<unknown> =>
  hass.callWS(
    withEntry(
      {
        type: `${D}/play`,
        story_id: storyId,
        ...(mediaPlayer ? { media_player: mediaPlayer } : {}),
      },
      entryId
    )
  );

export const saveCategory = (
  hass: HomeAssistant,
  category: Record<string, unknown>,
  entryId?: string
): Promise<{ id: string }> =>
  hass.callWS(withEntry({ type: `${D}/category/save`, category }, entryId));

export const deleteCategory = (
  hass: HomeAssistant,
  categoryId: string,
  entryId?: string
): Promise<unknown> =>
  hass.callWS(
    withEntry({ type: `${D}/category/delete`, category_id: categoryId }, entryId)
  );

export const reorderCategories = (
  hass: HomeAssistant,
  categoryIds: string[],
  entryId?: string
): Promise<unknown> =>
  hass.callWS(
    withEntry({ type: `${D}/category/reorder`, category_ids: categoryIds }, entryId)
  );

export const saveStory = (
  hass: HomeAssistant,
  story: Record<string, unknown>,
  entryId?: string
): Promise<{ id: string }> =>
  hass.callWS(withEntry({ type: `${D}/story/save`, story }, entryId));

export const deleteStory = (
  hass: HomeAssistant,
  storyId: string,
  entryId?: string
): Promise<unknown> =>
  hass.callWS(withEntry({ type: `${D}/story/delete`, story_id: storyId }, entryId));

export const resetStats = (
  hass: HomeAssistant,
  storyId?: string,
  entryId?: string
): Promise<unknown> =>
  hass.callWS(
    withEntry(
      { type: `${D}/stats/reset`, ...(storyId ? { story_id: storyId } : {}) },
      entryId
    )
  );
