---
name: Organize Trip Videos for YouTube
description: Organizes trip video files by date into numbered YouTube project folders with template structure for video editing workflow
---

# Organize Trip Videos for YouTube

Split a trip's raw GoPro footage into numbered vlog project folders — one folder = one future video — each built from the youtube-manager template, with the raw clips in `01 - Unedited/`. No editing, just sorting.

## Workflow

### 1. Infer what you can before asking
- **Source folder**: usually `~/Desktop/YYYYMM <Trip>`.
- **Next video number**: `ls ~/Desktop | grep -E '^[0-9]+ - '` and take max + 1. The user may name the last video they *edited* while a later unedited `NN - …` folder already exists — existing folders win; start after the highest one.
- **Itinerary**: the user may link trip-planning pages (e.g. Notion). Read them via Claude in Chrome (`get_page_text`). Day details are often in **collapsed toggles** (expand them before reading) or in a **linked Google Doc** (read it with the Google Drive connector `read_file_content`). The itinerary is what gives each folder its place name.
- **Destination**: follow the user. Either on the Desktop or *inside* the source folder — ask if unclear.

### 2. Get real shoot times from metadata, not mtime
File mtime drifts (copy time, timezone display). Use the GoPro `creation_time` tag plus duration:
```bash
for f in *.MP4; do echo -e "$f\t$(ffprobe -v error -show_entries format_tags=creation_time:format=duration -of default=nw=1:nk=0 "$f" | tr '\n' ' ')"; done > meta.tsv
```
- GoPro writes the **camera's wall clock** labelled `Z` — it is not UTC. The camera often stays on home time while traveling.
- Calibrate: match the first/last clip of a day against the itinerary (e.g. camera shows 19:30 for a stop planned at 5:30pm local ⇒ camera is local + 2h). Then check whether any shooting session crosses local midnight.
- **The camera clock can be wrong.** If the GoPro wasn't initialized (not paired / battery died), it falls back to a default GoPro date (e.g. years off, or dates outside the trip). mtime comes from the same camera clock, so it doesn't help. Always sanity-check before trusting times:
  - every `creation_time` falls within the trip's date range;
  - sorted by file number (`GXccnnnn`: sort by `nnnn`, then chapter `cc`), times never go backwards — a backward jump marks a clock reset.
  - If either check fails for some clips, trust **file-number order** instead: those clips sit between their good-timestamp neighbours. Place them by sequence, and use gaps in their own (internally consistent) timestamps to find day breaks. Confirm with frame grabs (`ffmpeg -ss 1 -frames:v 1`) against the itinerary (landmarks, day/night). Tell the user which clips were placed this way.
- Group clips into sessions by gaps > 3h and print per-session start/end, clip count, total minutes, first/last filename. This is the distribution to reason over.

### 3. Decide the grouping
- Default: one local day = one video, named after that day's main highlight from the itinerary (e.g. `12 - Glacier Hike`, `13 - Old Town`), not a generic `NN - Trip`.
- Merge tiny days (≲10 clips / ≲3 min raw) into the adjacent day at the same location — e.g. an arrival evening into the next day, a travel day into the following day.
- Clips shot after local midnight belong to the previous day.
- Sorting is reversible, so decide and report rather than asking — list the mapping (dates → folder, clip count, raw minutes) in the final report so they can ask for merges.

### 4. Create folders and move
Create each project with the template script (never hand-roll the structure):
```bash
~/Desktop/youtube-manager/scripts/new_project.sh "NN - Place" "<parent dir>"
```
Result:
```
NN - Place/
├── 01 - Unedited/        ← raw clips go directly here (no mp4/ subfolder)
└── 02 - Export/
    ├── thumbnail/
    └── edit/ (README.md, glossary.json, asr_context.txt, music/, sfx/, scripts/)
```
Do the move in one Python script driven by `meta.tsv` and an explicit `{date: folder}` map — no temp numbered folders, no `find -newermt` (mtime-based and timezone-fragile).

### 5. Verify
- Per folder: clips in `01 - Unedited/` equal the planned count; totals equal the source count.
- No `.MP4` left loose in the source folder.
- Report: folder name, dates covered, clip count, raw minutes.
