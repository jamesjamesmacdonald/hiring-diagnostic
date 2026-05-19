# BUILD_SPEC.md — The Hiring Funnel Diagnostic

Full architecture, UX spec, and 14-day build plan. The source of truth for every decision in this project. When something here conflicts with what Claude is generating, this document wins.

Voice rules and tech stack live in `CLAUDE.md`. This document covers everything else.

---

## 1. What gets built in V1

Twelve features. All ship in 14 days.

1. Landing page at `/` with one-paragraph intro and CTA.
2. Diagnostic flow at `/diagnostic`: 20 questions across 5 stages, 7 minutes end-to-end.
3. Stage / role / region context picker as Step 1 of the flow.
4. Live funnel visual updating as the user answers each question.
5. Forcing-prompt step with AI rewrite if hedging detected.
6. Result page at `/diagnostic/result/[id]` with the funnel, the worst-leak diagnosis, and the fix artefact.
7. Copy-to-clipboard for the fix artefact.
8. Personalised PDF download (email-gated).
9. Library contribution flow (unlocks peer benchmarking and library search).
10. Public library page at `/library` with filters by stage, role, region.
11. AI Jobs Index salary data wired into CLOSE stage.
12. Live peer benchmarking inline during the diagnostic ("X% of [stage] founders also answered [response] to this").

---

## 2. V2 backlog (not built in this kit)

Built only if Michael wants to keep going after seeing V1, or if the founder uses the tool enough solo to justify the work.

1. Re-run with time-series tracking (Supabase auth + saved diagnostics).
2. Co-founder / team mode (multi-user diagnostic, disagreement map).
3. AI coaching email sequence (14-day program, day 3/7/10/14 nudges).
4. Viral share card (auto-generated social image, anonymised).
5. NTP calendar booking integration (high-urgency scale-up users see a Book CTA).
6. Library entry deep-dive pages.
7. Quarterly Hiring Funnel Report (aggregate library data, PDF download, co-bylined Michael + James).

---

## 3. Tech stack and dependencies

Locked. See `CLAUDE.md` for the locked decisions.

Already installed via `package.json`:
- `next` 16 (App Router)
- `react` 19
- `@anthropic-ai/sdk` for the coaching layer
- `@supabase/supabase-js` and `@supabase/ssr` for DB and auth
- `@react-pdf/renderer` for PDF generation
- `tailwindcss` for styling
- `react-markdown` for rendering artefact content
- `zustand` for diagnostic-flow state (kept if React state is insufficient)
- `clsx` + `tailwind-merge` for className composition

**Next.js 16 breaking changes to watch:**
- `cookies()` and `headers()` are now async. Always `await` them in server components and API routes.
- Caching defaults have changed in App Router. Be explicit with `cache` and `revalidate` options.
- React 19 ships with this version. Use the new hooks (`use`, `useActionState`) where they fit. Server actions remain the recommended mutation pattern.
- If a third-party package (`@react-pdf/renderer`, `react-markdown`) breaks with React 19, pin to a compatible alpha or flag before installing.

Stack chosen for consistency with `aijobsindex.com.au` and to match what Michael Batko works with on Founder OS.

---

## 4. Source material

Every question, every recommendation, every piece of AI coaching traces to one of these sources. See `/lib/questions.ts` and `/lib/recommendations.ts` for the per-item citations.

| Source | What it contributes |
|---|---|
| BTT Episode 1 (Michael Batko × James MacDonald) | First-hire flip thesis, attitude over skill, AI-era benefits framing, experience as moat |
| Michael Batko's 7 published posts on batko.ai and Substack | First-hire timing, all-rounders, slope-not-y-intercept, three-question reference framework, 90-day onboarding arc, Builder's Trap, async/sync principles |
| Michael Batko's 10 hiring principles | The non-negotiable views the Diagnostic must respect |
| James MacDonald's Hiring Funnel Fix (8-chapter playbook) | ALIGN Framework, 5 Questions Framework, Interview Scorecard, pre-close prompt, 30-day Onboarding Playbook |
| AI Jobs Index (NTP-owned scraping pipeline) | Live salary, displacement, and creation data feeding the CLOSE stage |
| NTP placement intelligence | Counter-offer patterns, sourcing channel data, role placement signals |

