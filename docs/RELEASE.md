# Standalone release verification

- Independently copied from the integrated painting engine; the source applications were not edited.
- No original reference photos, personal documents, credentials, model weights, FFmpeg binaries or generated user outputs are included.
- 11 local tests passed, including all 42 medium pairs, source preservation, safe storage boundaries, real H.264 conversion, reuse and failure cleanup.
- JavaScript syntax checks passed.
- Headless Chrome: demo, mixed-media painting, pause/resume/cancel, real PNG/WebM/MP4 output, MP4 decoding, comparison, fit after pan/zoom, desktop and narrow layout passed.
- Source engine checksums at extraction are recorded in `engine-provenance.json`. They document origin, not a requirement that future standalone edits stay byte-identical.
- The demo and screenshot were created from procedural drawing code in this repository.
- MP4 requires a separately installed FFmpeg executable with libx264 support.
- License selection is pending; this release does not grant an open-source license.
