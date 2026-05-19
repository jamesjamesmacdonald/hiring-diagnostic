// Public library. Reads from the public_library view in Supabase.
// Filters by stage, role, region, worst leak via URL search params.

import { getSupabase } from '@/lib/supabase';
import {
  FUNNEL_STAGES,
  COMPANY_STAGE_LABELS,
  ROLE_TYPE_LABELS,
  REGION_LABELS,
} from '@/lib/types';
import LibraryFilters from '@/components/library/LibraryFilters';
import LibraryEntry, {
  type LibraryRow,
} from '@/components/library/LibraryEntry';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 60;

type SearchParams = Promise<{
  stage?: string;
  role?: string;
  region?: string;
  worst?: string;
}>;

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = getSupabase();

  let query = supabase
    .from('public_library')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (params.stage && params.stage in COMPANY_STAGE_LABELS) {
    query = query.eq('company_stage', params.stage);
  }
  if (params.role && params.role in ROLE_TYPE_LABELS) {
    query = query.eq('role_type', params.role);
  }
  if (params.region && params.region in REGION_LABELS) {
    query = query.eq('region', params.region);
  }
  if (params.worst && FUNNEL_STAGES.includes(params.worst as never)) {
    query = query.eq('worst_leak', params.worst);
  }

  const { data, error } = await query;
  const rows = (data ?? []) as LibraryRow[];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-page mx-auto px-6 py-10">
        <p className="text-eyebrow text-blue uppercase mb-2">
          Building Tech Teams
        </p>
        <h1 className="text-4xl font-bold text-navy mb-2">
          The public library
        </h1>
        <p className="text-base text-black mb-8">
          Every funnel here was contributed by a founder who ran the
          diagnostic. No names. No companies. Just the pattern.
        </p>

        <LibraryFilters />

        {error && (
          <p className="text-sm text-status-leaking mb-4">
            Could not load library. {error.message}
          </p>
        )}

        {rows.length === 0 ? (
          <p className="text-sm text-grey-medium">
            No matching entries yet. Adjust the filters or run the{' '}
            <a href="/diagnostic" className="text-blue underline">
              diagnostic
            </a>{' '}
            and contribute the first one.
          </p>
        ) : (
          <>
            <p className="text-xs text-grey-medium mb-4">
              Showing {rows.length} most recent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((row) => (
                <LibraryEntry key={row.id} row={row} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
