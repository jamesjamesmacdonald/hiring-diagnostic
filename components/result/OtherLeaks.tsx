'use client';

import { useState } from 'react';
import type {
  Artefact,
  FunnelStage,
  Recommendation,
  StageStatus,
} from '@/lib/types';
import { STAGE_LABELS } from '@/lib/types';
import RecommendationBlock from './Recommendation';
import ArtefactBlock from './ArtefactBlock';

export type OtherLeak = {
  stage: FunnelStage;
  score: number;
  status: StageStatus;
  recommendation: Recommendation;
  artefact: Artefact | null;
};

type Props = {
  resultId: string;
  leaks: OtherLeak[];
  unlockedInitially?: boolean;
};

const STATUS_LABEL: Record<StageStatus, string> = {
  tight: 'Tight',
  functional: 'Functional',
  leaking: 'Leaking',
  broken: 'Broken',
};

export default function OtherLeaks({
  resultId,
  leaks,
  unlockedInitially = false,
}: Props) {
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(unlockedInitially);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openStage, setOpenStage] = useState<FunnelStage | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/diagnostic/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resultId, email: trimmed }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || `HTTP ${res.status}`);
      }
      setUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  if (!unlocked) {
    return (
      <section className="my-8 p-6 bg-blue-light rounded-md">
        <p className="text-eyebrow text-blue uppercase mb-2">Keep going</p>
        <h3 className="text-xl font-bold text-navy mb-2">
          Explore the advice for your other leaks
        </h3>
        <p className="text-sm text-navy mb-4">
          Your worst leak is above. The other four stages have fixes too. Add
          your email to unlock all of them and download the full report.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            className="flex-1 px-3 py-2 border border-grey-medium rounded-md focus:outline-none focus:border-blue bg-white"
          />
          <button
            type="submit"
            disabled={busy || !email.trim()}
            className="px-5 py-2 bg-navy text-white font-bold rounded-md hover:bg-blue disabled:bg-grey-medium transition"
          >
            {busy ? 'Unlocking...' : 'Explore my other leaks'}
          </button>
        </form>
        {error && (
          <p className="text-xs text-status-leaking mt-2">{error}</p>
        )}
      </section>
    );
  }

  return (
    <section className="my-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-eyebrow text-blue uppercase mb-1">
            Your other leaks
          </p>
          <p className="text-sm text-grey-medium">
            Worst to best. Work down the list once the top one is fixed.
          </p>
        </div>
        <a
          href={`/api/pdf/${resultId}${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ''}`}
          className="px-5 py-2 bg-navy text-white font-bold rounded-md hover:bg-blue transition text-center"
        >
          Download the full report
        </a>
      </div>
      <div className="space-y-3">
        {leaks.map((leak) => {
          const isOpen = openStage === leak.stage;
          return (
            <div
              key={leak.stage}
              className="border border-grey-medium rounded-md"
            >
              <button
                type="button"
                onClick={() => setOpenStage(isOpen ? null : leak.stage)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-bold text-navy">
                    {STAGE_LABELS[leak.stage]}
                  </span>
                  <span className="text-sm text-grey-medium tabular-nums">
                    {leak.score} / 100 · {STATUS_LABEL[leak.status]}
                  </span>
                </span>
                <span className="text-blue text-sm font-bold flex-shrink-0">
                  {isOpen ? 'Hide' : 'View fix'}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-4 border-t border-grey-light">
                  <RecommendationBlock recommendation={leak.recommendation} />
                  {leak.artefact && (
                    <ArtefactBlock artefact={leak.artefact} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
