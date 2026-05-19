// POST /api/coaching/recommendation
// Selects a recommendation id for the user's worst-leak stage.
// Body: { stage: FunnelStage, answers: { questionId, response }[] }

import { NextResponse } from 'next/server';
import { pickRecommendation } from '@/lib/recommendation-picker';
import { FUNNEL_STAGES, RESPONSE_SCORES } from '@/lib/types';
import type { FunnelStage, QuestionAnswer, Response } from '@/lib/types';

export const runtime = 'nodejs';

type Body = {
  stage: FunnelStage;
  answers: { questionId: string; response: Response }[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!FUNNEL_STAGES.includes(body?.stage)) {
    return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
  }
  if (!Array.isArray(body.answers)) {
    return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
  }

  const fullAnswers: QuestionAnswer[] = body.answers.map((a) => ({
    questionId: a.questionId,
    response: a.response,
    score: RESPONSE_SCORES[a.response] ?? 0,
  }));

  const result = await pickRecommendation(body.stage, fullAnswers);
  return NextResponse.json(result);
}