---

## 5. File structure

```
hiring-diagnostic/
├── CLAUDE.md                              # Persistent context (auto-loaded)
├── README.md                              # Human-readable intro
├── FIRST_PROMPT.md                        # Day 1 kickoff prompt
├── BUILD_SPEC.md                          # This file
├── package.json
├── .env.example
├── .gitignore
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── lib/
│   ├── types.ts                           # All TypeScript types (DONE, do not edit)
│   ├── questions.ts                       # The 20 questions (DONE, do not edit without flagging)
│   ├── recommendations.ts                 # The 10 recommendations (DONE, do not edit without flagging)
│   ├── artefacts.ts                       # The 10 fix artefacts (DONE, do not edit without flagging)
│   ├── scoring.ts                         # Scoring math (DONE, do not edit)
│   ├── claude.ts                          # TO BUILD: Anthropic API wrapper
│   ├── salary.ts                          # TO BUILD: AI Jobs Index API wrapper
│   └── supabase.ts                        # TO BUILD: Supabase client setup
├── supabase/
│   └── schema.sql                         # Database schema (apply via Supabase SQL editor)
├── app/
│   ├── layout.tsx                         # TO BUILD: Root layout with fonts, Tailwind
│   ├── globals.css                        # TO BUILD: Tailwind base
│   ├── page.tsx                           # TO BUILD: Landing page
│   ├── diagnostic/
│   │   ├── page.tsx                       # TO BUILD: The 20-question flow
│   │   └── result/[id]/page.tsx           # TO BUILD: Result page
│   ├── library/
│   │   └── page.tsx                       # TO BUILD: Public library
│   └── api/
│       ├── diagnostic/
│       │   ├── submit/route.ts            # TO BUILD: Save to Supabase
│       │   └── contribute/route.ts        # TO BUILD: Mark as library contribution
│       ├── coaching/
│       │   ├── forcing-prompt/route.ts    # TO BUILD: Claude API, hedging check
│       │   └── recommendation/route.ts    # TO BUILD: Claude API, recommendation match
│       ├── salary/lookup/route.ts         # TO BUILD: AI Jobs Index passthrough
│       └── pdf/[id]/route.ts              # TO BUILD: PDF generator
└── components/
    ├── diagnostic/
    │   ├── StageContext.tsx               # TO BUILD: Step 1 picker
    │   ├── QuestionCard.tsx               # TO BUILD: Single question UI
    │   ├── LiveFunnel.tsx                 # TO BUILD: Sidebar funnel (updates live)
    │   ├── ForcingPrompt.tsx              # TO BUILD: Final step textarea + AI rewrite
    │   └── PeerBenchmark.tsx              # TO BUILD: Inline peer % callout
    ├── result/
    │   ├── FunnelVisual.tsx               # TO BUILD: Final funnel visual
    │   ├── Recommendation.tsx             # TO BUILD: Worst-leak fix display
    │   ├── ArtefactBlock.tsx              # TO BUILD: Copy-paste markdown block
    │   ├── PDFDownload.tsx                # TO BUILD: Email capture + PDF download
    │   └── LibraryUnlock.tsx              # TO BUILD: Contribute CTA
    ├── library/
    │   ├── LibraryFilters.tsx             # TO BUILD: Filter controls
    │   └── LibraryEntry.tsx               # TO BUILD: Single entry card
    └── shared/
        ├── Header.tsx                     # TO BUILD: BTT + Batko OS branding
        └── Footer.tsx                     # TO BUILD: Links + credits
```

---

## 6. The diagnostic flow

### Step 1: Context picker

Single screen. Three required dropdowns plus one optional text field.

```
What stage is your company?
  [Pre-seed] [Seed] [Series A] [Series B+]

What role type is this hire?
  [Engineer] [GTM] [Ops] [Leadership] [Other]

Where is the hire based?
  [Sydney] [Melbourne] [Brisbane] [Other AU]

(Optional) Role title:
  [Senior Backend Engineer]    <- enables live salary data in CLOSE
```

Submit advances to Step 2.

### Steps 2-6: The five stages

One screen per stage. Same structure each time.

