// GET /api/pdf/[id]?email=optional@example.com
// Renders the full-report PDF (cover, funnel, all five stage fixes).
// If an email query param is present and the row has none, save it.

import { renderToBuffer } from '@react-pdf/renderer';
import DiagnosticPDF, { type StageFix } from '@/components/pdf/DiagnosticPDF';
import { getSupabase } from '@/lib/supabase';
import { recommendationById } from '@/lib/recommendations';
import { artefactById } from '@/lib/artefacts';
import { pickStageRecommendation } from '@/lib/recommendation-picker';
import { FUNNEL_STAGES } from '@/lib/types';
import type { QuestionAnswer } from '@/lib/types';

export const runtime = 'nodejs';

type Params = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const url = new URL(req.url);
  const email = url.searchParams.get('email')?.trim() || null;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('diagnostic_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (email && !data.email) {
    await supabase
      .from('diagnostic_results')
      .update({ email })
      .eq('id', id);
  }

  const answers = (data.answers ?? []) as QuestionAnswer[];
  const worstRec = recommendationById(data.recommendation_id);

  // All five stages, each with a recommendation + artefact, ranked worst-first.
  const fixes: StageFix[] = FUNNEL_STAGES.map((stage) => {
    const score = (data[`${stage}_score`] as number) ?? 0;
    const isWorstLeak = stage === data.worst_leak;
    const rec =
      isWorstLeak && worstRec
        ? worstRec
        : pickStageRecommendation(stage, answers);
    return {
      stage,
      score,
      isWorstLeak,
      recommendation: rec,
      artefact: artefactById(rec.artefactId) ?? null,
    };
  }).sort((a, b) => a.score - b.score);

  const buffer = await renderToBuffer(
    <DiagnosticPDF row={data} fixes={fixes} />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="hiring-funnel-report-${id.slice(0, 8)}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
