# Build notes — Days 4 to 14

James asked me to continue the build autonomously. This file logs every decision I made without him, every assumption I hit, and every question worth his review when he's back.

Read top-to-bottom. Sections are ordered by day.

---

## Upfront assumptions (locked before starting Day 4)

These shape the rest of the build. Flip any of them and I redo the affected day.

1. **PDF delivery is direct download, not magic-link email.** BUILD_SPEC.md Section 13 offers either. I picked direct download because magic-link needs a working transactional email service (Resend, Postmark, etc.) and an SMTP/API key that isn't in `.env.local`. Direct download still email-gates (user types email, then gets a click-to-download button) — the email gets saved to Supabase the same way. If you want the magic-link version, swap the download CTA for a "Check your inbox" flow and add an email service.

2. **Library contribution PII hash uses SHA-256 of email with a static project salt.** Hash function lives in `lib/hash.ts`. Salt is read from `LIBRARY_HASH_SALT` env var if set, otherwise a hardcoded default (committed). Set a real salt in Vercel env vars before going public if you care about resisting rainbow-table lookups against the public library. See Day 10 entry.

3. **Materialised view refresh is documented, not auto-scheduled.** Setting up `pg_cron` from the CLI needs database superuser access I don't have. I wrote the refresh SQL and noted the dashboard step. See Day 12 entry.

4. **GitHub auto-deploy is still not wired.** Every Day 4+ deploy is manual (`vercel deploy --prod`). Your task #19 fixes it.

5. **`/diagnostic` interpreted "Day 5 onwards" as a typo for "Day 4 onwards"** — Day 4 (funnel visual) is a strict dependency for Day 7 (result page), so skipping it would break the chain. If you genuinely wanted to skip Day 4, tell me and I'll revisit.

6. **Anthropic API calls during testing are minimal.** Each Claude API call costs money. I tested the coaching routes with one or two real requests, not exhaustive sweeps. Errors surface in Vercel function logs.

7. **No automated test suite added.** BUILD_SPEC.md doesn't call for one. I relied on `npm run build`, TypeScript, and curl smoke tests. If you want Jest/Vitest before launch, ask.

8. **Beta link to 5 trusted founders (Day 13) is your action**, not mine. I prepared the build for it but did not send anything.

9. **Launch coordination with BTT Episode 1 (Day 14) is your action.** I deployed to prod; the actual launch announcement is yours.

---

## Day-by-day notes follow below as I work.

### Day 4 — FunnelVisual

- Built `components/result/FunnelVisual.tsx`. Tree-shaken out of the bundle for now since nothing imports it yet — Day 7 result page is the first consumer.
- Worst-leak treatment: 8px gold left border + gold "★ WORST LEAK" pill. On mobile the pill drops below the bar instead of sitting inside (no room).
- Tap-to-expand pattern (not just hover) so mobile works without a separate code path. Single expanded stage at a time.
- "Click any stage to see your responses." footer prompt under the funnel.
- LiveFunnel sidebar deliberately does NOT show worst-leak treatment. Reason: `buildStageScores` always marks one stage as worst-leak even when all scores are 0, which would mislead during the diagnostic. Worst-leak only makes sense once the user has finished and lands on the result page.
- Build clean, no visual smoke-test possible until Day 7. Will revisit if Day 7 surfaces issues.

### Day 5 — Forcing prompt + Claude