```
+--------------------------------------------+
| EYEBROW: STAGE 2 OF 5                      |
| HEADER: ATTRACT                            |
| SUB: Are the right people seeing this role?|
+--------------------------------------------+
|                                            |
| Question 1: [text]                         |
| ( ) No   ( ) Partial   ( ) Mostly   (•) Yes|
| Source: [source citation]                  |
| PEER: "67% of seed-stage founders also     |
| answered No here."  <- appears on click    |
|                                            |
| Question 2: [text]                         |
| ...                                        |
| Question 3: ...                            |
| Question 4: ...                            |
|                                            |
|                          [Next Stage →]    |
+--------------------------------------------+
```

Live funnel updates in a right-side sidebar (desktop) or collapses to top of screen (mobile).

### Step 7: Forcing prompt

Single textarea. AI checks the user's input.

```
+--------------------------------------------+
| FINAL STEP                                 |
| Write one sentence in this form:           |
|                                            |
| "I will know this hire worked when         |
|  [outcome] by [date], because [evidence]." |
|                                            |
| [textarea]                                 |
|                                            |
|                                  [Submit]  |
+--------------------------------------------+
```

On submit, the input goes to `/api/coaching/forcing-prompt`. If accepted, advances. If not, shows the AI rewrite suggestion and asks the user to accept or edit.

### Step 8: Submission

Brief loading state (2-3 seconds). Calls `/api/diagnostic/submit` which:
1. Saves the diagnostic to Supabase.
2. Pattern-matches the worst-leak answers via `/api/coaching/recommendation` to select a recommendation ID.
3. Returns the diagnostic ID.
4. Client redirects to `/diagnostic/result/[id]`.

---

## 7. The result page

Single page, mobile-responsive. Layout:

```
+----------------------------------------------------+
|  THE HIRING FUNNEL DIAGNOSTIC                      |
|  Seed-stage SaaS · Engineer · Sydney · 18 May 2026 |
+----------------------------------------------------+
|                                                    |
|  +----------------------+                          |
|  | ALIGN     82  ████   |                          |
|  | ATTRACT   71  ████   |                          |
|  | ASSESS    54  ██     |                          |
|  | CLOSE     42  ██  ★  |  ← worst leak           |
|  | ONBOARD   68  ███    |                          |
|  +----------------------+                          |
|                                                    |
|  YOUR WORST LEAK: CLOSE                            |
|  You're scoring 42 out of 100.                     |
|                                                    |
|  THE FIX:                                          |
|  [recommendation.headline]                         |
|                                                    |
|  [recommendation.fixScript]                        |
|                                                    |
|  +-- ARTEFACT: [artefact.title] -----------+       |
|  | [artefact.content rendered as markdown] |       |
|  |                                         |       |
|  | [Copy to clipboard]                     |       |
|  +-----------------------------------------+       |
|                                                    |
|  [📧 Email me the PDF]                             |
|  [🔓 Contribute & unlock peer benchmarking]        |
+----------------------------------------------------+
```

---

## 8. The funnel visual

Five horizontal bars stacked vertically. ALIGN is widest at 100%. Each subsequent bar is 5% narrower. ONBOARD is 80%.

| Score | Status | Colour |
|---|---|---|
| 80-100 | Tight | `--status-tight` (green-600) |
| 60-79 | Functional | `--status-functional` (amber-600) |
| 40-59 | Leaking | `--status-leaking` (red-600) |
| 0-39 | Broken | `--status-broken` (red-900) |

Worst-leak bar has:
- An 8px left gold accent border.
- A "★ WORST LEAK" tag on the right.

Bar height: 80px desktop, 60px mobile.

Hover (desktop) or tap (mobile) reveals the four questions for that stage plus the user's responses.

---

## 9. Scoring math

Already in `/lib/scoring.ts`. Do not change without flagging.

```
Each response scores: No=0, Partial=8, Mostly=17, Yes documented=25.
Stage score = sum of four answers, range 0-100.
Worst leak = stage with lowest score. Ties broken by funnel order (earlier wins).
```

---

## 10. AI coaching layer

Two API routes wrap the Anthropic SDK. Both use `claude-sonnet-4-6`.

### `/api/coaching/forcing-prompt`

Input: `{ sentence: string }`

