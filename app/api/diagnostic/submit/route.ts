// POST /api/diagnostic/submit
// Saves a completed diagnostic to Supabase and returns the row id.
// Day 6: rule-based recommendation pick (first for worst-leak stage).
// Day 7 swaps this for a Claude-based selector.

import { NextResponse } from 'next/server';
import type {
  DiagnosticContext,
  FunnelStage,
  QuestionAnswer,
  Response,
} from '@/lib/types';
import { RESPONSE_SCORES } from '@/lib/types';
import { QUESTIONS } from '@/lib/questions';
import { recommendationsForStage } from '@/lib/recommendations';
import { buildStageScores, worstLeak } from '@/lib/scoring';
import { getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

const QUESTION_TO_STAGE: Record<string, FunnelStage> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q.stage])
);

const VALID_RESPONSES = new Set<Response>([
  'no',
  'partial',
  'mostly',
  'yes-documented',
]);

type SubmitBody = {
  context: DiagnosticContext;
  answers: { questionId: string; response: Response }[];
  forcingPrompt?: string;
  email?: string;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON');
  }

  const { context, answers } = body ?? {};
  if (!context || !Array.isArray(answers)) {
    return badRequest('Missing context or answers');
  }
  if (!context.stage || !context.roleType || !context.region) {
    return badRequest('Context is missing required fields');
  }
  for (const a of answers) {
    if (!a?.questionId || !VALID_RESPONSES.has(a.response)) {
      return badRequest(`Invalid answer for ${a?.questionId}`);
    }
    if (!QUESTION_TO_STAGE[a.questionId]) {
      return badRequest(`Unknown questionId ${a.questionId}`);
    }
  }

  const fullAnswers: QuestionAnswer[] = answers.map((a) => ({
    questionId: a.questionId,
    response: a.response,
    score: RESPONSE_SCORES[a.response],
  }));

  const stageScores = buildStageScores(fullAnswers, QUESTION_TO_STAGE);
  const worst = worstLeak(stageScores);

  const rec = recommendationsForStage(worst.stage)[0];
  if (!rec) {
    return NextResponse.json(
      { error: `No recommendation for stage ${worst.stage}` },
      { status: 500 }
    );
  }

  const scoreFor = (stage: FunnelStage) =>
    stageScores.find((s) => s.stage === stage)?.score ?? 0;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('diagnostic_results')
    .insert({
      company_stage: context.stage,
      role_type: context.roleType,
      region: context.region,
      role_title: context.roleTitle ?? null,
      align_score: scoreFor('align'),
      attract_score: scoreFor('attract'),
      assess_score: scoreFor('assess'),
      close_score: scoreFor('close'),
      onboard_score: scoreFor('onboard'),
      worst_leak: worst.stage,
      recommendation_id: rec.id,
      forcing_prompt: body.forcingPrompt ?? null,
      answers: fullAnswers,
      email: body.email ?? null,
      contributed_to_library: false,
    })
    .select('id')
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Insert failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id as string });
}
