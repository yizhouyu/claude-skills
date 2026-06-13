---
name: publish-video
description: Publish a finished vlog through youtube-manager, driven entirely from chat — locate the exported video, generate bilingual SEO metadata, upload to YouTube, optionally sync to Bilibili. Use when Yizhou says a video is done / ready to upload (视频做好了 / 上传 / 发视频 / publish).
---

# Publish Video — conversation-as-UI for youtube-manager

Repo: `/Users/yzy/Desktop/youtube-manager` (Python, venv at `./venv`). **Read its `CLAUDE.md` first** for architecture; the Web UI is legacy — Yizhou's principle (2026-06-12): for personal tools, Claude Code conversation IS the interface.

## Flow

1. **Locate the video**: ask which file (or scan the trip's project folder from organize-trip-videos for the newest export + thumbnail). Confirm video + thumbnail paths.
2. **Generate metadata**: use the existing bilingual SEO generator (`src/seo_optimizer`, or the `new-video` CLI command with topic/locations/key-points). Present the 3 options (engaging / informative / curiosity) in chat; he picks one and may edit lines inline.
3. **Upload**: drive `src/uploader` from Python (the CLI has no upload command yet — first time, add a thin `upload` Click command to `src/cli/main.py` wrapping the uploader, and commit it to the repo). Always confirm before the actual upload call: title, privacy (default ask: private/unlisted/public/scheduled), thumbnail.
4. **After upload**: offer Bilibili sync (`sync-to-bilibili`) and an analytics snapshot (`analytics-dashboard --save-snapshot`); mark the video tracked (`mark-tool-generated`).
5. **Memory**: append to ai_context `log.md` and update the backlog count in `current.md` (one trip cleared).

## Conventions

- OAuth tokens already configured in the repo's config; if auth fails, tell him to re-run the auth flow rather than debugging silently.
- Never make a video public without explicit confirmation.