System prompt:
```
You edit one-sentence success criteria for James MacDonald, who runs NTP Talent and hosts Building Tech Teams. The user has written a success criterion for a hire. Your job: check it and rewrite if needed.

Required form: "I will know this hire worked when [specific outcome] by [specific date], because [evidence I have today]."

REJECT and REWRITE if the sentence:
- Uses hedging words (probably, maybe, hopefully, should, might).
- Uses filler words (genuinely, honestly, just, really, very).
- Lacks a specific outcome (avoid: "settled in," "contributing," "growing").
- Lacks a date or timeframe.
- Lacks evidence basis.

ACCEPT if the sentence has:
- A specific observable outcome.
- A specific date or timeframe.
- A specific evidence the user has today.

VOICE RULES for your rewrite:
- No em dashes.
- Active voice.
- Short sentences.
- No hedging or filler.

OUTPUT (JSON only, no prose):
{
  "accepted": true | false,
  "feedback": "one sentence explaining why if not accepted",
  "rewrite": "your rewritten version if not accepted, in James's voice"
}
```

### `/api/coaching/recommendation`

Input: `{ stage: FunnelStage, answers: QuestionAnswer[] }` (the worst-leak stage and its four answers)

System prompt:
```
You select recommendations for the Hiring Funnel Diagnostic. The user completed the diagnostic. You receive their worst-leak stage and their four answers for that stage. Pick the single best-fit recommendation from the library below.

RECOMMENDATION PATTERNS FOR [STAGE]:
[server injects RECOMMENDATIONS filtered to stage at request time]

USER'S ANSWERS FOR [STAGE]:
[server injects the four answers]

OUTPUT (JSON only):
{
  "selectedRecommendationId": "id from the library above",
  "reasoning": "one sentence on why this pattern matches"
}

Do not generate new recommendation text. Pick from the IDs provided.
```

---

## 11. AI Jobs Index integration

One API call: `GET ${AI_JOBS_INDEX_API_URL}/salary/lookup?role=X&region=Y` with `Authorization: Bearer ${AI_JOBS_INDEX_API_KEY}`.

Expected response shape (see `/lib/types.ts` `SalaryData`):
```json
{
  "role": "Senior Backend Engineer",
  "region": "Sydney",
  "median": 215000,
  "p25": 195000,
  "p75": 245000,
  "currency": "AUD",
  "source": "ai-jobs-index",
  "asOf": "2026-05-18",
  "sampleSize": 247
}
```

If the API key is missing or the call fails, the result page shows: "Live AI Jobs Index data is connecting. For now, the recommendation is the same."

---

## 12. Visual system

### Colours (locked in `tailwind.config.ts`)

- Navy `#1F3A5F` — primary brand, headers
- Blue `#2E75B6` — accents, links
- Blue light `#D5E8F0` — informational callouts
- Gold `#FCE5B6` — key callouts, worst-leak accent
- Grey light `#F2F2F2` — alternating rows
- Grey medium `#BFBFBF` — borders, secondary text

### Funnel status colours

- Tight: `#16A34A` (green-600)
- Functional: `#CA8A04` (amber-600)
- Leaking: `#DC2626` (red-600)
- Broken: `#7F1D1D` (red-900)

### Typography

Font: Inter (system fallback to sans-serif).

- H1: 3rem / 48px, bold, navy
- H2: 2rem / 32px, bold, navy
- H3: 1.5rem / 24px, bold, blue
- Body: 1rem / 16px, regular, black
- Small: 0.875rem / 14px, grey-medium
- Eyebrow: 0.75rem / 12px, bold, blue, uppercase, letter-spacing 0.1em

### Layout widths

- Diagnostic flow content: max 720px
- Result and library pages: max 1080px
- Funnel visual: full container width with narrowing per stage

---

## 13. PDF output

Generated server-side in `/app/api/pdf/[id]/route.ts` using `@react-pdf/renderer`. A4. 4 pages.

| Page | Content |
|---|---|
| 1 — Cover | Title, company context, date, BTT + Batko OS credit line |
| 2 — Funnel | Funnel visual rendered to PDF, scores per stage, worst-leak callout |
| 3 — Fix | Recommendation headline, full fix script, artefact content inline, source citation |
| 4 — 14-day action plan | Day 1-7 instructions, Day 7-14 instructions, footer with links |

