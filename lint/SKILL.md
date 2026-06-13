---
name: lint
description: Health-check Yizhou's ai_context memory folder — find contradictions, stale claims, drifted duplicate facts, missing stamps, Google Drive conflict copies, and unprocessed inbox items. Use when the user types /lint or asks to check the memory's health.
---

# Lint — ai_context health check

Canonical folder: `/Users/yzy/Library/CloudStorage/GoogleDrive-yizhouyu66@gmail.com/My Drive/ai_context/` (Desktop `ai_context` is a macOS alias to it).

Read every `.md` file in the folder (skip `sources/`), then check:

1. **Contradictions** — same fact with different values across files. Authority order: `decisions.md` for decisions, `current.md` for current state, newer stamp wins otherwise.
2. **Stale claims** — "Upcoming" items whose date has passed (move to recent/past sections), "currently" statements that no longer hold against `current.md`.
3. **Duplicate drift** — the same fact maintained in 2+ files with diverging wording. Known hotspots: reading/podcasts/poker across `preferences.md` + `interests.md` + `current.md`; FIRE numbers across `goals.md` + `finances.md`; career summary across `profile.md` + `career.md`.
4. **Hygiene** — missing `Last updated` stamps; Google Drive conflict copies (filenames containing "(1)" or "conflict"); `inbox/` items older than ~7 days.
5. **Gaps** — facts referenced but never defined; open questions worth asking Yizhou.
6. **Unauthorized edits** — the folder is a git repo: run `git status`/`git diff` to see changes since the last lint commit, and cross-check wiki-page changes against `log.md` entries. A wiki edit with no matching log entry is suspicious (possibly another agent writing outside inbox/) — show Yizhou the diff. Finish each lint by committing: `git add -A && git commit -m "lint YYYY-MM-DD"`.

Fix mechanical issues directly (stale dates, stamps, syncing drifted wording toward the authoritative version). For judgment calls — which of two facts is true — ask Yizhou instead of guessing.

Finish by appending to `log.md`: `## [YYYY-MM-DD] lint | <n> issues found, <m> fixed` and report findings in chat, ranked by importance, in Chinese.
