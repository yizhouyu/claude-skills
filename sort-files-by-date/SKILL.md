---
name: Sort Files by Date
description: Sorts files in a folder into numbered subfolders based on their modification dates, with preview and confirmation
---

# Sort Files by Date Skill

This skill helps organize files in a directory into numbered subfolders based on their modification dates.

## Workflow

When the user asks to sort files by date in a folder, follow these steps:

### 1. Analyze the folder
- List all files in the target directory
- Extract modification dates from the files
- Generate a date distribution summary showing:
  - Unique dates found
  - Number of files for each date
  - Date ranges

### 2. Present the analysis
Show the user:
- Total number of files found
- Date range (earliest to latest)
- Distribution of files per date
- Proposed folder numbering scheme

### 3. Ask for confirmation and folder merging preferences
- Ask if the user wants to proceed
- Ask if any dates should be combined into the same folder
- Confirm the folder numbering scheme

### 4. Execute the organization
Once confirmed:
- Create numbered folders (1, 2, 3, etc.) within the target directory
- Move files into the appropriate numbered folders based on their dates
- Use `find` command with `-newermt` for reliable date-based file selection
- Handle edge cases (special characters in filenames, etc.)

### 5. Verify and report
- Count files in each numbered folder
- Verify no files remain in the root directory (except non-target files)
- Report the final organization

## Technical Implementation Notes

### Date-based file moving
Use the `find` command for reliable date-based file selection:

```bash
find . -maxdepth 1 -name "*.EXT" -newermt "YYYY-MM-DD" ! -newermt "YYYY-MM-DD" -exec mv {} folder/ \;
```

### Handling date ranges
- Parse modification dates using `ls -l` output
- Extract dates with `awk '{print $6, $7}'`
- Count files per date with `sort | uniq -c`

### Folder creation
- Create all numbered folders upfront: `mkdir -p 1 2 3 4 5 ...`
- Move files sequentially by date range

### Verification
- Always verify the organization after completion
- Count files in each folder: `ls folder/*.EXT | wc -l`
- Check for remaining files in root

## Example Usage

User: "Sort the videos in my Alaska folder by date"

Response:
1. Analyze the folder and show date distribution
2. Propose: "I found videos from Aug 29 to Sep 6. I'll create 8 folders..."
3. Ask: "Any dates you want to combine?"
4. Execute the file moves
5. Report: "Done! Organized X files into Y folders..."

## Notes
- Always show the date distribution BEFORE moving files
- Default to one folder per date unless user specifies otherwise
- Handle file extensions case-insensitively if needed
- Clean up any thumbnail or metadata files if requested
