'use client';

// Triggered if the server component throws during data fetch or render.

export default function ResultError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-content w-full text-center">
        <p className="text-eyebrow text-blue uppercase mb-3">Something broke</p>
        <h1 className="text-3xl font-bold text-navy mb-3">
          We could not load your result.
        </h1>
        <p className="text-base text-black mb-6">
          The most common cause is a temporary glitch with the database. Try
          again, or run a fresh diagnostic.
        </p>
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-navy text-white font-bold rounded-md hover:bg-blue transition"
          >
            Try again
          </button>
          <a
            href="/diagnostic"
            className="px-6 py-3 text-navy font-bold border border-navy rounded-md hover:bg-grey-light transition"
          >
            Start fresh
          </a>
        </div>
      </div>
    </main>
  );
}
