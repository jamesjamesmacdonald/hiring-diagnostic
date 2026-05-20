// Salary data API wrapper.
// Returns null when the API key is missing or the call fails. Callers
// should treat null as "data not available, show the fallback notice".
// The salary band is moving to a built-in averaged table; this wrapper
// stays as an optional override if a live source is configured later.

import type { SalaryData } from './types';

const TIMEOUT_MS = 5000;

export async function fetchSalaryData(
  role: string,
  region: string
): Promise<SalaryData | null> {
  const baseUrl = process.env.SALARY_API_URL;
  const apiKey = process.env.SALARY_API_KEY;

  if (!baseUrl || !apiKey || !role.trim() || !region.trim()) {
    return null;
  }

  const url = `${baseUrl.replace(/\/$/, '')}/salary/lookup?role=${encodeURIComponent(role)}&region=${encodeURIComponent(region)}`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Partial<SalaryData>;
    if (
      typeof json?.median !== 'number' ||
      typeof json?.p25 !== 'number' ||
      typeof json?.p75 !== 'number'
    ) {
      return null;
    }
    return {
      role: typeof json.role === 'string' ? json.role : role,
      region: typeof json.region === 'string' ? json.region : region,
      median: json.median,
      p25: json.p25,
      p75: json.p75,
      currency: 'AUD',
      source: 'market-data',
      asOf: typeof json.asOf === 'string' ? json.asOf : '',
      sampleSize:
        typeof json.sampleSize === 'number' ? json.sampleSize : undefined,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
