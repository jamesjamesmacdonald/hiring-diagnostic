'use client';

import { useState } from 'react';
import type { FunnelStage, QuestionAnswer, StageScore } from '@/lib/types';
import {
  FUNNEL_STAGES,
  RESPONSE_OPTIONS,
  STAGE_DESCRIPTIONS,
  STAGE_LABELS,
} from '@/lib/types';
import { questionsForStage } from '@/lib/questions';

type Props = {
  stageScores: StageScore[];
  answers?: QuestionAnswer[];
};

// Funnel widths per BUILD_SPEC.md Section 8: ALIGN 100%, narrowing 5% per stage.
const WIDTH_PCT = [100, 95, 90, 85, 80];

// Status background colour classes. Listed as literals so Tailwind keeps them.
const STATUS_BG: Record<StageScore['status'], string> = {
  tight: 'bg-status-tight',
  functional: 'bg-status-functional',
  leaking: 'bg-status-leaking',
  broken: 'bg-status-broken',
};

const RESPONSE_LABEL: Record<string, string> = Object.fromEntries(
  RESPONSE_OPTIONS.map((o) => [o.value, o.label])
);

export default function FunnelVisual({ stageScores, answers = [] }: Props) {
  const [expanded, setExpanded] = useState<FunnelStage | null>(null);

  return (
    <div className="w-full">
      {FUNNEL_STAGES.map((stage, idx) => {
        const score = stageScores.find((s) => s.stage === stage);
        if (!score) return null;
        const isWorst = score.isWorstLeak;
        const isExpanded = expanded === stage;

        return (
          <div key={stage} className="mb-3">
            <button
              type="button"
              onClick={() => setExpanded(isExpanded ? null : stage)}
              style={{ width: `${WIDTH_PCT[idx]}%` }}
              className={[
                'block text-left h-[60px] md:h-[80px] pl-4 pr-5 rounded-r-md transition cursor-pointer text-white hover:opacity-95',
                STATUS_BG[score.status],
                isWorst
                  ? 'border-l-8 border-gold'
                  : 'border-l-2 border-transparent',
              ].join(' ')}
              aria-expanded={isExpanded}
              aria-controls={`stage-detail-${stage}`}
            >
              <div className="flex items-center justify-between h-full gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-lg md:text-xl truncate">
                    {STAGE_LABELS[stage]}
                  </span>
                  <span className="text-xs opacity-90 hidden md:block truncate">
                    {STAGE_DESCRIPTIONS[stage]}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-2xl md:text-3xl font-bold tabular-nums">
                    {score.score}
                  </span>
                  {isWorst && (
                    <span className="hidden md:inline-block text-xs font-bold bg-gold text-navy px-2 py-1 rounded">
                      &#9733; WORST LEAK
                    </span>
                  )}
                </div>
              </div>
            </button>
            {isWorst && (
              <span className="md:hidden inline-block text-xs font-bold bg-gold text-navy px-2 py-1 rounded mt-1 ml-2">
                &#9733; WORST LEAK
              </span>
            )}
            {isExpanded && (
              <ExpandedStage
                stage={stage}
                answers={answers}
                id={`stage-detail-${stage}`}
              />
            )}
          </div>
        );
      })}
      <p className="text-xs text-grey-medium mt-4">
        Click any stage to see your responses.
      </p>
    </div>
  );
}

function ExpandedStage({
  stage,
  answers,
  id,
}: {
  stage: FunnelStage;
  answers: QuestionAnswer[];
  id: string;
}) {
  const questions = questionsForStage(stage);
  const answerByQuestion = Object.fromEntries(
    answers.map((a) => [a.questionId, a])
  );
  return (
    <div id={id} className="mt-2 p-4 bg-grey-light rounded-md">
      <p className="text-xs font-bold text-blue uppercase mb-3">
        Your responses for {STAGE_LABELS[stage]}
      </p>
      <ul className="space-y-3">
        {questions.map((q) => {
          const a = answerByQuestion[q.id];
          return (
            <li key={q.id}>
              <p className="text-sm text-black mb-1">{q.text}</p>
              <p className="text-xs text-navy font-bold">
                {a ? RESPONSE_LABEL[a.response] : 'Not answered'}
                {a && ` (+${a.score})`}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
