// Salary data lookup. Backed by a static table averaged from six 2025-26
// Australian tech salary guides (lib/salary-table.ts). National figures.
// Returns null when the role title matches no canonical band.

import type { SalaryData } from './types';
import { matchSalaryBand } from './salary-table';

export async function fetchSalaryData(
  role: string,
  region: string
): Promise<SalaryData | null> {
  const band = matchSalaryBand(role);
  if (!band) return null;
  return {
    role: band.role,
    region,
    median: band.median,
    p25: band.low,
    p75: band.high,
    currency: 'AUD',
    source: 'market-data',
    asOf: '2025-26',
  };
}
