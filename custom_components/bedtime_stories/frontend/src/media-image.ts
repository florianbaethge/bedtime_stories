import { resolveMediaSource } from "./api";
import type { HomeAssistant } from "./types";

/** Cover values that browse from the media library carry this scheme. */
export function isMediaSource(value?: string | null): value is string {
  return typeof value === "string" && value.startsWith("media-source://");
}

interface CachedUrl {
  url: string;
  at: number;
}

// Resolved media-source URLs are signed and time-limited, so we cache them only
// briefly — long enough to avoid a websocket round-trip per re-render, short
// enough that a freshly created <img> never points at an expired signature.
const TTL_MS = 4 * 60 * 1000;
const cache = new Map<string, CachedUrl>();

/**
 * Turn a stored cover value into something usable as an image URL: a
 * `media-source://…` id is resolved via the websocket API (and cached), while
 * plain URLs / `/api/image/serve/…` paths pass straight through.
 */
export async function resolveImage(
  hass: HomeAssistant,
  value?: string | null
): Promise<string | null> {
  if (!value) return null;
  if (!isMediaSource(value)) return value;
  const now = Date.now();
  const hit = cache.get(value);
  if (hit && now - hit.at < TTL_MS) return hit.url;
  try {
    const { url } = await resolveMediaSource(hass, value);
    cache.set(value, { url, at: now });
    return url;
  } catch {
    return null;
  }
}
