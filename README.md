# The Hiring Funnel Diagnostic

A 7-minute diagnostic tool that scores a founder's hiring funnel and surfaces the one fix that matters most.

Built for the launch of BTT Episode 1 (Building Tech Teams with James MacDonald). Co-launched with Michael Batko's Batko OS platform at `batko.ai/operate/hiring`.

## What this repo contains

A complete starter kit to build the tool using Claude Code in 14 days. Single developer. Low cost.

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project context Claude Code auto-loads. Voice rules, tech stack, core principles. |
| `FIRST_PROMPT.md` | The message to paste into Claude Code on Day 1 to kick off the build. |
| `BUILD_SPEC.md` | Full architecture, UX spec, scoring math, AI coaching prompts, 14-day plan. |
| `James_MacDonald_Voice_Profile.md` | Voice profile Claude Code consults for every piece of user-facing text. |
| `NTP_Brand_Content_Playbook.docx` | NTP brand voice reference for NTP-routed CTA copy. |
| `lib/types.ts` | TypeScript types for the whole project. |
| `lib/questions.ts` | The 20 diagnostic questions, source-cited. |
| `lib/recommendations.ts` | The 10 pre-written recommendations. |
| `lib/artefacts.ts` | The 10 fix artefact templates (call scripts, scorecards, JD templates, etc). |
| `lib/scoring.ts` | Scoring math. |
| `supabase/schema.sql` | Database schema ready to apply. |
| `package.json` | Pinned dependencies (Next.js 16 + React 19). |
| `.env.example` | Required environment variables. |
| `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `.gitignore` | Standard config. |

## How to use this kit

### Step 1: Set up the project

```bash
# In your terminal
cd /path/to/hiring-diagnostic
cp .env.example .env.local

# Install Node 20+ and npm if you haven't already.
# Then install dependencies (Claude Code will do this for you if you prefer).
npm install
```

### Step 2: Create the external services

You need three accounts before Claude Code can run the full build. Free tiers cover everything.

1. **Vercel.** Sign up at vercel.com. Connect to your GitHub.
2. **Supabase.** Sign up at supabase.com. Create a new project. Copy the URL and anon key into `.env.local`.
3. **Anthropic API.** Sign up at console.anthropic.com. Generate an API key. Add it to `.env.local`.

### Step 3: Run Claude Code

```bash
claude
```

Then paste the contents of `FIRST_PROMPT.md` into the Claude Code session.

Claude Code will read `CLAUDE.md` automatically, scan the lib files, and start building Day 1 of the 14-day plan.

### Step 4: Iterate

After each day, Claude Code will check in with you. Review what's built. Test it locally with `npm run dev`. Push changes. Move to the next day.

The 14-day plan is in `BUILD_SPEC.md` Section 17. Stay close to it. If you want to deviate, do it after V1 ships, not during.

## What V1 looks like when done

- Live URL at `https://hiring-diagnostic.vercel.app` (free Vercel hosting, stable from Day 1 onwards).
- A founder lands, picks their stage / role / region, answers 20 questions, sees their funnel.
- The worst-leak recommendation surfaces with a copy-paste fix artefact.
- The diagnostic PDF downloads after email capture.
- Library contribution unlocks peer benchmarking and library deep-search.
- Total founder time: 7 minutes.
- Build time: 14 days.

**The URL stays the same for the entire build.** Every day Claude Code finishes a step, the same URL gets more functional. By Day 14, that URL is the production tool. You share this URL with Michael as soon as Day 1 finishes.

**If Michael agrees to co-launch** under his Operate pillar, the deployment stays where it is. Michael adds `hiring.batko.ai` as a custom domain in his Vercel settings (a single CNAME record) that points at your existing Vercel project. Both URLs work. The codebase, database, and API keys stay with you.

## What V2 looks like (not in this kit)

- Re-run with time-series tracking
- Co-founder / team mode (multi-user diagnostic with disagreement map)
- AI coaching email sequence (14-day program)
- Viral share card (anonymised social image)
- NTP calendar booking integration
- Quarterly Hiring Funnel Report

Build V2 only if Michael wants to keep going after seeing V1, or if you find the tool useful enough to keep investing in solo.

## Voice rules (also in CLAUDE.md)

Every piece of text in this product respects these. Apply to UI copy, error messages, AI coaching, email content.

- No em dashes. Full stops or new sentences.
- Active voice.
- No hedging. No filler.
- Short sentences.
- Specificity over generality.
- Every claim sourced.

If something reads like generic AI output, rewrite it until it doesn't.

## Source material

The diagnostic is built from existing source material. Every question and every recommendation traces to one of these.

- **BTT Episode 1 with Michael Batko** (the podcast launching alongside this tool)
- **Michael Batko's published writing** (7 posts on batko.ai and his Substack, plus 10 hiring principles)
- **James MacDonald's Hiring Funnel Fix** (8-chapter playbook with the ALIGN Framework, 5 Questions Framework, Interview Scorecard, pre-close prompt, and 30-day Onboarding Playbook)
- **NTP placement intelligence** (sourcing-channel and placement data from Australian tech hiring)

See `BUILD_SPEC.md` Section 4 for the full source mapping.

## Questions

If anything in this kit is unclear, the source of truth is `BUILD_SPEC.md`. If that's still unclear, ask Claude Code to clarify before building.
