// National Australian tech salary bands.
// Figures are base salary, AUD, annual. low = entry/junior end,
// median = mid, high = senior end. Methodology recorded in NOTES.md.
//
// basis 'guides': average of up to six 2025-26 Australian salary guides.
// basis 'market': 2025-26 Australian market data from salary aggregators
//   (Glassdoor, ERI SalaryExpert, Jora). Used for newer AI roles the
//   published guides do not yet cover.

export type SalaryBand = {
  role: string;
  low: number;
  median: number;
  high: number;
  basis: 'guides' | 'market';
};

export const SALARY_TABLE: SalaryBand[] = [
  { role: 'Software Engineer', low: 86000, median: 134000, high: 187000, basis: 'guides' },
  { role: 'Frontend Engineer', low: 86000, median: 138000, high: 185000, basis: 'guides' },
  { role: 'Backend Engineer', low: 93000, median: 142000, high: 186000, basis: 'guides' },
  { role: 'Full Stack Engineer', low: 87000, median: 133000, high: 182000, basis: 'guides' },
  { role: 'Mobile Engineer', low: 98000, median: 135000, high: 181000, basis: 'guides' },
  { role: 'DevOps / SRE Engineer', low: 117000, median: 154000, high: 191000, basis: 'guides' },
  { role: 'Cloud Engineer', low: 118000, median: 165000, high: 180000, basis: 'guides' },
  { role: 'Data Engineer', low: 114000, median: 148000, high: 186000, basis: 'guides' },
  { role: 'Data Scientist', low: 124000, median: 152000, high: 190000, basis: 'guides' },
  { role: 'Machine Learning / AI Engineer', low: 120000, median: 148000, high: 207000, basis: 'guides' },
  { role: 'Data Analyst', low: 103000, median: 125000, high: 151000, basis: 'guides' },
  { role: 'Business Analyst', low: 107000, median: 137000, high: 166000, basis: 'guides' },
  { role: 'QA / Test Engineer', low: 90000, median: 128000, high: 167000, basis: 'guides' },
  { role: 'Security Engineer', low: 116000, median: 155000, high: 192000, basis: 'guides' },
  { role: 'Solutions Architect', low: 168000, median: 199000, high: 226000, basis: 'guides' },
  { role: 'Product Manager', low: 117000, median: 156000, high: 193000, basis: 'guides' },
  { role: 'Product Designer / UX Designer', low: 102000, median: 134000, high: 181000, basis: 'guides' },
  { role: 'Tech Lead / Principal Engineer', low: 156000, median: 182000, high: 214000, basis: 'guides' },
  { role: 'Engineering Manager', low: 154000, median: 195000, high: 238000, basis: 'guides' },
  { role: 'Engineering Director / VP', low: 188000, median: 229000, high: 296000, basis: 'guides' },
  { role: 'CTO', low: 186000, median: 243000, high: 365000, basis: 'guides' },
  // AI-specific roles. Newer titles, sourced from market aggregators.
  { role: 'Forward Deployed Engineer', low: 125000, median: 170000, high: 220000, basis: 'market' },
  { role: 'Prompt Engineer', low: 70000, median: 105000, high: 150000, basis: 'market' },
  { role: 'AI Research Scientist', low: 115000, median: 150000, high: 190000, basis: 'market' },
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
    role: 'Forward Deployed Engineer',
    keywords: ['forward deployed', 'forward-deployed'],
  },
  {
    role: 'Prompt Engineer',
    keywords: ['prompt engineer', 'prompt engineering'],
  },
  {
    role: 'AI Research Scientist',
    keywords: [
      'research scientist', 'ai researcher', 'research engineer',
      'applied scientist',
    ],
  },
  {
    role: 'DevOps / SRE Engineer',
    keywords: ['devops', 'dev ops', 'sre', 'site reliability', 'platform engineer'],
  },
  {
    role: 'Machine Learning / AI Engineer',
    keywords: [
      'machine learning', 'ml engineer', 'ai engineer', 'a.i. engineer',
      'applied ai',
    ],
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

// Human-readable source line for a band, for display on the result page.
export function sourceLabel(band: SalaryBand): string {
  return band.basis === 'guides'
    ? 'Averaged across six 2025-26 Australian salary guides.'
    : 'Based on 2025-26 Australian market salary data.';
}
