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