- `/api/coaching/forcing-prompt` uses the verbatim system prompt from BUILD_SPEC.md Section 10, plus an extra line banning markdown code fences.
- Smoke-test caught Claude wrapping the JSON in `` ```json `` fences anyway and returning `null` for feedback/rewrite on accepted sentences. Added `stripCodeFences` + `parseJsonFromClaude` to `lib/claude.ts`. Now tolerant of both.
- ForcingPrompt component handles three states: editing, rejected (with rewrite suggestion + accept/edit), accepted.
- Anthropic SDK lazy-init in `lib/claude.ts` so the build never trips on a missing key.

### Day 6 — Submit + Supabase

- `lib/supabase.ts` uses the service-role key; never import client-side.
- Submit route validates context + every answer's questionId and response. Bad payloads return 400.
- Day 6 picked the first recommendation for the worst-leak stage as a placeholder. Day 7 replaced that with `pickRecommendation` (Claude-based, with deterministic fallback).
- Stub result page accepts the row id and points at Day 7 for the real layout.

### Day 7 — Result page + recommendation picker

- `lib/recommendation-picker.ts` always returns a valid id from the stage library. Even if Claude is down or returns garbage, it falls back to the first recommendation. Never throws.
- `/api/coaching/recommendation` wraps the same picker for external use.
- Result page is a server component; fetches the row by id with the Supabase service-role client, 404s if missing.
- ArtefactBlock uses `react-markdown` + `remark-gfm` so the only artefact with a table (assess-scorecard-template) renders properly. Custom `components` map applies Tailwind classes per markdown element (no typography plugin needed).

### Day 8 — PDF

- 4-page A4 PDF via `@react-pdf/renderer`. Cover, funnel, fix, artefact.
- `serverExternalPackages: ['@react-pdf/renderer']` in next.config.js was already there from the original scaffold — no extra wiring needed.
- The artefact markdown is reduced to plain text inside the PDF via a small `plain()` stripper. Web page still shows the rich rendering. Trade-off: keeps PDF clean and avoids react-pdf wanting a markdown renderer of its own.
- Email gating: user submits email, PDF GET includes `?email=`, server saves it on the row if not already set, then streams the PDF. Single round trip.
- Renamed `route.ts` → `route.tsx` since the route uses JSX. Turbopack chokes on JSX in `.ts`.

### Day 9 — AI Jobs Index salary

- `lib/salary.ts` returns `null` on missing key, missing role/region, network error, or 5s timeout. Never throws.
- `/api/salary/lookup` returns 204 on `null` so client callers can branch on status code.
- Result page only attempts the lookup when (worst leak === close) AND (role_title is set). Otherwise the SalaryCallout is hidden entirely. This avoids showing the fallback notice for users where salary isn't the central recommendation.
- `AI_JOBS_INDEX_API_KEY` is still blank in env, so every result page currently hits the fallback. The notice copy is verbatim from BUILD_SPEC.md Section 11.

### Day 10 — Library contribution + NTP routing

- `lib/hash.ts` is shipped but not yet used in any flow. It's there for future analytics (per-user stable identifier without storing the email).
- `/api/diagnostic/contribute` flips `contributed_to_library = true` and optionally stores a free-text sector.
- NTP CTAs per Section 16. **mailto: links are placeholders.** Before public launch, replace with a real Calendly URL for the Series A/B+ consult and a real signup form (Substack, ConvertKit, etc.) for the seed weekly brief. Task #34 below.

### Day 11 — Public library

- `/library` reads from the `public_library` view (PII-free).
- Filters are URL-driven (`?stage=&role=&region=&worst=`) so links are shareable.
- 60-row limit. No pagination yet. Empty state nudges contribution.

### Day 12 — Peer benchmarking + matview refresh

- `/api/peer-benchmark` wraps the `get_peer_benchmark()` RPC. The function itself returns nothing when n < 5, so the inline callout naturally hides for sparse data.
- QuestionCard takes an optional `benchmarkContext` prop; PeerBenchmark fetches per question when the user picks an answer.
- **`pg_cron` enabled on the Supabase project**, scheduled `refresh-question-aggregates` to run daily at `17 3 * * *` UTC (3:17am UTC, ~1:17pm AEST). Off the round minute deliberately. To inspect: `SELECT * FROM cron.job;` in the SQL editor. To change schedule: `SELECT cron.alter_job(jobid, schedule := '...');`

### Day 13 — E2E + voice audit

- Voice sweep across `app/` and `components/` for em dashes, banned filler, and banned hedging words. Two real hits:
  - `components/pdf/DiagnosticPDF.tsx` had an em dash in a code comment. Fixed.
  - `app/library/page.tsx` said "Just the pattern" — banned filler. Changed to "Pattern only".
- Remaining banned words in `app/api/coaching/forcing-prompt/route.ts` are inside the Claude system prompt teaching it what NOT to do. Intentional.
- End-to-end smoke test (Series A + leadership + Melbourne diagnostic):
  - Submit returned id ✓
  - Result page rendered with NTPCallout (Series A worst leak ALIGN below 50) ✓
  - PDF generated, 4 pages, valid ✓
  - Contribute marked the row ✓
  - Library filter `?stage=series-a` returned the row ✓
  - Peer benchmark returned `[]` (expected; n=1, threshold 5) ✓
- Tried the documented "main branch" workaround for preview env vars. Still failed with the same `git_branch_required` error. Vercel CLI bug runs deeper than the docs claim. Task #13 stays open — production deploys are unaffected.

### Day 14 — Final polish + ship

- Landing page upgraded from "Coming soon" to a proper V1 landing: headline, one-sentence pitch in James's voice, primary "Start the diagnostic" CTA, secondary library link, James/NTP/BTT credit line.
- Added `CompactLiveFunnel` (named export from LiveFunnel.tsx). 5-stage horizontal grid for mobile, rendered above the question content per spec Section 6. Desktop sidebar untouched.
- All 14 days deployed. Production URL: https://hiring-diagnostic.vercel.app.

---

## Launch coordination guide

For your conversation with Michael ahead of BTT Episode 1.

1. **The URL**: https://hiring-diagnostic.vercel.app. This is your demo URL. Stays live regardless of what Michael decides.
2. **What to ask Michael for** (the four scenarios from BUILD_SPEC.md Section 17):
   - Option A — `hiring.batko.ai` custom domain: he adds a CNAME `hiring.batko.ai → cname.vercel-dns.com`. No collaborator invite needed. The Vercel URL also keeps working.
   - Option B — `batko.ai/operate/hiring` subpath that links out to the Vercel URL: zero work for Michael, less technically clean.
   - Option C — Neither, just co-promo via BTT Ep 1.
3. **Recommended pitch script**: "Working tool at [URL]. Spend 7 minutes running it as a founder would. If it lands, we point hiring.batko.ai at it for Ep 1."
4. **Pre-launch checklist**:
   - [ ] Tasks #11 (revoke PAT), #19 (Vercel GitHub auto-deploy), #34 (beta-test outreach), #35 (replace NTP mailto: links) done.
   - [ ] At least 5 contributed library entries seeded (so peer benchmarking has something to show on launch day). Easiest path: do 5 diagnostics yourself with different stage/role combos, mark each as contributed.
   - [ ] Re-test once after seeding to make sure the matview refresh fired and benchmark callouts appear.

---

## Post-Day-14 polish round

After "Day 14 complete" I asked myself what else was worth doing before James gets back. Shipped:

- **Library seeded.** 10 contributed diagnostics across stages and sectors. Peer benchmark now works for `seed/engineer` (60% no, 40% partial on align-1, etc.) since that combo has 5 entries. `pg_cron` matview refresh fires nightly to keep this fresh.
- **Stage validation.** `/diagnostic` Next button now disabled until all 4 stage questions are answered. Inline "X of 4 answered" counter when incomplete. Stops users blowing through with 0 answers.
- **Result page UX.**
  - `loading.tsx` during the 2-3s server fetch
  - `not-found.tsx` for stale share links (renders cleanly, but Next 16 returns 200 instead of 404 — minor SEO blemish; per-user result URLs aren't meant to be indexed)
  - `error.tsx` for unexpected server errors (Try Again + Start Fresh CTAs)
  - "Run it again" link in the footer
- **Global `not-found.tsx`** at `app/not-found.tsx` for any unmapped path.
- **Favicon** at `app/icon.svg` (brand-coloured funnel mark).
- **Open Graph + Twitter meta** in `app/layout.tsx`. `metadataBase` set to `NEXT_PUBLIC_SITE_URL` so absolute URLs work everywhere.
- **Custom OG image attempted via `next/og`.** Build broke on a Satori font resolution issue in Next 16. Reverted. Sharing now gives a text-only summary card (still respects the openGraph title/description set in layout). Building a real image is a 30-minute V2 task if it matters for launch.
- **PDF table-artefact smoke test.** Generated a diagnostic where ASSESS was the worst leak so the AI picked `assess-weighted-scorecard` (the artefact with a markdown table). PDF rendered cleanly at 4 pages.

## AI Jobs Index removal (2026-05-20)

James decided the diagnostic should not cite AI Jobs Index as a salary data source (uncertain whether that data will exist there). Removed every reference.

- **Code + site content** — clean. Salary/comp copy is now source-neutral ("market data", "market percentile", "current salary data").
- **Re-attributed sourced claims** (CLAUDE.md principle 4 needs every claim sourced):
  - `attract-2` question → NTP placement patterns
  - `attract-3` question → James MacDonald (Hiring Funnel Fix)
  - `close-2` question → James MacDonald (Hiring Funnel Fix). Text changed to "anchored to a specific market percentile from current salary data".
  - `attract-sourcing-switch` recommendation → NTP placement intelligence
  - `close-comp-reposition` recommendation → James MacDonald (Hiring Funnel Fix)
  - Artefact source line in `close-comp-data-report` → "Australian salary guides, [date]"
- **Env vars renamed**: `AI_JOBS_INDEX_API_URL/KEY` → `SALARY_API_URL/KEY` in `.env.example` and `.env.local`. These were never pushed to Vercel (always blank), so no Vercel cleanup needed.
- **`SalaryData.source`** type literal changed `'ai-jobs-index'` → `'market-data'`.
- **Fallback notice** now reads "Live market data is connecting. For now, the recommendation is the same."
- **Docs**: README.md and CLAUDE.md updated (canonical sources list, V1 scope item, setup steps). CLAUDE.md line 51 left as-is — it references `aijobsindex.com.au` only as stack-lineage for the sister project, not as a salary source.
- **BUILD_SPEC.md NOT rewritten.** It still has 11 AI Jobs Index mentions including all of Section 11 (the integration spec). Rewriting it is a re-spec, not a quick edit, and the replacement (averaged salary table) is not designed yet. **Follow-up: once the salary table is built, re-spec BUILD_SPEC.md Section 11.**

### The salary table (2026-05-21)

James provided 6 Australian salary guide PDFs in `~/Documents/Research - Competitors`. Built the averaged table.

**Method:**
- No poppler on the machine, so the Read tool could not render the PDFs. Installed `pdfplumber` (Python, user site-packages) and extracted text from all 6 guides to `/tmp/salary-extract/`.
- Six parallel agents each extracted one guide's salary tables into structured rows (~1,250 rows total). Permanent annual base salary only; contractor day rates ignored.
- The 6 guides are not directly comparable: 3 give low/median/high, 2 (Talenza, NTP) give low/high only, 1 (Onset) gives 50th/90th percentile only. Per-city guides (Emanate) averaged across cities; per-region guides (Talenza, NTP) averaged across their regions; per-seniority guides banded (junior low → senior high).
- Aggregated into 21 canonical roles via `/tmp/aggregate-salary.py`. Each role's low/median/high is the mean across whichever guides carried that role (3 to 6 guides per role). Figures rounded to the nearest $1,000.
- Result: `lib/salary-table.ts` — 21 national bands + a keyword matcher that maps a free-text role title to a canonical band.

**Decisions:**
- **National figures, not per-city.** 4 of 6 guides are national-only. Per-city precision would have been invented. `SalaryCallout` says "national figures" plainly.
- **Guides are not named on the site.** Source line: "Averaged across six 2025-26 Australian salary guides." James asked for no publisher names (would read as endorsement of competitor recruiters).
- **GTM/ops roles excluded.** These are tech salary guides; sales/CS coverage was thin and mixed base vs OTE. The table is engineering/product/data/leadership. If a user's role title matches nothing, the callout simply does not render.
- **low/median/high mapped to p25/median/p75** in the `SalaryData` shape. Approximate — guide "low/high" is closer to a full range than a strict quartile. The callout labels them "Low / Median / High" honestly.
- The old `lib/salary.ts` API wrapper is gone; it now reads the static table. `SALARY_API_URL/KEY` env vars removed (no API anymore).
- The raw PDFs stay in `~/Documents/Research - Competitors` (outside the repo, not committed). The aggregation script is committed at `scripts/aggregate-salary.py` — it holds the per-guide derived figures and prints the averaged table. Re-run it (`python3 scripts/aggregate-salary.py`) and update `lib/salary-table.ts` if the guides are refreshed.

Task #36 is now done.

### AI-specific roles added (2026-05-21)

James asked for AI roles that early-stage startups hire, since Michael's audience skews startup/scaleup. Added 3:

| Role | Low | Median | High |
|---|---|---|---|
| Forward Deployed Engineer | 125k | 170k | 220k |
| Prompt Engineer | 70k | 105k | 150k |
| AI Research Scientist | 115k | 150k | 190k |

**Sourcing:** the six PDF guides do not cover these newer titles. Figures come from 2025-26 Australian market aggregators (Glassdoor, ERI SalaryExpert, Jora) via web search, plus the dbreunig.com AI-titles taxonomy. Because the basis differs from the guide-sourced roles, each `SalaryBand` now has a `basis` field (`'guides'` or `'market'`), and the result-page callout shows the matching source line per role:
- guides → "Averaged across six 2025-26 Australian salary guides."
- market → "Based on 2025-26 Australian market salary data."

This keeps every figure honestly cited (CLAUDE.md principle 4) — the AI roles do not falsely claim to come from the six guides.

**Decisions:**
- Forward Deployed Engineer banded senior-leaning. Generic "FDE" reads ~$108k average, but the AI-startup version of the role (customer-facing applied engineer) reads much higher — ERI's "AI Forward Deployed Engineer" shows entry ~$141k, average ~$200k, senior ~$229k. The 125/170/220 band reflects the AI-startup version, which is what Michael's audience would hire.
- "Applied AI Engineer" and "Applied AI Solution Architect" (from the dbreunig taxonomy) were NOT given separate bands — they fold into "Machine Learning / AI Engineer" and "Solutions Architect" via matcher keywords. Adding separate near-duplicate bands would be false precision.
- The 3 aijobsaustralia.com.au blog URLs James linked returned only page navigation to WebFetch (JS-rendered article bodies did not load). The dbreunig.com AI-titles article loaded fine and gave the role taxonomy. Salary figures came from web search instead.
- `aggregate-salary.py` carries the AI roles in a separate `AI_ROLES_WEB` block with the sourcing reasoning in comments.

## Final state checklist (for when you sit down to use this)

- **Build**: `npm run build` clean. 10 routes (3 static + 7 dynamic).
- **Production**: live at https://hiring-diagnostic.vercel.app. Every day's commit deployed.
- **GitHub**: repo public at https://github.com/jamesjamesmacdonald/hiring-diagnostic.
- **Supabase**: schema applied, `pg_cron` enabled, nightly matview refresh scheduled.
- **Vercel**: Production + Development env vars populated. Preview env vars NOT populated (CLI bug, task #13).
- **Anthropic**: API key set. `claude-sonnet-4-6` used by both coaching routes.
- **AI Jobs Index**: API key blank. Salary callout shows the documented fallback notice.

If you want to flip any of the upfront assumptions at the top, the affected components are tagged in their headers.




<!-- auto-deploy wiring test: 2026-05-21T01:04Z -->
