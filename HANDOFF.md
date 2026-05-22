# Handoff — The Hiring Funnel Diagnostic

A self-contained brief for anyone (or any agent) picking this project up.

## What it is

A 7-minute web tool that scores a founder's hiring process across five stages
(ALIGN, ATTRACT, ASSESS, CLOSE, ONBOARD), surfaces their worst leak, and gives
a copy-paste fix plus a PDF report. Co-launches with Building Tech Teams
Episode 1. Framed as a partnership between Michael Batko (Hourglass AI) and
James MacDonald (Building Tech Teams, NTP Talent).

## Where it lives

- **Local:** `/Users/jamesmacdonald/Documents/Claude/hiring-diagnostic`
- **Repo:** github.com/jamesjamesmacdonald/hiring-diagnostic (public)
- **Live:** https://hiring-diagnostic.vercel.app
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind, Supabase,
  Anthropic API (model `claude-sonnet-4-6`), `@react-pdf/renderer`, Vercel.
- **Deploy:** GitHub auto-deploy is wired. Push to `main` and Vercel deploys.
  No manual deploy needed.

## Status

**Complete.** James considers it done and is putting it in front of Michael
Batko. Everything below is built, deployed, and verified live.

## What is built

- 20-question diagnostic flow (`/diagnostic`): context picker, five stage
  screens, forcing-prompt final step. Live funnel sidebar. Mobile-responsive.
- Forcing prompt: a Claude API route checks the user's success-criteria
  sentence and offers a rewrite if it hedges.
- Result page (`/diagnostic/result/[id]`): funnel visual, worst-leak fix
  (free), then the other four stages behind one email gate ("Explore the
  advice for your other leaks"), each expandable. The worst-leak
  recommendation is Claude-picked; the other four use a deterministic picker.
- 8-page full-report PDF (`/api/pdf/[id]`) covering all five stages.
- Salary benchmark: `lib/salary-table.ts`, 24 roles (including AI roles like
  Forward Deployed Engineer and Prompt Engineer), averaged from six
  Australian salary guides plus market data. Shown on the result page for
  CLOSE-leak roles.
- Public library (`/library`) with filters, peer benchmarking, and a
  contribution flow. Supabase-backed.
- Conditional CTAs: NTP consult (Calendly) for Series A/B+, Building Tech
  Teams newsletter (Substack) for seed.

## Content model — important

`lib/questions.ts`, `lib/recommendations.ts`, `lib/artefacts.ts`, and
`lib/salary-table.ts` are the source of truth for all content. They are
treated as **locked** — do not edit questions, recommendations, or artefacts
without flagging James first. Recommendation IDs are stable even when their
text was rewritten, so existing database rows never break.

## Voice rules — non-negotiable

No em dashes, ever. Active voice. No hedging or filler words (just, really,
very, genuinely, honestly, actually, basically, literally). Short sentences.
Run every user-facing string past these before committing. Full list is in
`CLAUDE.md`.

## Open items — none are blockers

- Vercel preview-environment env vars are unset. Only matters if you use
  branch-preview deploys. Production is unaffected.
- Around 16 test/seed rows sit in the public library from the build. Harmless,
  but could be cleared for a clean launch.
- Source citations are deliberately un-numbered ("Michael Batko's hiring
  principles", not "principle 5") because the numbers could not be verified
  against the original material. They can be re-numbered if verified with
  Michael.

## Constraints on Claude

No direct database access — the Supabase admin token was revoked. Any schema
or DDL change needs James to run SQL in the Supabase SQL editor, or a fresh
personal access token. The app's service-role key only does row read and
write, not DDL.

## Read first

- **`NOTES.md`** (repo root) — every build decision and its rationale, day by
  day.
- **`CLAUDE.md`** (repo root) — project spec, voice rules, locked decisions.
- **`BUILD_SPEC.md`** — full architecture. Note: its Section 11 still
  describes an "AI Jobs Index" salary integration that was removed and
  replaced by the static salary table. That section is stale; the rest is
  current.
