'use client';

import { useState } from 'react';

type Result = {
  accepted: boolean;
  feedback: string;
  rewrite: string;
};

type Props = {
  initial?: string;
  onComplete: (sentence: string) => void | Promise<void>;
  onBack: () => void;
  submitLabel?: string;
};

export default function ForcingPrompt({
  initial,
  onComplete,
  onBack,
  submitLabel = 'Submit',
}: Props) {
  const [sentence, setSentence] = useState(initial ?? '');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function check(text: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/coaching/forcing-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data: Result = await res.json();
      setResult(data);
      if (data.accepted) {
        try {
          await complete(text);
        } catch (innerErr) {
          setError(
            innerErr instanceof Error ? innerErr.message : 'Submit failed'
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check failed');
    } finally {
      setLoading(false);
    }
  }

  async function complete(text: string) {
    setSubmitting(true);
    try {
      await onComplete(text);
    } finally {
      setSubmitting(false);
    }
  }

  async function acceptRewrite() {
    if (!result?.rewrite) return;
    setSentence(result.rewrite);
    setResult({ ...result, accepted: true });
    try {
      await complete(result.rewrite);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sentence.trim()) return;
    check(sentence.trim());
  }

  return (
    <section>
      <p className="text-eyebrow text-blue uppercase mb-2">Final step</p>
      <h1 className="text-3xl font-bold text-navy mb-4">
        Write your success criteria.
      </h1>
      <p className="text-base text-black mb-2">One sentence, in this form:</p>
      <p className="text-sm text-navy bg-blue-light rounded p-3 mb-6">
        I will know this hire worked when [outcome] by [date], because
        [evidence].
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          rows={4}
          placeholder="I will know this hire worked when..."
          className="w-full px-3 py-2 border border-grey-medium rounded-md focus:outline-none focus:border-blue resize-none"
          disabled={loading || submitting}
        />
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-navy font-medium hover:text-blue"
            disabled={loading || submitting}
          >
            &larr; Back
          </button>
          <button
            type="submit"
            disabled={!sentence.trim() || loading || submitting}
            className="px-6 py-3 bg-navy text-white font-bold rounded-md hover:bg-blue disabled:bg-grey-medium disabled:cursor-not-allowed transition"
          >
            {loading
              ? 'Checking...'
              : submitting
                ? 'Saving...'
                : submitLabel}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-status-leaking text-white rounded">
          <p className="text-sm font-bold">Something went wrong.</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && !result.accepted && (
        <div className="mt-6 p-5 bg-gold rounded-md">
          <p className="text-xs font-bold text-navy uppercase mb-2">
            Sharpen this
          </p>
          <p className="text-sm text-navy mb-3">{result.feedback}</p>
          {result.rewrite && (
            <>
              <p className="text-xs font-bold text-navy uppercase mb-1">
                Suggested rewrite
              </p>
              <p className="text-base text-navy bg-white rounded p-3 mb-4">
                {result.rewrite}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={acceptRewrite}
                  disabled={submitting}
                  className="px-4 py-2 bg-navy text-white text-sm font-bold rounded hover:bg-blue transition"
                >
                  Use this rewrite
                </button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  disabled={submitting}
                  className="px-4 py-2 text-navy text-sm font-medium underline"
                >
                  Edit mine
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {result?.accepted && !submitting && (
        <div className="mt-6 p-5 bg-status-tight text-white rounded-md">
          <p className="text-sm font-bold">Accepted.</p>
        </div>
      )}
    </section>
  );
}
