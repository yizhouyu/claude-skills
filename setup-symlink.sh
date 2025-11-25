#!/bin/bash

# Setup script to symlink Desktop/claude-skills to ~/.claude/skills
# This makes all skills in this folder available to Claude Code

SKILLS_DIR="$HOME/Desktop/claude-skills"
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"

echo "Setting up Claude Skills symlink..."

# Check if .claude directory exists
if [ ! -d "$HOME/.claude" ]; then
    echo "Creating ~/.claude directory..."
    mkdir -p "$HOME/.claude"
fi

# Check if ~/.claude/skills already exists
if [ -e "$CLAUDE_SKILLS_DIR" ]; then
    if [ -L "$CLAUDE_SKILLS_DIR" ]; then
        echo "Symlink already exists at $CLAUDE_SKILLS_DIR"
        echo "Current target: $(readlink $CLAUDE_SKILLS_DIR)"
        read -p "Do you want to replace it? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm "$CLAUDE_SKILLS_DIR"
        else
            echo "Aborting."
            exit 0
        fi
    else
        echo "Error: $CLAUDE_SKILLS_DIR already exists and is not a symlink."
        echo "Please move or remove it manually before running this script."
        exit 1
    fi
fi

# Create the symlink
ln -s "$SKILLS_DIR" "$CLAUDE_SKILLS_DIR"

if [ $? -eq 0 ]; then
    echo "✓ Successfully created symlink:"
    echo "  $CLAUDE_SKILLS_DIR -> $SKILLS_DIR"
    echo ""
    echo "Your skills are now available to Claude Code!"
    echo "Restart Claude Code to load the skills."
else
    echo "✗ Failed to create symlink"
    exit 1
fi
