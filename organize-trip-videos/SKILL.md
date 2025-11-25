---
name: Organize Trip Videos for YouTube
description: Organizes trip video files by date into numbered YouTube project folders with template structure for video editing workflow
---

# Organize Trip Videos for YouTube

This skill helps organize video files from trips into numbered YouTube project folders based on their modification dates, with each folder following a template structure ready for video editing.

## Workflow

When the user asks to organize trip videos or sort files by date, follow these steps:

### 1. Gather information
Ask the user for:
- **Source folder**: Path to folder containing the videos (e.g., "202508 Alaska")
- **Starting video number**: Sequential YouTube video number to start from (e.g., 70, 78)
- **Trip name**: Name for the folders (e.g., "Alaska")

### 2. Analyze the folder
- List all video files in the source directory
- Extract modification dates from the files
- Generate a date distribution summary showing:
  - Unique dates found
  - Number of files for each date
  - Date ranges
- Present the analysis to the user

### 3. Ask for date merging preferences
- Show the distribution of videos per date
- Ask if any dates should be combined into the same folder (e.g., days with few videos)
- Confirm the final number of folders to create
- Show proposed folder names: `[N] - [Trip Name]`, `[N+1] - [Trip Name]`, etc.

### 4. Sort videos into temporary folders
Once confirmed:
- Create temporary numbered folders (1, 2, 3, etc.) within the source directory
- Move files into the appropriate numbered folders based on their dates
- Use `find` command with `-newermt` for reliable date-based file selection
- Handle edge cases (special characters in filenames, etc.)

### 5. Create YouTube project folders
For each day's videos:
- Create folder with naming pattern: `[N] - [Trip Name]` (e.g., "70 - Alaska", "71 - Alaska")
- Copy template structure from: `/Users/yizhouyu/Desktop/YouTube Channel/[Capcut] new project template`
- Template structure includes:
  - `01 - Unedited/mp4/` (for source videos)
  - `02 - Export/` (for rendered videos)

### 6. Move videos to final locations
- Move videos from temporary folders to `[N] - [Trip Name]/01 - Unedited/mp4/`
- Verify each move completes successfully

### 7. Cleanup and verify
- Remove empty temporary numbered folders from source directory
- Count files in each project folder's mp4 directory
- Report the final organization with folder names and file counts

## Technical Implementation Notes

### Date analysis
Parse modification dates using `ls -l` output:
```bash
ls -l | awk '{print $6, $7}' | sort | uniq -c
```

### Temporary folder organization
Use the `find` command for reliable date-based file selection:
```bash
find . -maxdepth 1 -name "*.MP4" -newermt "YYYY-MM-DD" ! -newermt "YYYY-MM-DD" -exec mv {} folder/ \;
```

Create all temporary numbered folders upfront:
```bash
mkdir -p 1 2 3 4 5 ...
```

### YouTube project folder creation
Copy template structure for each project:
```bash
cp -r "/Users/yizhouyu/Desktop/YouTube Channel/[Capcut] new project template" "[N] - [Trip Name]"
```

Template structure:
```
[N] - [Trip Name]/
├── 01 - Unedited/
│   └── mp4/           (destination for videos)
└── 02 - Export/       (for rendered videos)
```

### Moving videos to final location
Move from temporary to project folders:
```bash
mv "source/1/"* "[N] - [Trip Name]/01 - Unedited/mp4/"
```

### Cleanup
Remove empty temporary folders:
```bash
rmdir source/1 source/2 source/3 ...
```

### Verification
Always verify the organization after completion:
- Count files in each project folder: `ls "[N] - Trip/01 - Unedited/mp4/" | wc -l`
- Verify temporary folders are removed
- Confirm all videos have been moved

## Example Usage

**User**: "Organize my Alaska trip videos for YouTube, starting at video 70"

**Response**:
1. Ask for source folder path (e.g., "202508 Alaska") and trip name (e.g., "Alaska")
2. Analyze the folder: "Found 364 videos from Aug 29 to Sep 6"
3. Show distribution:
   - Aug 29-30: 96 videos
   - Aug 31: 48 videos
   - Sep 1: 76 videos
   - Sep 2: 13 videos
   - Sep 3: 25 videos
   - Sep 4: 22 videos
   - Sep 5: 51 videos
   - Sep 6: 33 videos
4. Ask: "Want to combine Aug 29-30? Any other dates to merge?"
5. Create folders: "70 - Alaska" through "77 - Alaska"
6. Copy template structure to each folder
7. Move videos to respective `01 - Unedited/mp4/` folders
8. Report completion: "Created 8 YouTube project folders (70-77) with 364 videos organized"

## Important Notes
- **Sequential numbering**: Video numbers continue from user's last published video
- **Date merging**: Combine days with few videos to create better paced content
- **Template location**: `/Users/yizhouyu/Desktop/YouTube Channel/[Capcut] new project template`
- **Folder location**: Create project folders on Desktop alongside template
- **Cleanup**: Remove all temporary folders after organizing
- **Verification**: Always count and verify files moved correctly
