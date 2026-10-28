# Media and covers

[← Back to the README](../README.md)

Both the audio and the cover of a story can be set two ways in the card editor: **browse** Home Assistant's media sources and pick an existing file, or **upload** a new one with the *Upload* button. They are stored differently.

## Audio

Uploaded audio lands in *My media* (`/media`), the same folder a Samba / SMB share exposes, so you do not need to leave Home Assistant to add stories. Uploading needs a writable local media source (the default *My media*); if there is none the editor says so, and you can still upload via **Settings → Media** or a share.

Existing `media-source://media_source/local/...` ids and plain URLs can be pasted into the *Media URL / content id* field as they are.

## Covers

Covers render at 44 to 400 pixels, so a full-size photo or screenshot is wasted bandwidth — and on a phone, a slow dashboard. An uploaded cover therefore goes a different way than audio:

1. The browser downscales it to at most 1024 pixels on the long edge before uploading.
2. It is stored in Home Assistant's built-in image store (`image_upload`).
3. The card loads it from a stable `/api/image/serve/<id>/512x512` URL. Home Assistant generates that thumbnail once and lets the browser cache it, so the companion app does not download the cover again on every open.

If the image store is not reachable, the upload falls back to *My media* — still downscaled, just not cached.

Any `/api/image/serve/...` path or image URL also works in the cover's *Advanced* URL field.

## Older covers

Covers uploaded before version 0.3.0, and covers picked from the media browser, point into *My media* and are loaded at full size through a signed URL that changes on every load, so the browser can never cache them. A library with many such covers loads slowly.

Since version 0.6.0 the integration fixes that on its own when Home Assistant starts: each story whose cover still points into *My media* gets a downscaled copy (at most 1024 pixels, JPEG — PNG when it has transparency, GIFs as they are) in the image store, and the story then uses the cached thumbnail URL. Each cover is converted once; a cover picked from the media browser later is converted on the next start.

The original file in *My media* is left where it is — delete it yourself if nothing else uses it. Files that are missing or not readable as images are skipped, and the story keeps its cover as it was. The log says how many covers were converted:

```
Optimized 12 cover image(s) of Bedtime Stories for faster loading
```
