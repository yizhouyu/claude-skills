---
name: credit-karma
description: Clean up and analyze Yizhou's Credit Karma transactions — fix mis-categorized transactions in bulk, spending breakdowns by month/category, travel totals, net-worth/FIRE spend baselines. Use when he says 整理 Credit Karma / CK 分类 / 看看我的 transactions / spending breakdown / 我每年花多少, or mentions creditkarma.com.
---

# Credit Karma — categorize and analyze

He uses Credit Karma (CK) to see net worth and month-over-month spending by category. Categories only help if they are consistent, so the main job is: find transactions whose category breaks his rules, fix them **in CK itself**, then answer the spending question.

## Read first (his data and rules live in ai_context, not here)

- `~/ai_context/finance/categories.md` — **his categorization rules**, recurring CK bugs, joint-account and bonus notes, category ids. This is the source of truth; when he states a new rule, update it there.
- `~/ai_context/finances.md` — section "CK category cleanup" + spend baseline / FIRE numbers, and the "Open finance threads" list.
- Both are git-crypt encrypted on GitHub; reading/writing locally is normal. Follow ai_context README conventions (lock `/tmp/ai-context-agent.lock`, `Last updated` stamp, one line in `log.md`, backup per `BACKUP.md`).

## Done means

- Every transaction in the requested range was checked against `categories.md`; fixes were applied in CK and **verified by refetching** (`run.sh apply` prints `server mismatches: 0`).
- He got a short summary: what changed (grouped, with counts and the big amounts), what you left alone, and the 1–3 questions only he can answer.
- New rules he stated are written into `categories.md`; new findings (spend totals, anomalies) go into `finances.md` + `log.md`.

## Tools

`scripts/run.sh` runs inside his logged-in **ego browser** (read the `ego-browser` skill first). It talks to CK's own GraphQL API (`api.creditkarma.com/graphql`, persisted queries) with the session the page itself uses — no third party, no stored credentials.

- `echo '{"since":"YYYY-MM-DD"}' > ~/.cache/credit-karma/job.json && bash ~/.claude/skills/credit-karma/scripts/run.sh fetch` → `~/.cache/credit-karma/tx.json` (all accounts, newest first, back to `since`; CK keeps ~2 years) and `categories.json`.
- Write `[{"id": "<transaction id>", "cid": "<category id>"}]` to `~/.cache/credit-karma/plan.json`, then `run.sh apply` → edits each, refetches, reports failures and mismatches.
- Raw transaction dumps stay in `~/.cache/credit-karma/` (local only). Don't copy raw transactions into ai_context; summaries only.

Each transaction has `date`, `description`, `amount.value` (negative = spend), `account.{providerName,accountTypeAndNumberDisplay}`, `category.{id,name}`, `merchant.name`.

## Method that worked (2026-11-12)

- Learn his conventions from history before judging: group his older (hand-reviewed) transactions by merchant/description and compare the new ones against his majority choice. Inconsistency with his own past tagging is the strongest signal.
- Look hardest at money moving between his own accounts (Transfer vs Income), refunds/credits, and AI subscriptions — that is where CK's auto-tagging fails.
- Spend analysis: exclude Transfer, Income, Taxes, Savings and investments; net refunds inside their category; call out one-offs (jewelry, moves) separately; rent counts at his 50% share.
- When unsure what a merchant is, web-search it (location decides travel vs home) rather than guess; when only he can know (what a Venmo was for, a gift vs a purchase), ask.

## Traps (real, from 2026-11-12)

- **Session expires often.** `run.sh` detects it, opens the login page and hands the space to him (`NEED_LOGIN`). Ask him to log in, then rerun — never try to log in yourself.
- **Persisted-query hashes can change** when CK ships a new web build: you'll see `HASH_CHANGED` (handled for reads) or `PersistedQueryNotFound` on edits. Recapture `editCategory` by editing one transaction by hand in the UI with `Network.enable` on and reading `page.events()`, then update `HASH` in `scripts/_session.mjs`.
- **"Investments" (170), "Loans", "Uncategorized" are not selectable** — editCategory returns a resolver error. Use "Savings and investments" (178).
- **The web UI caches** — after edits the pages look stale until a hard reload (Cmd+R). Trust the refetch, not the screen.
- **Not everything is in CK:** several linked cards may be disconnected (check the "accounts need attention" banner and say so — only he can re-auth); RSUs live at Schwab; work-trip flights and (since H2 2026) work-trip spend are on the corporate card.
- He changes his mind on rules (e.g. trip meals → Travel, then back to Food & dining the same day). Keep every plan you apply (`plan.json` copies) so a rule change can be reverted exactly to each transaction's original category.
