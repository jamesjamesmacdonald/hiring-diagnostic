// Global 404 for any path not matched by a route file.

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-content w-full text-center">
        <p className="text-eyebrow text-blue uppercase mb-3">404</p>
        <h1 className="text-3xl font-bold text-navy mb-3">
          This page is not here.
        </h1>
        <p className="text-base text-black mb-6">
          The link is wrong or the page never existed.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-navy text-white font-bold rounded-md hover:bg-blue transition"
        >
          Back to the start
        </a>
      </div>
    </main>
  );
}
