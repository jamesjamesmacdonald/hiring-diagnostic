# First Prompt for Claude Code

Copy everything between the `---START---` and `---END---` markers and paste it into your first Claude Code session in this directory.

---START---

I'm building the Hiring Funnel Diagnostic. Full context in `CLAUDE.md`. Full spec in `BUILD_SPEC.md`. Source-of-truth content in `/lib/*.ts`. Database schema in `/supabase/schema.sql`. Voice profile in `/James_MacDonald_Voice_Profile.md`. NTP brand voice reference in `/NTP_Brand_Content_Playbook.docx`.

Read those locations now. Don't write any code yet. Then confirm four things before we start:

1. You've read `CLAUDE.md` and understand the voice rules, tech stack (Next.js 16 + React 19), and core principles.
2. You've read `BUILD_SPEC.md` Section 18 (the 14-day build plan) and can recite the Day 1 deliverable from memory.
3. You've checked the contents of `/lib/questions.ts`, `/lib/recommendations.ts`, `/lib/artefacts.ts`, and `/lib/types.ts` and they look complete and consistent.
4. You've opened `James_MacDonald_Voice_Profile.md` and have the hard rules and banned-word list in mind for every piece of user-facing text you generate.

Once you've confirmed those four things, start Day 1.

Day 1 deliverable: repo init, Next.js 16 setup with TypeScript, React 19, and Tailwind. Vercel deployment pipeline. Supabase project connection. The end state of Day 1 is a live URL at `https://hiring-diagnostic.vercel.app` with a placeholder page that says "The Hiring Funnel Diagnostic, coming soon" using the visual system in BUILD_SPEC.md Section 12. Push to GitHub. Deploy to Vercel.

**Vercel project naming:** When you create the Vercel project, name it `hiring-diagnostic` so the deployment URL becomes `hiring-diagnostic.vercel.app`. If that name is already taken on Vercel globally, try these fallbacks in order: `btt-diagnostic`, `hiring-funnel-diagnostic`, `the-hiring-funnel`. Whichever one works, tell me the URL and we lock it in across the rest of the docs.

Rules of engagement:
- Ask before deviating from any locked decision in `CLAUDE.md` or `BUILD_SPEC.md`.
- Run all generated UI copy through the voice rules in `CLAUDE.md` before committing.
- After each day's deliverable, summarise what shipped, what changed, and what's blocking Day 2. Then wait for me to test locally before starting the next day.
- If something in the spec is unclear or contradictory, flag it. Don't guess.
- Keep code modular. Components small. Files under 300 lines where reasonable.

Let's go.

---END---

---

## What to expect on Day 1

Claude Code will:
1. Confirm it's read the three docs and inspected the lib files.
2. Init the Next.js 14 project structure.
3. Set up Tailwind with the colour palette from BUILD_SPEC.md.
4. Create a GitHub repo (it may ask you to authenticate the GitHub CLI first, or do it manually via the web).
5. Create a Vercel project named `hiring-diagnostic` and link it to the GitHub repo (it may ask you to log in to Vercel CLI first).
6. Connect Supabase (it may ask for your Supabase URL and keys if not in `.env.local`).
7. Create a placeholder homepage.
8. Push to GitHub. Vercel auto-deploys.
9. Confirm the live URL works at `https://hiring-diagnostic.vercel.app`.
10. Stop. Wait for you to test before starting Day 2.

**The URL you share with Michael is this Vercel URL.** It stays live and stable for the entire build. Every subsequent day improves what's on that URL.

## What to expect on Day 2-14

The same pattern. Claude Code follows the day-by-day plan in BUILD_SPEC.md Section 17. After each day, you test locally with `npm run dev`. You give feedback. Claude Code adjusts and moves to the next day.

## If Claude Code drifts

If at any point Claude Code starts deviating from the spec (suggesting a different framework, generating recommendation text instead of selecting from the library, ignoring voice rules), redirect with this prompt:

```
Stop. Re-read CLAUDE.md and the relevant section of BUILD_SPEC.md. The decision is locked. We don't change it. Continue from where we were, respecting that decision.
```

This usually resets the context.

## When to ignore the spec

After V1 ships and Michael (or you) has used the tool. Real usage data beats spec opinion. Until then, stay close to the spec.
