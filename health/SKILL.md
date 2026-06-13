---
name: health
description: Analyze Yizhou's Oura health data — weekly sentinel reports, deep analyses (weekday strain, bedtime, travel recovery, period comparison), and anomaly interpretation. Use when he asks about his 身体/健康/睡眠/HRV/Oura data or says /health.
---

# Health — Oura data analysis

## Infrastructure (all already set up, 2026-06-12)

- **Auth**: OAuth tokens at `~/.config/oura/tokens.json` (auto-refreshed by pull.py; credentials in `~/.config/oura/credentials`, both 600)
- **Weekly sentinel**: `~/.config/oura/pull.py` runs via launchd every Monday 9am → writes report (+ ALERT lines) to ai_context `inbox/` → digested by /capture. Deterministic thresholds: RHR-contributor <60 ×2 days, temp dev ≥+0.3 ×2 days, sleep <70 ×3 days
- **Deep analysis**: `python3 ~/.config/oura/analyze.py [days_back]` — weekday strain, prev-day-steps vs readiness, bedtime-vs-duration slope, monthly trends
- **Ad-hoc API**: `GET https://api.ouraring.com/v2/usercollection/{daily_readiness|daily_sleep|daily_activity|sleep|...}?start_date=&end_date=` with `Authorization: Bearer $(jq -r .access_token ~/.config/oura/tokens.json)`. If 401, run the refresh inside pull.py first

## Interpretation rules

- **Compare him only to his own baselines** (see ai_context `health.md`): nightly lowest HR ~51 (46–58), HRV ~57ms (37–79), sleep 7.3h, deep ~103min
- Established findings (don't rediscover): step spikes are harmless; weekday strain is mild (Mon-peak/Fri-trough); +1h bedtime ≈ −18min sleep but pre-00:30 nights gain ~48min; travel recovery 1–2 days; SF June > NYC spring on HRV (45→55)
- HRV moves before RHR; temp deviation ≥+0.3 suggests illness, normal temp + high RHR suggests strain/stress/alcohol
- Findings go to `health.md` (+ one line in `log.md`); calibration questions to Yizhou when an anomaly lacks explanation
- Planned: swimming experiment from July (MiMA pool) — pre-July data is the baseline; 12-week verdict on the $250/mo membership

## Cadence

- Weekly: automatic (sentinel)
- Monthly-ish or on demand: run analyze.py and update health.md trends
- Don't preach: he vetoed solo-walk suggestions; swimming is his chosen anchor
