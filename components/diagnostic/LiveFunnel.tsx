'use client';

import type { FunnelStage, StageScore } from '@/lib/types';
import { FUNNEL_STAGES, STAGE_LABELS } from '@/lib/types';

type Props = {
  currentStage: FunnelStage | null;
  stageScores: StageScore[];
};

// Funnel widths per BUILD_SPEC.md Section 8: ALIGN 100%, narrowing 5% per stage.
const WIDTH_PCT = [100, 95, 90, 85, 80];

export default function LiveFunnel({ currentStage, stageScores }: Props) {
  return (
    <aside aria-label="Your hiring funnel">
      <p className="text-eyebrow text-blue uppercase mb-3">Your funnel</p>
      <div className="space-y-2">
        {FUNNEL_STAGES.map((stage, idx) => {
          const isCurrent = stage === currentStage;
          const score = stageScores.find((s) => s.stage === stage)?.score ?? 0;
          return (
            <div
              key={stage}
              style={{ width: `${WIDTH_PCT[idx]}%` }}
              className={[
                'h-11 px-3 flex items-center justify-between text-xs font-bold rounded-r-sm transition border-l-4',
                isCurrent
                  ? 'bg-navy text-white border-gold'
                  : 'bg-grey-light text-navy border-grey-medium',
              ].join(' ')}
            >
              <span>{STAGE_LABELS[stage]}</span>
              <span
                className={
                  isCurrent ? 'text-gold tabular-nums' : 'text-navy tabular-nums'
                }
              >
                {score}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-grey-medium mt-3">Each stage scores 0 to 100.</p>
    </aside>
  );
}
