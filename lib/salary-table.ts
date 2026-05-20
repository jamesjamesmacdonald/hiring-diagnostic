// National Australian tech salary bands.
// Each band is the average of up to six 2025-26 Australian salary guides.
// Figures are base salary, AUD, annual. Methodology recorded in NOTES.md.
// low = entry/junior end, median = mid, high = senior end.

export type SalaryBand = {
  role: string;
  low: number;
  median: number;
  high: number;
  guides: number; // how many of the six guides carried this role
};

export const SALARY_TABLE: SalaryBand[] = [
  { role: 'Software Engineer', low: 86000, median: 134000, high: 187000, guides: 6 },
  { role: 'Frontend Engineer', low: 86000, median: 138000, high: 185000, guides: 6 },
  { role: 'Backend Engineer', low: 93000, median: 142000, high: 186000, guides: 6 },
  { role: 'Full Stack Engineer', low: 87000, median: 133000, high: 182000, guides: 6 },
  { role: 'Mobile Engineer', low: 98000, median: 135000, high: 181000, guides: 5 },
  { role: 'DevOps / SRE Engineer', low: 117000, median: 154000, high: 191000, guides: 6 },
  { role: 'Cloud Engineer', low: 118000, median: 165000, high: 180000, guides: 4 },
  { role: 'Data Engineer', low: 114000, median: 148000, high: 186000, guides: 6 },
  { role: 'Data Scientist', low: 124000, median: 152000, high: 190000, guides: 6 },
  { role: 'Machine Learning / AI Engineer', low: 120000, median: 148000, high: 207000, guides: 3 },
  { role: 'Data Analyst', low: 103000, median: 125000, high: 151000, guides: 6 },
  { role: 'Business Analyst', low: 107000, median: 137000, high: 166000, guides: 5 },
  { role: 'QA / Test Engineer', low: 90000, median: 128000, high: 167000, guides: 6 },
  { role: 'Security Engineer', low: 116000, median: 155000, high: 192000, guides: 6 },
  { role: 'Solutions Architect', low: 168000, median: 199000, high: 226000, guides: 6 },
  { role: 'Product Manager', low: 117000, median: 156000, high: 193000, guides: 5 },
  { role: 'Product Designer / UX Designer', low: 102000, median: 134000, high: 181000, guides: 6 },
  { role: 'Tech Lead / Principal Engineer', low: 156000, median: 182000, high: 214000, guides: 6 },
  { role: 'Engineering Manager', low: 154000, median: 195000, high: 238000, guides: 5 },
  { role: 'Engineering Director / VP', low: 188000, median: 229000, high: 296000, guides: 5 },
  { role: 'CTO', low: 186000, median: 243000, high: 365000, guides: 5 },
];

const BAND_BY_ROLE: Record<string, SalaryBand> = Object.fromEntries(
  SALARY_TABLE.map((b) => [b.role, b])
);

// Ordered keyword matchers. First match wins, so the list runs
// most-specific to most-generic. A free-text role title is lowercased
// and tested for any of the keywords.
const MATCHERS: { role: string; keywords: string[] }[] = [
  { role: 'CTO', keywords: ['cto', 'chief technology officer', 'chief technical officer'] },
  {
    role: 'Engineering Director / VP',
    keywords: [
      'vp of engineering', 'vp engineering', 'vp eng', 'head of engineering',
      'engineering director', 'director of engineering',
    ],
  },
  {
    role: 'Engineering Manager',
    keywords: [
      'engineering manager', 'eng manager', 'software development manager',
      'development manager', 'dev manager',
    ],
  },
  {
    role: 'Tech Lead / Principal Engineer',
    keywords: [
      'tech lead', 'technical lead', 'principal engineer', 'staff engineer',
      'team lead', 'lead engineer', 'lead software',
    ],
  },
  {
    role: 'Solutions Architect',
    keywords: [
      'solutions architect', 'solution architect', 'software architect',
      'technical architect', 'enterprise architect', 'architect',
    ],
  },
  {
    role: 'DevOps / SRE Engineer',
    keywords: ['devops', 'dev ops', 'sre', 'site reliability', 'platform engineer'],
  },
  {
    role: 'Machine Learning / AI Engineer',
    keywords: ['machine learning', 'ml engineer', 'ai engineer', 'a.i. engineer'],
  },
  { role: 'Data Engineer', keywords: ['data engineer'] },
  { role: 'Data Scientist', keywords: ['data scientist', 'data science'] },
  { role: 'Data Analyst', keywords: ['data analyst', 'analytics'] },
  { role: 'Business Analyst', keywords: ['business analyst', 'systems analyst'] },
  {
    role: 'QA / Test Engineer',
    keywords: [
      'qa', 'test engineer', 'tester', 'quality assurance', 'test analyst',
      'automation test', 'sdet',
    ],
  },
  {
    role: 'Security Engineer',
    keywords: ['security', 'cyber', 'infosec', 'penetration', 'appsec'],
  },
  { role: 'Cloud Engineer', keywords: ['cloud engineer', 'cloud'] },
  { role: 'Frontend Engineer', keywords: ['frontend', 'front end', 'front-end'] },
  { role: 'Backend Engineer', keywords: ['backend', 'back end', 'back-end'] },
  { role: 'Full Stack Engineer', keywords: ['full stack', 'fullstack', 'full-stack'] },
  {
    role: 'Mobile Engineer',
    keywords: ['mobile', 'ios', 'android', 'react native', 'flutter'],
  },
  {
    role: 'Product Manager',
    keywords: ['product manager', 'product owner', 'product lead', 'head of product'],
  },
  {
    role: 'Product Designer / UX Designer',
    keywords: ['designer', 'ux', 'ui', 'product design'],
  },
  {
    role: 'Software Engineer',
    keywords: ['software engineer', 'developer', 'engineer', 'programmer', 'swe'],
  },
];

// Match a free-text role title to a canonical salary band. Returns null
// when nothing matches (the caller hides the salary callout).
export function matchSalaryBand(roleTitle: string): SalaryBand | null {
  const q = roleTitle.trim().toLowerCase();
  if (!q) return null;
  for (const matcher of MATCHERS) {
    if (matcher.keywords.some((kw) => q.includes(kw))) {
      return BAND_BY_ROLE[matcher.role] ?? null;
    }
  }
  return null;
}
