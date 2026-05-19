'use client';

import { useState } from 'react';

type Props = { resultId: string };

export default function LibraryUnlock({ resultId }: Props) {
  const [sector, setSector] = useState('');
  const [contributed, setContributed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/diagnostic/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resultId,
          sector: sector.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setContributed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  if (contributed) {
    return (
      <section className="my-8 p-5 bg-status-tight text-white rounded-md">
        <p className="text-sm font-bold mb-1">In the library.</p>
        <p className="text-sm">
          See other founders' diagnostics in the{' '}
          <a href="/library" className="underline">
            public library
          </a>
          .
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="my-8 p-5 bg-grey-light rounded-md">
      <p className="text-eyebrow text-blue uppercase mb-2">Unlock more</p>
      <h3 className="text-xl font-bold text-navy mb-2">
        Contribute and see how you compare
      </h3>
      <p className="text-sm text-navy mb-4">
        Your scores join the public library. No name. No email. No company.
        You get to see funnels from other founders at your stage and role.
      </p>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          placeholder="Your sector (optional, e.g. fintech)"
          className="flex-1 px-3 py-2 border border-grey-medium rounded-md focus:outline-none focus:border-blue bg-white"
        />
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 bg-navy text-white font-bold rounded-md hover:bg-blue disabled:bg-grey-medium transition"
        >
          {busy ? 'Saving...' : 'Contribute'}
        </button>
      </div>
      {error && <p className="text-xs text-status-leaking mt-2">{error}</p>}
    </form>
  );
}
