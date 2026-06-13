# Claude Skills

Personal collection of Claude Skills for automating workflows.

## What are Claude Skills?

Claude Skills are folders containing instructions, scripts, and resources that Claude loads dynamically when relevant to a task. They work across Claude.ai, Claude Code, and the Claude API.

## Setup

To use these skills with Claude Code:

1. Clone this repository to your Desktop
2. Run the setup script to create a symlink:
   ```bash
   ./setup-symlink.sh
   ```
3. Restart Claude Code to load the skills

The script creates a symlink from `~/.claude/skills` to this repository, making all skills available to Claude Code.

## Skills in this Repository

### Organize Trip Videos for YouTube
Automates the complete workflow for organizing trip videos into numbered YouTube project folders ready for editing in CapCut.

**Usage**: "Organize my [trip name] videos for YouTube, starting at video [number]"

**What it does**:
1. Analyzes video files by modification date
2. Shows distribution of videos per day
3. Asks which dates to combine (for days with few videos)
4. Creates sequentially numbered project folders (e.g., "70 - Alaska", "71 - Alaska")
5. Copies CapCut project template structure to each folder
6. Moves videos to the correct location (`01 - Unedited/mp4/`)
7. Cleans up temporary files and verifies completion

**Example**:
```
You: "Organize my Alaska trip videos for YouTube, starting at video 70"

Claude analyzes dates, creates folders 70-77 based on 8 days of footage,
and moves all videos into the proper CapCut project structure.
```

**Why it's useful**: Turns a 30-minute manual process of creating folders, copying templates, and organizing hundreds of video files into a single command.

## Adding New Skills

Each skill is a folder containing a `SKILL.md` file with:
- YAML frontmatter (name and description)
- Instructions for Claude on how to perform the task
- Technical implementation notes
- Example usage

See the [official Skills documentation](https://code.claude.com/docs/en/skills) for more details.

## Requirements

- Claude Code (with Skills support)
- macOS, Linux, or WSL on Windows

## License

MIT

### Memory System Skills: capture / lint / digest

Three skills that maintain a personal **AI memory wiki** — a Google Drive folder of markdown files shared as the canonical memory across multiple AI agents (Claude Code, a phone assistant, etc.), following [Karpathy's LLM-wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): raw material is immutable, wiki pages are agent-maintained, a README in the folder is the schema.

The folder structure these skills operate on:

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

**`/capture`** — processes each new item in `inbox/`: reads it, surgically updates the affected wiki pages, archives the item to `sources/`, and appends to `log.md`. Treats material from other agents as lower-trust: contradictions are flagged to the human instead of overwriting.

**`/lint`** — health-checks the whole folder: contradictions between pages, stale "upcoming" items, drifted duplicate facts, missing update stamps, Google Drive conflict copies, and (via a local git repo inside the folder) edits that bypassed the logging convention.

**`/digest`** — summarizes a period's `log.md` entries into a digest page: life changes, decisions, open threads.

Set up 2026-06-12 by Claude Code in a single session — the same session also bootstrapped the folder itself. To adapt: change the hardcoded folder path in each SKILL.md to your own memory folder.