PDF download is email-gated. User enters email on the result page, gets a magic link or direct download.

---

## 14. Library

### Database

See `/supabase/schema.sql`. Key elements:
- `diagnostic_results` table with all submissions.
- `public_library` view exposing only contributed entries with no PII.
- `question_aggregates` materialised view for peer benchmarking (refreshes nightly).
- `get_peer_benchmark()` function called from the diagnostic flow to surface inline benchmarks.

### Public library page

URL: `/library`. Displays entries from `public_library` with filters for stage, role type, region, and worst-leak stage. Each card shows:
- Company stage / role / region
- Funnel score visual (small)
- Worst leak (labelled)
- Sector (if self-reported)
- Date

No PII. No identifying information. The point of the library is pattern recognition across the dataset.

---

## 15. Live peer benchmarking

During the diagnostic, when the user picks any response on a question, fetch `get_peer_benchmark(stage, role, questionId)` and display inline:

```
67% of seed-stage founders also answered No to this.
```

Only display if the benchmark function returns data (i.e. n >= 5 for that question / stage / role). Otherwise the UI hides the callout.

This requires the materialised view to be refreshed regularly. Set up a Supabase scheduled function or pg_cron to refresh nightly.

---

## 16. NTP routing logic

After the result page, conditionally surface a soft NTP CTA based on user context:

| Condition | CTA |
|---|---|
| `stage` in `['series-a', 'series-b-plus']` AND `worst_leak` score < 50 | "Want NTP to help fix this in 30 days? Book a 15-min consult with James." |
| `stage` is `seed` AND `worst_leak` score < 40 | Soft email capture: "Get NTP placement intelligence delivered weekly." |
| All other cases | No NTP CTA. Library contribution CTA only. |

NTP CTA links to a Calendly or contact form (V1) or embedded calendar (V2).

---

## 17. Hosting and URLs

### Hosting layers and ownership

| Layer | What | Who owns |
|---|---|---|
| Code | GitHub repo | James |
| Build + hosting | Vercel | James |
| Database | Supabase | James |
| AI API | Anthropic | James |
| Working URL | `hiring-diagnostic.vercel.app` | James (Vercel-provided) |
| Future URL (if Michael agrees) | `batko.ai/operate/hiring` or `hiring.batko.ai` | Michael (DNS + routing only) |

### The Day 1 URL: `hiring-diagnostic.vercel.app`

This URL goes live the moment the first commit deploys on Day 1. It costs nothing, requires no DNS work, and stays stable for the entire build. Every subsequent day improves what's on this URL without changing the URL itself.

If the Vercel project name `hiring-diagnostic` is taken globally, fall back in this order:
- `btt-diagnostic.vercel.app`
- `hiring-funnel-diagnostic.vercel.app`
- `the-hiring-funnel.vercel.app`

Whichever URL the project lands on, update `NEXT_PUBLIC_SITE_URL` in `.env.local` and in Vercel environment variables to match. Used for PDF generation, og images, and library entry links.

### The pitch URL Michael sees

The Vercel URL is the URL Michael clicks. The conversation with him is "here's a working tool at [URL], spend 7 minutes running it as a founder would." He never sees a local dev environment or a strategy document. He sees the tool.

### The post-Michael URL (only if he says yes)

If Michael agrees to put the Diagnostic under his Operate pillar, two clean options exist. Neither requires changing the Vercel deployment.

**Option A — Custom domain at `hiring.batko.ai`:**
- Michael adds `hiring.batko.ai` as a custom domain in his Vercel project settings (he doesn't need to invite James as a collaborator; he can use a CNAME record that points to James's Vercel project).
- His DNS records: `CNAME hiring.batko.ai → cname.vercel-dns.com`.
- Vercel verifies and serves the site under that custom domain.
- The `hiring-diagnostic.vercel.app` URL also continues to work.

**Option B — Subpath link from his Operate pillar:**
- Michael leaves `batko.ai/operate/hiring` as a "Coming Soon" page that links out to `hiring-diagnostic.vercel.app`.
- Less technically clean. Zero work for Michael.
- Used as fallback if Option A has any complication.

