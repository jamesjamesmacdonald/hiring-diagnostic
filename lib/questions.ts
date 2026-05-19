// The 20 questions of the Hiring Funnel Diagnostic.
// Each question scores 0-25 based on the user's response.
// Sources cited per question. Do not edit content without flagging to user first.

import type { Question } from './types';

export const QUESTIONS: Question[] = [
  // ============ ALIGN ============
  {
    id: 'align-1',
    stage: 'align',
    order: 1,
    text: 'Have you tested whether AI tooling can cover this work for at least 30 days before hiring?',
    source: "Michael Batko (Hire First Employee, principle 1)",
    whyItMatters: 'AI before headcount. If you have not tested, you do not know whether the hire is the right move.',
  },
  {
    id: 'align-2',
    stage: 'align',
    order: 2,
    text: "Have you written a one-sentence success criterion in the form: 'I will know this hire worked when X by Y because Z'?",
    source: "James MacDonald (ALIGN Framework, Hiring Funnel Fix Ch 2)",
    whyItMatters: 'Forces specificity. Kills hedging. Reveals if the role outcome is measurable.',
  },
  {
    id: 'align-3',
    stage: 'align',
    order: 3,
    text: 'Is there a named decision-maker who owns the outcome of this hire?',
    source: "James MacDonald (ALIGN Framework)",
    whyItMatters: 'Most hires fail because success criteria float across stakeholders. One named owner fixes that.',
  },
  {
    id: 'align-4',
    stage: 'align',
    order: 4,
    text: 'Have you planned how this hire eventually scales out of being managed directly by you?',
    source: "Michael Batko (The Person Who Built It Is Now The Reason It Can't Scale)",
    whyItMatters: 'Founders hire to escape work, then become the bottleneck for the new hire. Plan the extraction on day 1.',
  },

  // ============ ATTRACT ============
  {
    id: 'attract-1',
    stage: 'attract',
    order: 1,
    text: 'Is your job description built around a specific behavioural signal, not credentials or years of experience?',
    source: "Michael Batko (principles 2 + 3) and BTT Episode 1",
    whyItMatters: 'Years and university filter out the highest-slope candidates. Behavioural signal beats both.',
  },
  {
    id: 'attract-2',
    stage: 'attract',
    order: 2,
    text: 'Are your sourcing channels chosen based on where similar roles actually got filled, not defaults like LinkedIn?',
    source: "AI Jobs Index data and NTP placement patterns",
    whyItMatters: 'Default channels return default candidates. Targeted channels return targeted candidates.',
  },
  {
    id: 'attract-3',
    stage: 'attract',
    order: 3,
    text: 'Is your comp positioning anchored to a specific market percentile, not an intuitive number?',
    source: "AI Jobs Index live data + James MacDonald (Hiring Funnel Fix)",
    whyItMatters: 'Comp set on intuition either underpays or overpays. Both leak.',
  },
  {
    id: 'attract-4',
    stage: 'attract',
    order: 4,
    text: 'Are you running outreach to named candidates, not just posting and waiting?',
    source: "James MacDonald (5 Questions Framework)",
    whyItMatters: 'Inbound-only sourcing means you only meet candidates actively looking. The best ones rarely are.',
  },

  // ============ ASSESS ============
  {
    id: 'assess-1',
    stage: 'assess',
    order: 1,
    text: 'Do you have a weighted scorecard with criteria scored 1-5 across multiple interviewers?',
    source: "James MacDonald (Interview Scorecard, Chapter 5)",
    whyItMatters: 'Gut-call interviews are the leakiest part of most processes. Scorecards force compare-notes and reduce bias.',
  },
  {
    id: 'assess-2',
    stage: 'assess',
    order: 2,
    text: 'Does your interview process include a work sample or behavioural test, not just conversation?',
    source: "BTT Episode 1 on attitude over skill",
    whyItMatters: 'Conversations test interview skill. Work samples test the work.',
  },
  {
    id: 'assess-3',
    stage: 'assess',
    order: 3,
    text: 'Do your reference questions use the slope-not-y-intercept frame (growth vs peers, recent learning, hire-again at level)?',
    source: "Michael Batko (principle 4)",
    whyItMatters: 'Generic reference questions get generic answers. Specific ones reveal actual signal.',
  },
  {
    id: 'assess-4',
    stage: 'assess',
    order: 4,
    text: 'Is your decision deadline less than 10 days from final round to offer?',
    source: "James MacDonald (pre-close prompt)",
    whyItMatters: 'Slow processes lose strong candidates to competing offers. Speed is itself a screening signal.',
  },

  // ============ CLOSE ============
  {
    id: 'close-1',
    stage: 'close',
    order: 1,
    text: 'Have you run the pre-close conversation (15-min call, 2 questions on actual decision criteria) before sending the offer?',
    source: "James MacDonald (pre-close prompt, Chapter 6)",
    whyItMatters: 'The single highest-leverage tool in the entire funnel. Skipping it is how offers get countered.',
  },
  {
    id: 'close-2',
    stage: 'close',
    order: 2,
    text: 'Is your comp offer anchored to a specific AI Jobs Index percentile or equivalent live market data?',
    source: "AI Jobs Index live data layer",
    whyItMatters: 'Off-market comp loses the candidate or signals weakness.',
  },
  {
    id: 'close-3',
    stage: 'close',
    order: 3,
    text: 'Have you written counter-offer scenarios and your response to each before sending the offer?',
    source: "NTP retained-search delivery patterns",
    whyItMatters: 'Counter-offers happen. Preparing the response in advance changes outcomes.',
  },
  {
    id: 'close-4',
    stage: 'close',
    order: 4,
    text: 'Are your benefits AI-era (Claude Max, learning budget, AI tooling access) or 2019-era?',
    source: "BTT Episode 1",
    whyItMatters: 'What looked like a perk five years ago is table stakes. AI tooling is the new gym membership.',
  },

  // ============ ONBOARD ============
  {
    id: 'onboard-1',
    stage: 'onboard',
    order: 1,
    text: 'Is day 1 set up AI-native: tool stack configured, prompt library shared, first task scoped, AI policy clear?',
    source: "BTT Episode 1 + Michael Batko (Remote Team Management)",
    whyItMatters: 'Day 1 sets the productivity ceiling for week 4. AI-native onboarding compresses time-to-productive.',
  },
  {
    id: 'onboard-2',
    stage: 'onboard',
    order: 2,
    text: 'Is the 30-day plan documented in three phases: context, ownership, expand or adjust?',
    source: "Michael Batko (principle 5) + James MacDonald (30-day Playbook, Chapter 8)",
    whyItMatters: 'Unstructured onboarding loses 30 to 60 days. The three-phase arc forces clarity about what changes when.',
  },
  {
    id: 'onboard-3',
    stage: 'onboard',
    order: 3,
    text: 'Is the manager check-in cadence structured (async daily for information, sync weekly for relationship)?',
    source: "Michael Batko (principle 8)",
    whyItMatters: 'Without structure, check-ins drift into status updates AI already delivers. Sync time is for relationships.',
  },
  {
    id: 'onboard-4',
    stage: 'onboard',
    order: 4,
    text: 'Have you defined the 14-day early-warning signal that triggers intervention if missing?',
    source: "Michael Batko (principle 6) + James MacDonald",
    whyItMatters: 'The 30-day review is too late if there is a problem on day 14. The signal is the leading indicator.',
  },
];

// Helper: get all questions for a given stage in order.
export function questionsForStage(stage: string): Question[] {
  return QUESTIONS.filter((q) => q.stage === stage).sort((a, b) => a.order - b.order);
}

// Helper: get a single question by id.
export function questionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
