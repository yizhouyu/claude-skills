# Claude Skills

Ten skills I use daily with Claude Code, covering three workflows I got tired of doing by hand: a cross-agent memory system, YouTube publishing, and health-data analysis. Each is a folder with a `SKILL.md` that Claude loads when the task comes up.

| Skill | What it does |
|---|---|
| [`capture`](capture/SKILL.md) | Processes new items dropped in a memory inbox: updates the affected wiki pages, archives the raw item, logs the change |
| [`lint`](lint/SKILL.md) | Health-checks that memory folder — contradictions between pages, stale claims, drifted duplicates, missing stamps, Drive conflict copies |
| [`digest`](digest/SKILL.md) | Summarizes a period's change log into a digest page |
| [`memory-gc`](memory-gc/SKILL.md) | Weekly garbage collection: expires stale claims, merges duplicates, promotes recurring log patterns into durable pages, recompiles the bootstrap file other agents read |
| [`publish-video`](publish-video/SKILL.md) | Publishes a finished vlog end to end from chat — locate the export, generate bilingual SEO metadata, upload, optionally sync to Bilibili |
| [`organize-trip-videos`](organize-trip-videos/SKILL.md) | Sorts a trip's footage by date into numbered CapCut project folders |
| [`health`](health/SKILL.md) | Analyzes Oura data — weekly sentinel reports, weekday-strain and bedtime deep dives, anomaly interpretation |
| [`deep-research-survey`](deep-research-survey/SKILL.md) | Multi-agent parallel investigation with cross-source verification, for topic surveys |
| [`skill-writing-guide`](skill-writing-guide/SKILL.md) | Best practices for writing skill files — loaded whenever I write another one |

## Setup

```bash
git clone https://github.com/yizhouyu/claude-skills.git ~/Desktop/claude-skills
cd ~/Desktop/claude-skills && ./setup-symlink.sh
```

The script symlinks `~/.claude/skills` to this repo, so every skill is available to Claude Code. Restart Claude Code to pick them up.

Requires Claude Code with Skills support, on macOS, Linux, or WSL.

## The memory skills, in more detail

`capture`, `lint`, `digest`, and `memory-gc` maintain a personal **AI memory wiki** — a Google Drive folder of markdown files that several AI agents (Claude Code, a phone assistant) share as their canonical memory, following [Karpathy's LLM-wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): raw material is immutable, wiki pages are agent-maintained, and a README in the folder is the schema.

```
ai_context/
├── README.md          # schema: structure, workflows, conventions
├── profile.md, current.md, preferences.md, ...   # topical wiki pages
├── inbox/             # drop zone for raw material (anything, unsorted)
├── sources/YYYY-MM/   # processed raw material, immutable archive
├── compiled/          # generated bootstrap summaries for other agents
├── log.md             # append-only change log (every edit, every agent)
└── digests/           # periodic summaries
```

**`/capture`** reads each new inbox item, surgically updates the affected pages, archives the item to `sources/`, and appends to `log.md`. Material written by other agents is treated as lower-trust: contradictions get flagged to me rather than silently overwriting a page.

**`/lint`** finds what drifts — contradictions between pages, stale "upcoming" items, duplicate facts that diverged, missing update stamps, Google Drive conflict copies, and (via a git repo inside the folder) edits that bypassed the logging convention.

**`/digest`** turns a period of log entries into a readable summary: changes, decisions, open threads.

**`/memory-gc`** runs unattended every Sunday via launchd and does the slower work: expiring claims that have aged out, merging duplicates `lint` only flagged, and promoting patterns that keep recurring in the log into their own durable page.

To adapt any of these, change the hardcoded folder path in the relevant `SKILL.md`.

## Adding a skill

A skill is a folder with a `SKILL.md`: YAML frontmatter (name, description), instructions for Claude, implementation notes, and example usage. The `skill-writing-guide` skill in this repo is what I load before writing a new one. See the [official docs](https://code.claude.com/docs/en/skills) for the format.

## License

MIT
