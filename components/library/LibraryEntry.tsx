// Single library entry card. Compact funnel visualisation inline.

import type { FunnelStage, Region, RoleType, Stage } from '@/lib/types';
import {
  COMPANY_STAGE_LABELS,
  FUNNEL_STAGES,
  REGION_LABELS,
  ROLE_TYPE_LABELS,
  STAGE_LABELS,
} from '@/lib/types';

export type LibraryRow = {
  id: string;
  company_stage: Stage;
  role_type: RoleType;
  region: Region;
  align_score: number;
  attract_score: number;
  assess_score: number;
  close_score: number;
  onboard_score: number;
  worst_leak: FunnelStage;
  sector: string | null;
  created_at: string;
};

const STATUS_BG = {
  tight: 'bg-status-tight',
  functional: 'bg-status-functional',
  leaking: 'bg-status-leaking',
  broken: 'bg-status-broken',
};

const WIDTH_PCT = [100, 95, 90, 85, 80];

function statusFor(score: number): keyof typeof STATUS_BG {
  if (score >= 80) return 'tight';
  if (score >= 60) return 'functional';
  if (score >= 40) return 'leaking';
  return 'broken';
}

export default function LibraryEntry({ row }: { row: LibraryRow }) {
  const date = new Date(row.created_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="p-4 border border-grey-medium rounded-md bg-white">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <p className="text-sm font-bold text-navy truncate">
          {COMPANY_STAGE_LABELS[row.company_stage]} ·{' '}
          {ROLE_TYPE_LABELS[row.role_type]}
        </p>
        <p className="text-xs text-grey-medium flex-shrink-0">{date}</p>
      </div>
      <p className="text-xs text-grey-medium mb-3">
        {REGION_LABELS[row.region]}
        {row.sector ? ` · ${row.sector}` : ''}
      </p>
      <div className="mb-3">
        {FUNNEL_STAGES.map((stage, idx) => {
          const score = row[
            `${stage}_score` as keyof LibraryRow
          ] as number;
          const isWorst = stage === row.worst_leak;
          return (
            <div
              key={stage}
              style={{ width: `${WIDTH_PCT[idx]}%` }}
              className={[
                'h-5 mb-0.5 pl-2 pr-2 flex items-center justify-between text-[10px] text-white font-bold rounded-r-sm border-l-2',
                STATUS_BG[statusFor(score)],
                isWorst ? 'border-gold' : 'border-transparent',
              ].join(' ')}
            >
              <span>{STAGE_LABELS[stage]}</span>
              <span className="tabular-nums">{score}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-navy">
        <span className="font-bold">Worst leak:</span>{' '}
        {STAGE_LABELS[row.worst_leak]}
      </p>
    </article>
  );
}
