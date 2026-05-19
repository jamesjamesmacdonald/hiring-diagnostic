// The 10 fix artefact templates.
// Each artefact is markdown content displayed in-page with a copy-to-clipboard button.
// Do not edit content without flagging to user first.

import type { Artefact } from './types';

export const ARTEFACTS: Artefact[] = [
  {
    id: 'align-ai-test-plan',
    title: '7-Day AI-First Check Plan',
    content: `**Day 1.** List the three core workflows this role would handle.

1. [Workflow 1]
2. [Workflow 2]
3. [Workflow 3]

**Day 2-3.** Set up Claude (or your preferred AI tool) to handle Workflow 1. Test with three real examples.

**Day 4-5.** Test Workflow 2. Same approach.

**Day 6.** Test Workflow 3. Same approach.

**Day 7.** Score each workflow 1-5 on:
- Output quality vs human equivalent
- Time saved
- Edge cases it failed on

**Decision criteria.** If two of three workflows score 4+ for quality and 3+ for time saved, delay the hire by 60 days and refine the AI setup. If less, the hire is justified. Document the test results either way.`,
  },

  {
    id: 'align-5-questions-workshop',
    title: '30-Minute 5 Questions Workshop Agenda',
    content: `**Participants.** Three named stakeholders. The decision-maker, the hiring manager, the team representative.

**Time.** 30 minutes. Hard stop.

**The five questions** (answer in writing, not discussion):

1. What does success look like in 90 days? (One sentence.)
2. Who is the decision-maker on the offer? (One name.)
3. What is the trigger that opened this role? (One sentence.)
4. What would make you scrap the hire by week 6? (One sentence.)
5. Who manages this hire on day 1? (One name.)

**Output.** Single page. Three signatures. This is the brief.`,
  },

  {
    id: 'attract-behavioural-jd-template',
    title: 'Behavioural Job Description Template',
    content: `**Role:** [Title]
**Reporting to:** [Name]
**Location:** [Region / remote]

---

**The signal we are hiring for**

[One specific behavioural signal, observable in a 10-minute conversation. Examples: ships product within 7 days of starting; makes decisions with incomplete information; asks the question that changes the brief.]

**What this looks like in practice**

[Three specific examples from the team's recent work where this signal would have changed the outcome.]

**The work**

[Three bullets describing what the hire will own in months 1-3. Outcome-based, not task-based.]

**What we offer**

- Base: $[X], anchored at the [Y]th percentile of [AI Jobs Index data]
- Equity: [X]% with [Y]-year vest
- Benefits: Claude Max subscription, AI tooling budget $[X], learning budget $[X]

**How to apply**

Send a 200-word answer to this question: [Specific question that tests the signal].

No CV required.`,
  },

  {
    id: 'attract-sourcing-data-report',
    title: 'Sourcing Channel Recommendation',
    content: `**Top 3 channels for this role and region** (based on AI Jobs Index placement data, last 90 days):

1. **[Channel 1]** — [why it works for this role]
2. **[Channel 2]** — [why it works for this role]
3. **[Channel 3]** — [why it works for this role]

**Pick one. Run it for 30 days. Track:**
- Candidates surfaced
- Qualified candidates (passed initial screen)
- Conversion to interview

If conversion to interview is above 20%, double down. Below, switch to channel two.`,
  },

  {
    id: 'assess-scorecard-template',
    title: 'Weighted Interview Scorecard',
    content: `**Candidate:** [Name]
**Role:** [Title]
**Interviewer:** [Your name]

| Criterion | Weight | Score (1-5) | Weighted |
|---|---|---|---|
| [Behavioural signal from JD] | 30% | __ | __ |
| Technical capability for role | 25% | __ | __ |
| Communication clarity | 20% | __ | __ |
| Cultural alignment | 15% | __ | __ |
| Learning velocity | 10% | __ | __ |

**Total weighted score:** __ / 5

**Decision recommendation:** [Hire / Hire with reservation / No]

**One sentence on the strongest signal:** ___

**One sentence on the biggest risk:** ___

---

**Rules:**
- Score independently before discussing with other interviewers.
- Bring the scorecard to the debrief. Do not change scores during discussion.
- The discussion explores disagreements, not the scores themselves.`,
  },

  {
    id: 'assess-reference-script',
    title: 'Three-Question Reference Call Script',
    content: `**Caller:** [Your name]
**Reference:** [Reference name]
**Candidate:** [Candidate name]
**Time:** 15 minutes

**Opener.** Thanks for taking the call. I have three specific questions about [Candidate]. They will not take long.

**Question 1.** Compared to the other people you managed at the same level, what was [Candidate]'s growth rate?

(Listen for: faster than peers, average, slower. Probe if vague.)

**Question 2.** What is something [Candidate] learned in the last 12 months that surprised you?

(Listen for: specific learning, recent timeframe. Vague answers are themselves a signal.)

**Question 3.** Knowing what you know now, would you hire [Candidate] again, and at what level?

(Listen for: the level. Same level = positive. Higher level = strong signal. Lower or evasive = warning.)

**Close.** Thanks, that is everything I needed.

**After the call.** Write three sentences capturing the answers. File with the scorecard.`,
  },

  {
    id: 'close-pre-close-script',
    title: 'Pre-Close Conversation Script',
    content: `**Format:** 15-minute call. Before any offer in writing.

**Opener.** Before I put anything in writing, I want to make sure I am getting this right for you. Two quick questions.

**Question 1.** If I made you an offer today within market range for this role, what would stop you from saying yes?

(Listen for: comp expectations, competing offers, equity questions, partner or relocation considerations, doubts about the role. Take notes.)

**Question 2.** Have you had any other conversations that might affect your decision?

(Listen for: live processes elsewhere, recent offers, current-employer counter risk. This tells you the timeline and the competition.)

**Close.** Great, that helps me put together something that actually works for you. You'll have the offer within 48 hours.

**After the call.** The two answers change the offer. If they raised comp, anchor to a specific AI Jobs Index percentile and explain it. If they raised competing offers, accelerate the timeline. If they raised equity questions, prepare the equity story.

**Send the offer within 48 hours. Decision deadline within 5 days.**`,
  },

  {
    id: 'close-comp-data-report',
    title: 'Comp Benchmarking Report',
    content: `**Role:** [Title]
**Region:** [Region]
**Source:** AI Jobs Index, [date]

**Live market data:**
- 25th percentile: $[X]
- Median: $[Y]
- 75th percentile: $[Z]

**Recommendation.** Anchor offer to the 60-75th percentile if hiring competitively. Below the 25th, you will lose anyone with a competing option. Above the 75th, you are paying for noise.

**Show the candidate the band when you make the offer.** Transparency closes faster than bargaining.

**Justification language for the offer letter:**

"Your base of $[X] sits at the [Y]th percentile of the live market for this role in [region], based on AI Jobs Index data as of [date]. We anchor here because [reason: speed, signal, stage]."`,
  },

  {
    id: 'onboard-30-day-plan-template',
    title: '30-Day Plan Template',
    content: `**Hire:** [Name]
**Role:** [Title]
**Manager:** [Name]
**Start date:** [Date]

---

**Days 1-10: Context**

**Outcome:** [What they will understand by day 10]

- Day 1: Tool stack setup. Claude Max provisioned. Prompt library shared. First task scoped.
- Day 1: Meet the team. Three named people. One-on-ones booked.
- Days 2-5: Read the context. [Specific docs to read.]
- Days 6-10: Shadow one workflow end to end.

**Days 11-20: Ownership**

**Outcome:** [The one specific deliverable they will own by day 20]

- Day 11: First deliverable assigned. End-to-end. Manager available, not driving.
- Day 14: Check-in. Early-warning signal check: [specific observation].
- Day 20: Deliverable ships or fails. Either way, full debrief.

**Days 21-30: Expand or Adjust**

**Outcome:** [The decision made about scope going forward]

- Based on phase 2: either expand scope to the next deliverable, or course-correct.
- Day 30: Formal review. Manager and hire write three sentences each: what worked, what did not, what changes for next 30 days.

---

**Check-in cadence**

- Daily: 5-minute async standup in Slack or equivalent.
- Weekly: 30-minute sync one-on-one.
- Day 14: Early-warning signal review.
- Day 30: Formal review.`,
  },

  {
    id: 'onboard-early-warning-worksheet',
    title: '14-Day Early-Warning Signal Worksheet',
    content: `**The principle.** The 30-day review is too late if there is a problem on day 14.

**Your task today.** Pick ONE specific observation that, if missing on day 14, triggers immediate intervention.

---

**Choose from common patterns:**

- [ ] Has not asked a clarifying question on the brief by day 7
- [ ] Has not pushed back on a single decision by day 10
- [ ] Has not built a relationship outside their direct manager by day 14
- [ ] Has not shipped one small deliverable by day 14
- [ ] Has not flagged a problem to you by day 14
- [ ] Custom: ___________________________

---

**Your chosen signal:** ___________________________

**Calendar reminder set for day 14:** [Yes / No]

**If the signal is missing on day 14, the intervention is:**

- 30-minute conversation with the hire
- Ask: what is blocking you, what do you need from me, what would you change
- Write down their answer. Adjust the 30-day plan if needed.
- Re-check the signal on day 21.

The intervention is not punishment. It is information.`,
  },
];

// Helper: get an artefact by id.
export function artefactById(id: string): Artefact | undefined {
  return ARTEFACTS.find((a) => a.id === id);
}
