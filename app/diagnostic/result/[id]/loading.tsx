// Rendered while the result page server component fetches the row and the
// Claude-picked recommendation. Usually 2-3 seconds.

export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-content w-full text-center">
        <p className="text-eyebrow text-blue uppercase mb-3">Preparing</p>
        <h1 className="text-3xl font-bold text-navy mb-2">
          Pulling your funnel together.
        </h1>
        <p className="text-sm text-grey-medium">A few seconds.</p>
      </div>
    </main>
  );
}
