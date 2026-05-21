// The 10 pre-written recommendations.
// Claude SELECTS which recommendation matches. Claude NEVER generates new recommendation text.
// Do not edit content without flagging to user first.

import type { Recommendation } from './types';

export const RECOMMENDATIONS: Recommendation[] = [
  // ============ ALIGN ============
  {
    id: 'align-ai-first-check',
    stage: 'align',
    triggerPattern: "User scored 'no' or 'partial' on align-1 (tested AI for 30 days first).",
    headline: 'Run the 7-day AI-first check before opening the role',
    fixScript:
      "Michael's principle: AI before headcount. Before you hire, run a 7-day test. List the three workflows this role would handle. Set up Claude or another AI tool to do each one. Track what works and what hits a real ceiling. The test gives you the evidence you need to either confirm the hire or scrap it. Most founders skip this because they assume the AI cannot do the work. The data usually surprises them.",
    artefactId: 'align-ai-test-plan',
    source: 'Michael Batko, How to Hire Your First Employee',
  },
  {
    id: 'align-stakeholder-workshop',
    stage: 'align',
    triggerPattern: "User scored 'no' or 'partial' on align-2 (success criteria) or align-3 (named decision-maker).",
    headline: 'Run the 30-minute 5 Questions workshop with named stakeholders',
    fixScript:
      "Most hires fail because stakeholders never agreed on success criteria. James MacDonald's 5 Questions Framework forces alignment in 30 minutes. Three named stakeholders. Five questions, answered in writing. The questions: what does success look like in 90 days, who is the decision-maker, what is the trigger that opened this role, what would make you scrap the hire by week 6, who manages this hire on day 1. Get this signed off before the role goes anywhere.",
    artefactId: 'align-5-questions-workshop',
    source: 'James MacDonald, The Hiring Funnel Fix',
  },

  // ============ ATTRACT ============
  {
    id: 'attract-behavioural-jd',
    stage: 'attract',
    triggerPattern: "User scored 'no' or 'partial' on attract-1 (JD built around behavioural signal).",
    headline: 'Rewrite the JD around one specific behavioural signal',
    fixScript:
      "Years of experience and university filter out the highest-slope candidates. Michael's principle: hire for slope, not y-intercept. Pick one behavioural signal that predicts success in this role. Write it as something observable in a 10-minute conversation. Examples: ships product within 7 days of starting, makes a decision with incomplete information, asks a question that changes the brief. Now rewrite the JD around that signal. Cut the credentials section. Replace it with the signal.",
    artefactId: 'attract-behavioural-jd-template',
    source: "Michael Batko's hiring principles. BTT Episode 1.",
  },
  {
    id: 'attract-sourcing-switch',
    stage: 'attract',
    triggerPattern: "User scored 'no' or 'partial' on attract-2 (job ad sells the role) or attract-4 (outreach to named candidates).",
    headline: 'Rewrite your job ad to sell the role',
    fixScript:
      "Recruitment is marketing in both directions. The candidate markets themselves to you. You market the role to them. Most job ads do only half of that. They list tasks, requirements, and years of experience, then wait. Strong candidates have options, so they skip ads that read like a chore. Rewrite yours. Open with why a strong person would leave their current job for this one. Name the problem they will own, the people they will work with, and what they will learn. Put the task list last. Do the same in your outreach messages. A message that leads with the candidate, not the vacancy, gets a reply.",
    artefactId: 'attract-sourcing-data-report',
    source: 'James MacDonald, The Hiring Funnel Fix',
  },

  // ============ ASSESS ============
  {
    id: 'assess-weighted-scorecard',
    stage: 'assess',
    triggerPattern: "User scored 'no' or 'partial' on assess-1 (weighted scorecard) or assess-2 (work sample).",
    headline: 'Build the weighted interview scorecard before the next final round',
    fixScript:
      "Gut-call interviews are the single leakiest part of most processes. James MacDonald's Interview Scorecard fixes this in 20 minutes. Pick 5 criteria weighted by importance to the role. Score each candidate 1-5 across each criterion. Multiple interviewers score independently before discussing. The compare-notes step is what reduces bias. Without a scorecard you are hiring the person who interviewed best, not the person who fits best.",
    artefactId: 'assess-scorecard-template',
    source: 'James MacDonald, The Hiring Funnel Fix',
  },
  {
    id: 'assess-reference-framework',
    stage: 'assess',
    triggerPattern: "User scored 'no' or 'partial' on assess-3 (reference calls probe growth over time).",
    headline: "Switch to Michael's three-question reference framework",
    fixScript:
      "Generic reference calls get generic answers. Michael's three-question framework gets real signal. Question one: what was their growth rate in your team compared to peers. Question two: what is something they learned in the last 12 months that surprised you. Question three: would you hire them again knowing what you know now, and at what level. Question three is the kill shot. The answer has to include a specific level. Vague answers there are usually a signal in themselves.",
    artefactId: 'assess-reference-script',
    source: "Michael Batko's hiring principles",
  },

  // ============ CLOSE ============
  {
    id: 'close-pre-close-prompt',
    stage: 'close',
    triggerPattern: "User scored 'no' or 'partial' on close-1 (pre-close conversation).",
    headline: 'Run the pre-close prompt before sending the next offer',
    fixScript:
      "The pre-close conversation is the highest-leverage tool in the entire hiring funnel. James MacDonald's prompt: a 15-minute call before any offer goes in writing. Ask two questions. Question one: if I made you an offer today within market range, what would stop you from saying yes. Question two: have you had any other conversations that might affect your decision. The answers tell you what to offer and how to position it. Skipping this is how offers get countered.",
    artefactId: 'close-pre-close-script',
    source: 'James MacDonald, The Hiring Funnel Fix',
  },
  {
    id: 'close-comp-reposition',
    stage: 'close',
    triggerPattern: "User scored 'no' or 'partial' on close-2 (understands candidate motivators) or close-3 (counter-offer scenarios).",
    headline: 'Build the offer around what the candidate told you',
    fixScript:
      "An offer is a guess until you know what the candidate values. Run the pre-close conversation first, then build the offer around the answers. Three moves. One, anchor the comp. Use the market benchmark for the role and region, and aim for the 60th to 75th percentile if you are hiring competitively. Show the candidate the band. Transparency closes faster than bargaining. Two, address the motivator they named. If it was scope, write the scope into the offer. If it was growth, name the path and who they learn from. Three, prepare your counter-offer response before you send anything. Counter-offers happen. Decide your answer in advance, not in the moment.",
    artefactId: 'close-comp-data-report',
    source: 'James MacDonald, The Hiring Funnel Fix',
  },

  // ============ ONBOARD ============
  {
    id: 'onboard-30-day-plan',
    stage: 'onboard',
    triggerPattern: "User scored 'no' or 'partial' on onboard-1 (AI-native day 1) or onboard-2 (30-day plan documented).",
    headline: 'Build the three-phase 30-day plan before day 1',
    fixScript:
      "Unstructured onboarding loses 30 to 60 days of productivity. Michael's principles and James's 30-day Playbook converge on a three-phase structure. Days 1-10: context. The hire absorbs the company, the team, and the role. Days 11-20: ownership. The hire takes over one specific deliverable end to end. Days 21-30: expand or adjust. Based on what you saw in phase two, expand the scope or course-correct. Write the plan before day 1. Share it with the hire on day 1. Reference it at every check-in.",
    artefactId: 'onboard-30-day-plan-template',
    source: "Michael Batko's hiring principles + James MacDonald, The Hiring Funnel Fix",
  },
  {
    id: 'onboard-early-warning',
    stage: 'onboard',
    triggerPattern: "User scored 'no' or 'partial' on onboard-3 (check-in cadence) or onboard-4 (14-day early-warning).",
    headline: 'Define the 14-day early-warning signal today',
    fixScript:
      "The 30-day review is too late if there is a problem on day 14. Michael's principle: optimise for learning speed. Define one specific observation that, if missing on day 14, triggers immediate intervention. Examples: has not asked a clarifying question on the brief, has not pushed back on a single decision, has not built a relationship outside their direct manager. Pick one. Write it down. Set a calendar reminder for day 14 to check.",
    artefactId: 'onboard-early-warning-worksheet',
    source: "Michael Batko's hiring principles + James MacDonald",
  },
];

// Helper: get recommendations for a stage.
export function recommendationsForStage(stage: string): Recommendation[] {
  return RECOMMENDATIONS.filter((r) => r.stage === stage);
}

// Helper: get a recommendation by id.
export function recommendationById(id: string): Recommendation | undefined {
  return RECOMMENDATIONS.find((r) => r.id === id);
}
