// POST /api/diagnostic/contribute
// Marks a diagnostic row as contributed to the public library.
// Optionally sets the self-reported sector.
// PII (email, role_title) stays in the row but is excluded from the
// public_library view.

import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

type Body = {
  id: string;
  sector?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof body?.id !== 'string' || !body.id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from('diagnostic_results')
    .update({
      contributed_to_library: true,
      sector: body.sector?.trim() || null,
    })
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
