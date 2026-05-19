// Scoring math for the Hiring Funnel Diagnostic.

import type {
  QuestionAnswer,
  StageScore,
  FunnelStage,
  Response,
  StageStatus,
} from './types';
import { RESPONSE_SCORES, FUNNEL_STAGES } from './types';

/**
 * Score a single response.
 * No = 0, Partial = 8, Mostly = 17, Yes (documented) = 25.
 */
export function scoreResponse(response: Response): number {
  return RESPONSE_SCORES[response];
}

/**
 * Sum the four answers for a stage to produce a 0-100 score.
 */
export function scoreStage(answers: QuestionAnswer[]): number {
  return answers.reduce((sum, a) => sum + a.score, 0);
}

/**
 * Map a 0-100 stage score to a status label.
 */
export function stageStatus(score: number): StageStatus {
  if (score >= 80) return 'tight';
  if (score >= 60) return 'functional';
  if (score >= 40) return 'leaking';
  return 'broken';
}

/**
 * Build the array of StageScore objects from a flat set of answers.
 * Answers are grouped by stage and scored. The worst-leak flag is set on the lowest-scoring stage.
 * Ties are broken by funnel order (earlier stages win ties, since fixing upstream leaks unblocks downstream).
 */
export function buildStageScores(
  answers: QuestionAnswer[],
  answersToStage: Record<string, FunnelStage>
): StageScore[] {
  // Group answers by stage.
  const grouped: Record<FunnelStage, QuestionAnswer[]> = {
    align: [],
    attract: [],
    assess: [],
    close: [],
    onboard: [],
  };

  for (const answer of answers) {
    const stage = answersToStage[answer.questionId];
    if (stage) {
      grouped[stage].push(answer);
    }
  }

  // Score each stage.
  const scores: StageScore[] = FUNNEL_STAGES.map((stage) => {
    const score = scoreStage(grouped[stage]);
    return {
      stage,
      score,
      status: stageStatus(score),
      isWorstLeak: false,
    };
  });

  // Identify worst leak.
  let worstIdx = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i].score < scores[worstIdx].score) {
      worstIdx = i;
    }
    // Tie: keep earlier index (already preserved by strict less-than).
  }
  scores[worstIdx].isWorstLeak = true;

  return scores;
}

/**
 * Find the worst-leak stage from a set of scores.
 */
export function worstLeak(stageScores: StageScore[]): StageScore {
  return stageScores.find((s) => s.isWorstLeak) ?? stageScores[0];
}
