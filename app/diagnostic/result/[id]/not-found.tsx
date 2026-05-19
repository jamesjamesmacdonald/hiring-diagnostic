// Shown when the result id in the URL has no row in Supabase.
// Most common cause: stale share link after a database reset.

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-content w-full text-center">
        <p className="text-eyebrow text-blue uppercase mb-3">Not found</p>
        <h1 className="text-3xl font-bold text-navy mb-3">
          That result is no longer available.
        </h1>
        <p className="text-base text-black mb-6">
          Either the link is stale or the id is wrong. Run the diagnostic
          again to get a fresh result.
        </p>
        <a
          href="/diagnostic"
          className="inline-block px-6 py-3 bg-navy text-white font-bold rounded-md hover:bg-blue transition"
        >
          Start the diagnostic
        </a>
      </div>
    </main>
  );
}
