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


