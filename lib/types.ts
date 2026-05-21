// TypeScript types for the Hiring Funnel Diagnostic
// Imported by every other lib file and by all components.

export type Stage = 'pre-seed' | 'seed' | 'series-a' | 'series-b-plus';
export type RoleType = 'engineer' | 'product' | 'gtm' | 'ops' | 'leadership' | 'other';
export type Region = 'sydney' | 'melbourne' | 'brisbane' | 'other-au';
export type Response = 'no' | 'partial' | 'mostly' | 'yes-documented';
export type FunnelStage = 'align' | 'attract' | 'assess' | 'close' | 'onboard';
export type StageStatus = 'tight' | 'functional' | 'leaking' | 'broken';

export interface DiagnosticContext {
  stage: Stage;
  roleType: RoleType;
  region: Region;
  roleTitle?: string; // Free text. Used for salary lookup in CLOSE.
}

export interface QuestionAnswer {
  questionId: string;
  response: Response;
  score: number; // 0, 8, 17, or 25
}

export interface StageScore {
  stage: FunnelStage;
  score: number; // 0-100
  status: StageStatus;
  isWorstLeak: boolean;
}

export interface SalaryData {
  role: string;
  region: string;
  median: number;
  p25: number;
  p75: number;
  currency: 'AUD';
  source: string; // human-readable source line, shown on the result page
  asOf: string;
  sampleSize?: number;
}

export interface DiagnosticResult {
  id: string;
  context: DiagnosticContext;
  answers: QuestionAnswer[];
  forcingPrompt: string;
  stageScores: StageScore[];
  worstLeak: StageScore;
  recommendationId: string;
  salaryData?: SalaryData;
  email?: string;
  contributedToLibrary: boolean;
  createdAt: string;
}

export interface LibraryEntry {
  id: string;
  context: Omit<DiagnosticContext, 'roleTitle'>; // No PII
  stageScores: StageScore[];
  worstLeak: FunnelStage;
  sector?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  stage: FunnelStage;
  order: number;
  text: string;
  source: string;
  whyItMatters: string;
}

export interface Recommendation {
  id: string;
  stage: FunnelStage;
  triggerPattern: string;
  headline: string;
  fixScript: string;
  artefactId: string;
  source: string;
}

export interface Artefact {
  id: string;
  title: string;
  content: string; // Markdown
}

// Response option labels for UI rendering
export const RESPONSE_OPTIONS: { value: Response; label: string; description: string }[] = [
  { value: 'no', label: 'No', description: 'Not done. Or done in a way that does not count.' },
  { value: 'partial', label: 'Partial', description: 'Started or attempted. Not enough to call it a process.' },
  { value: 'mostly', label: 'Mostly', description: 'Has the elements. Not documented in a place anyone could find.' },
  { value: 'yes-documented', label: 'Yes, documented', description: 'Process exists. Documented. Repeatable by someone other than you.' },
];

// Scoring map per response
export const RESPONSE_SCORES: Record<Response, number> = {
  'no': 0,
  'partial': 8,
  'mostly': 17,
  'yes-documented': 25,
};

// Stage display order in the funnel
export const FUNNEL_STAGES: FunnelStage[] = ['align', 'attract', 'assess', 'close', 'onboard'];

// Display labels for stages
export const STAGE_LABELS: Record<FunnelStage, string> = {
  'align': 'ALIGN',
  'attract': 'ATTRACT',
  'assess': 'ASSESS',
  'close': 'CLOSE',
  'onboard': 'ONBOARD',
};

// Stage descriptions for UI
export const STAGE_DESCRIPTIONS: Record<FunnelStage, string> = {
  'align': 'Do you need this hire and what does it solve?',
  'attract': 'Are the right people seeing this role?',
  'assess': 'Can you tell signal from noise in interviews?',
  'close': 'Do they say yes when you offer?',
  'onboard': 'Are they productive in 30 days?',
};

// Display labels for stages of company
export const COMPANY_STAGE_LABELS: Record<Stage, string> = {
  'pre-seed': 'Pre-seed',
  'seed': 'Seed',
  'series-a': 'Series A',
  'series-b-plus': 'Series B or later',
};

export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  'engineer': 'Engineer',
  'product': 'Product',
  'gtm': 'Go-to-market (sales, marketing, growth)',
  'ops': 'Operations',
  'leadership': 'Leadership / management',
  'other': 'Other',
};

export const REGION_LABELS: Record<Region, string> = {
  'sydney': 'Sydney',
  'melbourne': 'Melbourne',
  'brisbane': 'Brisbane',
  'other-au': 'Other Australia',
};
