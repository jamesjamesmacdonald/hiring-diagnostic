'use client';

import { useEffect, useState } from 'react';
import {
  COMPANY_STAGE_LABELS,
  RESPONSE_OPTIONS,
  type Response,
  type Stage,
} from '@/lib/types';

type Benchmark = { response: string; percentage: number };

type Props = {
  stage: Stage;
  role: string;
  questionId: string;
  selectedResponse: Response | null;
};

const RESPONSE_LABEL: Record<string, string> = Object.fromEntries(
  RESPONSE_OPTIONS.map((o) => [o.value, o.label])
);

export default function PeerBenchmark({
  stage,
  role,
  questionId,
  selectedResponse,
}: Props) {
  const [data, setData] = useState<Benchmark[] | null>(null);

  useEffect(() => {
    if (!selectedResponse) return;
    let cancelled = false;
    const url = `/api/peer-benchmark?stage=${encodeURIComponent(stage)}&role=${encodeURIComponent(role)}&questionId=${encodeURIComponent(questionId)}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Benchmark[]) => {
        if (!cancelled) setData(Array.isArray(d) ? d : []);
      })
      .catch(() => {
        if (!cancelled) setData([]);
      });
    return () => {
      cancelled = true;
    };
  }, [stage, role, questionId, selectedResponse]);

  if (!selectedResponse || !data || data.length === 0) return null;

  const match = data.find((d) => d.response === selectedResponse);
  if (!match) return null;

  const stageLabel = COMPANY_STAGE_LABELS[stage] ?? stage;
  const responseLabel = RESPONSE_LABEL[selectedResponse] ?? selectedResponse;

  return (
    <p className="text-xs text-blue mt-3">
      {Math.round(match.percentage)}% of {stageLabel}-stage founders also
      answered &quot;{responseLabel}&quot; here.
    </p>
  );
}
