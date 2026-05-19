// Result page. Reads diagnostic row from Supabase by id and renders:
// - Header with context line
// - FunnelVisual with worst-leak treatment
// - Recommendation headline + fix script
// - Artefact block with copy-to-clipboard
// Day 8 adds PDFDownload. Day 10 adds LibraryUnlock. Day 9 adds salary callout.

import { notFound } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { recommendationById } from '@/lib/recommendations';
import { artefactById } from '@/lib/artefacts';
import { stageStatus } from '@/lib/scoring';
import {
  COMPANY_STAGE_LABELS,
  FUNNEL_STAGES,
  REGION_LABELS,
  ROLE_TYPE_LABELS,
  STAGE_LABELS,
} from '@/lib/types';
import type {
  FunnelStage,
  QuestionAnswer,
  Region,
  RoleType,
  Stage,
  StageScore,
} from '@/lib/types';
import FunnelVisual from '@/components/result/FunnelVisual';
import RecommendationBlock from '@/components/result/Recommendation';
import ArtefactBlock from '@/components/result/ArtefactBlock';
import PDFDownload from '@/components/result/PDFDownload';
import SalaryCallout from '@/components/result/SalaryCallout';
import LibraryUnlock from '@/components/result/LibraryUnlock';
import NTPCallout, { ntpCtaFor } from '@/components/result/NTPCallout';
import { fetchSalaryData } from '@/lib/salary';

type DiagnosticRow = {
  id: string;
  company_stage: Stage;
  role_type: RoleType;
  region: Region;
  role_title: string | null;
  align_score: number;
  attract_score: number;
  assess_score: number;
  close_score: number;
  onboard_score: number;
  worst_leak: FunnelStage;
  recommendation_id: string;
  forcing_prompt: string | null;
  answers: QuestionAnswer[];
  created_at: string;
};

type Params = Promise<{ id: string }>;

export const dynamic = 'force-dynamic';

export default async function ResultPage({ params }: { params: Params }) {
  const { id } = await params;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('diagnostic_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }
  const r = data as DiagnosticRow;

  const stageScores: StageScore[] = FUNNEL_STAGES.map((stage) => {
    const score = (r[
      `${stage}_score` as keyof DiagnosticRow
    ] as number) ?? 0;
    return {
      stage,
      score,
      status: stageStatus(score),
      isWorstLeak: stage === r.worst_leak,
    };
  });

  const rec = recommendationById(r.recommendation_id);
  const artefact = rec ? artefactById(rec.artefactId) : undefined;

  // Salary data: only relevant when the user gave a role title and CLOSE is
  // the worst leak. Otherwise we do not surface it.
  const showSalary = r.worst_leak === 'close' && Boolean(r.role_title);
  const salaryData = showSalary
    ? await fetchSalaryData(r.role_title ?? '', r.region)
    : null;

  const dateLabel = new Date(r.created_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const contextLine = [
    COMPANY_STAGE_LABELS[r.company_stage],
    ROLE_TYPE_LABELS[r.role_type],
    REGION_LABELS[r.region],
    dateLabel,
  ].join(' · ');

  const worstScore =
    (r[`${r.worst_leak}_score` as keyof DiagnosticRow] as number) ?? 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-page mx-auto px-6 py-10">
        <p className="text-eyebrow text-blue uppercase mb-2">
          The Hiring Funnel Diagnostic
        </p>
        <p className="text-sm text-grey-medium mb-8">{contextLine}</p>

        <FunnelVisual stageScores={stageScores} answers={r.answers} />

        <div className="mt-12 mb-8">
          <p className="text-eyebrow text-blue uppercase mb-2">
            Your worst leak
          </p>
          <h2 className="text-3xl font-bold text-navy mb-1">
            {STAGE_LABELS[r.worst_leak]}
          </h2>
          <p className="text-base text-black">
            You scored {worstScore} out of 100.
          </p>
        </div>

        {rec ? (
          <RecommendationBlock recommendation={rec} />
        ) : (
          <p className="text-status-leaking mb-8">
            Recommendation not found for id {r.recommendation_id}.
          </p>
        )}

        {showSalary && (
          <SalaryCallout
            data={salaryData}
            role={r.role_title ?? ''}
            region={r.region}
          />
        )}

        {artefact && <ArtefactBlock artefact={artefact} />}

        <PDFDownload resultId={r.id} />

        <LibraryUnlock resultId={r.id} />

        {(() => {
          const cta = ntpCtaFor(r.company_stage, worstScore);
          return cta ? <NTPCallout cta={cta} /> : null;
        })()}

        <hr className="my-10 border-grey-light" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-grey-medium">
            Want to run this for a different role? Re-take in 7 minutes.
          </p>
          <a
            href="/diagnostic"
            className="px-4 py-2 text-navy font-bold border border-navy rounded-md hover:bg-grey-light transition"
          >
            Run it again
          </a>
        </div>
      </div>
    </main>
  );
}