The starter kit does not assume either. Decide post-launch based on what Michael wants.

### What does NOT change after launch

- The codebase lives in James's GitHub.
- The Vercel project lives in James's Vercel account.
- The Supabase database lives in James's Supabase account.
- The Anthropic API key is James's.

The only thing that ever changes is the user-facing domain. Ownership of the system stays with James regardless of Michael's involvement.

---

## 18. The 14-day build sequence

| Day | Deliverable | Validation |
|---|---|---|
| 1 | Repo init. Next.js 16 with TypeScript, React 19, and Tailwind. Vercel project created named `hiring-diagnostic`. Vercel-to-GitHub auto-deploy wired. Supabase project connected. Placeholder homepage live. | Live URL at `https://hiring-diagnostic.vercel.app` shows "Coming soon" with the brand visual system. |
| 2 | Step 1 (context picker) built. Step 2-6 (stage screens) shell built with navigation. Live funnel sidebar placeholder. | Can click through screens. No scoring yet. |
| 3 | Scoring math wired. Response buttons trigger score updates. Running stage score visible. | Picking responses changes the funnel scores correctly. |
| 4 | Funnel visual component built and wired to live scores. Worst-leak highlighting works. Stage hover/tap reveals answers. | Funnel updates correctly. Mobile-responsive. |
| 5 | Step 7 forcing prompt built. `/api/coaching/forcing-prompt` route built. Hedging-detection + rewrite working. | Can submit hedging sentence and get a rewrite. |
| 6 | `/api/diagnostic/submit` route built. Supabase write working. Apply `/supabase/schema.sql` to your Supabase project. Redirect to result page on submit. | End-to-end flow saves to DB. |
| 7 | Result page layout built. `/api/coaching/recommendation` route built. Recommendation displays with artefact and copy button. | Worst-leak recommendation surfaces correctly with the right artefact. |
| 8 | PDF generation built via `@react-pdf/renderer`. Email capture flow before download. | PDF downloads correctly with all 4 pages. |
| 9 | AI Jobs Index API wrapper built (`/lib/salary.ts`). Wired into context picker (call when role title entered). Surfaced in CLOSE recommendation if relevant. | Live salary data appears for valid role titles. Graceful fallback if API down. |
| 10 | Library contribution flow built. Identifying data hashed. `contributed_to_library` flag set. Public library page query works. | Contributing unlocks the peer benchmarking and library. |
| 11 | Public library page built with filters. Library entry card component. | Can browse and filter library entries. |
| 12 | Peer benchmark function called during diagnostic. Inline callouts surface when n >= 5. Materialised view refresh scheduled. | Peer benchmark callouts appear during diagnostic for questions with data. |
| 13 | End-to-end testing. Mobile responsiveness audit. Voice rules audit on every piece of UI copy. Beta link sent to 5 trusted founders. | Beta feedback collected. Critical bugs fixed. |
| 14 | Bug fixes from beta. Final polish. Production deploy. Launch coordination with BTT Episode 1. | Live URL public. Tool ready for launch. |

---

## 19. Voice rules audit checklist

Before any text-generating code merges, audit against:

- [ ] No em dashes anywhere in user-facing text.
- [ ] All sentences active voice.
- [ ] No hedging words (perhaps, maybe, might, should, could potentially).
- [ ] No filler words (genuinely, honestly, just, really, very, basically, literally).
- [ ] Every sentence under 25 words.
- [ ] Specific claims, no vague generalities.
- [ ] No corporate hedge phrases.
- [ ] All AI coaching outputs match these rules.

The voice rules are the single most important quality check in the project. Without them, the tool reads like generic AI output and fails the differentiation test.

---

## 20. What to do after V1 ships

1. Watch metrics for 7 days: completions, contributions, email captures.
2. Send a summary to Michael with the data. Decide together whether to invest in V2.
3. If yes: prioritise V2 features by which gives the strongest engagement signal. Co-founder mode is the most likely first V2 feature (Michael's audience is heavy on co-founder pairs).
4. If no: keep the tool running as an NTP lead-gen asset. Build the AI Jobs Index API tier as the next product.

The decision is empirical. Real usage data beats spec opinion.

---

**End of spec.**
