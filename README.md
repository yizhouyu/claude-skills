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

### Sort Files by Date
Organizes files in a directory into numbered subfolders based on their modification dates.

**Usage**: Ask Claude to sort files by date in any folder.

**Features**:
- Analyzes file dates and shows distribution
- Asks for confirmation before moving files
- Supports combining multiple dates into one folder
- Verifies organization after completion

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
