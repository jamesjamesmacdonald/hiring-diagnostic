# The Hiring Funnel Diagnostic

This is the project context. Claude Code loads this on every session. Keep responses aligned with what's here.

---

## What we're building

A 7-minute diagnostic tool that scores a founder's hiring funnel across five stages (ALIGN, ATTRACT, ASSESS, CLOSE, ONBOARD), surfaces their worst leak, and outputs an actionable fix artefact plus a personalised PDF.

**Hosting URL (working / demo / Day 1 onwards):** `hiring-diagnostic.vercel.app`
**Final URL (only if Michael agrees to co-launch):** `batko.ai/operate/hiring` (or `hiring.batko.ai` as a custom domain pointed at the same Vercel deployment)

Co-launches with BTT Episode 1 (the podcast with Michael Batko). Built in 14 days by James MacDonald using Claude Code.

The Vercel URL is the demo URL Michael sees. It stays live forever regardless of whether the `batko.ai` domain swap happens.

Full spec lives in `BUILD_SPEC.md`. Read it before deviating from any architecture decision.

---

## Voice rules — non-negotiable

Apply these to every piece of generated text: UI copy, error messages, AI coaching outputs, email content, code comments visible to users.

- **No em dashes.** Use a full stop or a new sentence. Never `—`.
- **Active voice throughout.** "James wrote the framework," not "The framework was written by James."
- **No hedging.** Banned: perhaps, maybe, could potentially, might be.
- **No filler words.** Banned: genuinely, honestly, just, really, very, literally, actually, basically.
- **Short sentences.** Break anything over 25 words.
- **Specificity over generality.** "Sydney senior engineer median $215K" beats "around $200K-ish."
- **No corporate hedge phrases.** Banned: "I hope this finds you well," "regards," "looking forward to," "synergies," "leverage" (as a verb).

If any generated content breaks these rules, reject and regenerate. Voice consistency is the product.

---

## Tech stack — locked

Do not propose alternatives without explicit user permission.

- Frontend: Next.js 16 (App Router) + TypeScript
- React: 19
- Styling: Tailwind CSS
- Database: Supabase (Postgres + auth + storage)
- AI: Anthropic API, model `claude-sonnet-4-6`
- PDF: `@react-pdf/renderer`
- Hosting: Vercel
- State: React state (Zustand only if React state proves insufficient)

Stack chosen for consistency with `aijobsindex.com.au` and to match what Michael Batko works with on Founder OS. Next.js 16 brings React 19 (use it correctly: async cookies/headers, the new caching defaults). If a third-party package has not yet shipped a React 19-compatible version, raise it before installing.

---

## Reference files in this directory

Two reference files sit alongside this CLAUDE.md. Read them when the task touches their domain.

| File | When to consult it |
|---|---|
| `James_MacDonald_Voice_Profile.md` | Every time you generate user-facing text. UI copy, AI coaching responses, error messages, the anchor manifesto body, PDF copy, recommendation text edits. Voice rules in this file override your defaults. |
| `NTP_Brand_Content_Playbook.docx` | When you write copy for the NTP routing CTA (Section 16 of BUILD_SPEC.md), or any text positioned under the NTP Talent brand. Use the playbook's "Two Doors" copy as the template for the consultation CTA. |

---

## Core principles — do not violate

1. **Recommendations are pre-written. Claude never generates recommendation text.** The library in `lib/recommendations.ts` is the only source. The AI coaching layer's job is to select which recommendation matches the user's pattern, not invent new ones.

2. **No team-shape opinions in the product.** The Diagnostic never offers a view on what a tech team should look like, who to hire, or PM:eng ratios. Process is the product. Team-shape commentary lives in the BTT podcast, not the tool.

3. **The first answer is free.** The full diagnostic, the funnel visual, and the worst-leak recommendation are all free. Email gates the PDF download. Library contribution unlocks peer benchmarking and library search. The user never pays for the diagnosis.

4. **Every claim is sourced.** Each question, each recommendation, and each piece of coaching cites either Michael's published writing, James's Hiring Funnel Fix, BTT Episode 1, or the AI Jobs Index. No unsupported assertions.

5. **The 7-minute target is a design constraint.** If a feature pushes the flow over 7 minutes, the feature loses.

---

## File map

```
/CLAUDE.md                              you are here
/README.md                              human-readable intro
/FIRST_PROMPT.md                        the kickoff message for Day 1
/BUILD_SPEC.md                          full architecture and 14-day plan
/James_MacDonald_Voice_Profile.md       voice profile (read whenever generating text)
/NTP_Brand_Content_Playbook.docx        NTP brand voice (read for NTP-routed copy)
/package.json                           dependencies
/.env.example                           env vars template
/lib/types.ts                           TypeScript types
/lib/questions.ts                       the 20 questions, source-cited
/lib/recommendations.ts                 the 10 pre-written recommendations
/lib/artefacts.ts                       the 10 fix artefact templates
/lib/scoring.ts                         scoring math
/supabase/schema.sql                    database schema
```

---

## V1 scope (the 14-day build)

1. 20-question diagnostic flow with stage/role/region branching
2. Live funnel visual updating as the user answers
3. Worst-leak recommendation with copy-paste fix artefact
4. Personalised PDF download (email-gated)
5. Library contribution flow (unlocks peer benchmarking)
6. Public library page with filters
7. AI Jobs Index salary data in CLOSE stage
8. Live peer benchmarking inline during diagnostic
9. AI coaching on the forcing prompt (hedging detection + rewrite)

Anything else is V2. See `BUILD_SPEC.md` Section 4 for the V2 backlog.

---

## How to work in this repo

- Ask before deviating from any locked decision (tech stack, voice rules, core principles, V1 scope).
- When generating new UI copy, run it past the voice rules above before committing.
- When in doubt, the source of truth is `BUILD_SPEC.md`.
- The data files in `/lib/*.ts` are source of truth for content. Do not edit recommendations, questions, or artefacts without flagging to the user first.
