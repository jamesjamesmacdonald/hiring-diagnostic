// Picks a recommendation ID for a worst-leak stage using Claude.
// Always returns a valid ID from the library; never throws.
// Falls back to first recommendation for the stage if Claude is unavailable
// or returns an unrecognised id.

import {
  getAnthropic,
  MODEL,
  parseJsonFromClaude,
  textFromMessage,
} from './claude';
import { questionsForStage } from './questions';
import { recommendationsForStage } from './recommendations';
import { RESPONSE_OPTIONS } from './types';
import type { FunnelStage, QuestionAnswer, Recommendation } from './types';

export type PickResult = {
  selectedRecommendationId: string;
  reasoning: string;
};

const RESPONSE_LABEL: Record<string, string> = Object.fromEntries(
  RESPONSE_OPTIONS.map((o) => [o.value, o.label])
);

function buildSystemPrompt(
  stage: FunnelStage,
  answers: QuestionAnswer[]
): string {
  const recs = recommendationsForStage(stage);
  const questions = questionsForStage(stage);
  const answersByQ = Object.fromEntries(
    answers.map((a) => [a.questionId, a])
  );

  const recList = recs
    .map(
      (r, idx) =>
        `[${idx + 1}] id: "${r.id}"\n    headline: ${r.headline}\n    trigger: ${r.triggerPattern}`
    )
    .join('\n\n');

  const answerList = questions
    .map((q) => {
      const a = answersByQ[q.id];
      const label = a ? RESPONSE_LABEL[a.response] : 'not answered';
      return `${q.id}: ${q.text}\n  user response: ${label}`;
    })
    .join('\n');

  return `You select recommendations for the Hiring Funnel Diagnostic. The user completed the diagnostic. You receive their worst-leak stage and their four answers for that stage. Pick the single best-fit recommendation from the library below.

RECOMMENDATION PATTERNS FOR ${stage.toUpperCase()}:
${recList}

USER'S ANSWERS FOR ${stage.toUpperCase()}:
${answerList}

OUTPUT (JSON only, no prose, no markdown code fences):
{
  "selectedRecommendationId": "id from the library above",
  "reasoning": "one sentence on why this pattern matches"
}

Do not generate new recommendation text. Pick from the IDs provided.`;
}

export async function pickRecommendation(
  stage: FunnelStage,
  answers: QuestionAnswer[]
): Promise<PickResult> {
  const recs = recommendationsForStage(stage);
  if (recs.length === 0) {
    throw new Error(`No recommendations for stage ${stage}`);
  }
  const validIds = new Set(recs.map((r) => r.id));
  const fallbackId = recs[0].id;

  try {
    const msg = await getAnthropic().messages.create({
      model: MODEL,
      max_tokens: 300,
      system: buildSystemPrompt(stage, answers),
      messages: [{ role: 'user', content: 'Pick the recommendation.' }],
    });
    const text = textFromMessage(msg);
    const parsed = parseJsonFromClaude<Partial<PickResult>>(text);
    if (
      parsed?.selectedRecommendationId &&
      validIds.has(parsed.selectedRecommendationId)
    ) {
      return {
        selectedRecommendationId: parsed.selectedRecommendationId,
        reasoning:
          typeof parsed.reasoning === 'string' ? parsed.reasoning : '',
      };
    }
    return {
      selectedRecommendationId: fallbackId,
      reasoning: 'Default match (AI returned no usable id).',
    };
  } catch {
    return {
      selectedRecommendationId: fallbackId,
      reasoning: 'Default match (AI unavailable).',
    };
  }
}

// Deterministic per-stage recommendation pick. No Claude call.
// Used for the non-worst stages on the result page, where a fast,
// stable pick is enough. Picks the recommendation whose trigger
// questions the user scored lowest on; falls back to the first.
export function pickStageRecommendation(
  stage: FunnelStage,
  answers: QuestionAnswer[]
): Recommendation {
  const recs = recommendationsForStage(stage);
  const lowScored = new Set(
    answers
      .filter((a) => a.response === 'no' || a.response === 'partial')
      .map((a) => a.questionId)
  );
  let best = recs[0];
  let bestCount = -1;
  for (const rec of recs) {
    const ids =
      rec.triggerPattern.match(
        /(?:align|attract|assess|close|onboard)-\d/g
      ) ?? [];
    const count = ids.filter((qid) => lowScored.has(qid)).length;
    if (count > bestCount) {
      bestCount = count;
      best = rec;
    }
  }
  return best;
}
