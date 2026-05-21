// POST /api/diagnostic/email
// Saves the user's email on a diagnostic row. Used by the result page when
// the user unlocks the advice for their other leaks.

import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

type Body = { id: string; email: string };

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
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from('diagnostic_results')
    .update({ email })
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
