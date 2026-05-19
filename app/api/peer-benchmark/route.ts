// GET /api/peer-benchmark?stage=&role=&questionId=
// Wraps get_peer_benchmark() RPC. Returns [] if the function returns nothing
// (the function itself returns empty when n < 5, per BUILD_SPEC.md Section 15).

import { getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const stage = url.searchParams.get('stage') ?? '';
  const role = url.searchParams.get('role') ?? '';
  const questionId = url.searchParams.get('questionId') ?? '';

  if (!stage || !role || !questionId) {
    return Response.json([]);
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('get_peer_benchmark', {
    p_company_stage: stage,
    p_role_type: role,
    p_question_id: questionId,
  });

  if (error) {
    return Response.json([]);
  }
  return Response.json(data ?? []);
}
