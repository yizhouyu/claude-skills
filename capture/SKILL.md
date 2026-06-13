---
name: capture
description: Process new items in Yizhou's ai_context inbox — read each raw item, update the affected memory pages, archive the item to sources/, and log the change. Use when the user types /capture, says 处理 inbox, or mentions having dropped new material into ai_context/inbox.
---

# Capture — process the ai_context inbox

Canonical folder: `/Users/yzy/Library/CloudStorage/GoogleDrive-yizhouyu66@gmail.com/My Drive/ai_context/` (the Desktop `ai_context` item is a macOS alias to it). Read its `README.md` first if you haven't this session — it is the schema.

## Steps

1. List files in `inbox/` (ignore `README.md`). If empty, say so and stop.
2. For each item, oldest first:
   - Read it. Images: read visually. Files containing a bare URL: fetch the URL.
   - Decide which wiki pages it affects (see the README structure table). Update those pages **surgically** — edit the relevant bullets, never rewrite whole files. Stamp `Last updated: YYYY-MM-DD` at the bottom of each touched file.
   - **Source trust**: items Yizhou wrote or dictated himself are high-trust — if they contradict existing memory, prefer the newer information and fix the page. Items from other agents (`xlx-` prefix = 小龙虾) are low-trust: take new facts that don't conflict, but if one contradicts the wiki, do NOT overwrite — flag it to Yizhou and let him arbitrate. Pure noise (heartbeat logs, agent self-talk with no facts about Yizhou's life) → archive to sources/ without touching the wiki, note it as skipped.
   - Move the item to `sources/YYYY-MM/` (create the month dir if needed), keeping the original filename.
   - Append to `log.md` (bottom): `## [YYYY-MM-DD] capture | <filename>: <one-line summary of what changed>`
3. Report in chat, in Chinese: per item, what was learned and which pages changed.

## Conventions

- Memory content stays agent-agnostic — no tool- or agent-specific references in the wiki pages.
- Significant life-context shifts also update `current.md`.
- Do not edit anything inside `sources/`.
