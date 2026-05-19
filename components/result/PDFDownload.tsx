'use client';

import { useState } from 'react';

type Props = { resultId: string };

export default function PDFDownload({ resultId }: Props) {
  const [email, setEmail] = useState('');
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) return;
    setStarted(true);
    const downloadUrl = `/api/pdf/${resultId}?email=${encodeURIComponent(trimmed)}`;
    // Trigger download via location change. Email gets saved server-side.
    window.location.href = downloadUrl;
  }

  if (started) {
    return (
      <section className="my-8 p-5 bg-blue-light rounded-md">
        <p className="text-eyebrow text-blue uppercase mb-2">
          Download started
        </p>
        <p className="text-sm text-navy">
          If nothing happened,{' '}
          <a
            href={`/api/pdf/${resultId}?email=${encodeURIComponent(email.trim())}`}
            className="text-blue underline"
          >
            click here to grab the PDF
          </a>
          .
        </p>
        {error && <p className="text-xs text-status-leaking mt-2">{error}</p>}
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="my-8 p-5 bg-blue-light rounded-md"
    >
      <p className="text-eyebrow text-blue uppercase mb-2">Take it with you</p>
      <h3 className="text-xl font-bold text-navy mb-2">
        Email me the PDF
      </h3>
      <p className="text-sm text-navy mb-4">
        Four pages. Your funnel, your worst leak, the fix, the artefact you
        copy-paste into your next planning doc.
      </p>
      <div className="flex flex-col md:flex-row gap-2">
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
          disabled={!email.trim()}
          className="px-5 py-2 bg-navy text-white font-bold rounded-md hover:bg-blue disabled:bg-grey-medium transition"
        >
          Download PDF
        </button>
      </div>
    </form>
  );
}
