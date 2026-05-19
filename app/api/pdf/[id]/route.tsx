// GET /api/pdf/[id]?email=optional@example.com
// Renders the 4-page PDF for a diagnostic row. If an email query param is
// present and the row has none, save it so we know the user requested the PDF.

import { renderToBuffer } from '@react-pdf/renderer';
import DiagnosticPDF from '@/components/pdf/DiagnosticPDF';
import { getSupabase } from '@/lib/supabase';
import { recommendationById } from '@/lib/recommendations';
import { artefactById } from '@/lib/artefacts';

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

  const rec = recommendationById(data.recommendation_id);
  const artefact = rec ? artefactById(rec.artefactId) : undefined;

  if (!rec || !artefact) {
    return new Response(
      JSON.stringify({ error: 'Recommendation or artefact missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const buffer = await renderToBuffer(
    <DiagnosticPDF row={data} recommendation={rec} artefact={artefact} />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="hiring-diagnostic-${id.slice(0, 8)}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
