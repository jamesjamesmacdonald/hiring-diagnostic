'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  COMPANY_STAGE_LABELS,
  FUNNEL_STAGES,
  REGION_LABELS,
  ROLE_TYPE_LABELS,
  STAGE_LABELS,
} from '@/lib/types';

const FILTERS: {
  key: string;
  label: string;
  options: [string, string][];
}[] = [
  {
    key: 'stage',
    label: 'Company stage',
    options: Object.entries(COMPANY_STAGE_LABELS),
  },
  {
    key: 'role',
    label: 'Role type',
    options: Object.entries(ROLE_TYPE_LABELS),
  },
  {
    key: 'region',
    label: 'Region',
    options: Object.entries(REGION_LABELS),
  },
  {
    key: 'worst',
    label: 'Worst leak',
    options: FUNNEL_STAGES.map((s) => [s, STAGE_LABELS[s]] as [string, string]),
  },
];

export default function LibraryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  function update(key: string, value: string) {
    const p = new URLSearchParams(search.toString());
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters = FILTERS.some((f) => search.get(f.key));

  return (
    <div className="mb-8 p-4 bg-grey-light rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {FILTERS.map((f) => {
          const value = search.get(f.key) ?? '';
          return (
            <div key={f.key}>
              <label className="block text-xs font-bold text-navy uppercase mb-1">
                {f.label}
              </label>
              <select
                value={value}
                onChange={(e) => update(f.key, e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-grey-medium rounded bg-white focus:outline-none focus:border-blue"
              >
                <option value="">All</option>
                {f.options.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="mt-3 text-xs text-blue underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
