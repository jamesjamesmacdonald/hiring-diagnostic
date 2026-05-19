export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-white">
      <div className="max-w-content w-full text-center">
        <p className="text-eyebrow text-blue uppercase mb-4">
          Building Tech Teams
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-navy leading-tight mb-6">
          The Hiring Funnel Diagnostic
        </h1>
        <p className="text-xl text-black mb-8 leading-relaxed">
          Seven minutes. Twenty questions. Five stages. You finish with a
          scored funnel, your worst leak, and the artefact that fixes it.
        </p>
        <a
          href="/diagnostic"
          className="inline-block px-8 py-4 bg-navy text-white font-bold text-lg rounded-md hover:bg-blue transition"
        >
          Start the diagnostic
        </a>
        <div className="mt-10 pt-8 border-t border-grey-light">
          <p className="text-sm text-grey-medium mb-3">
            Built by James MacDonald at NTP Talent. Co-launches with Building
            Tech Teams Episode 1.
          </p>
          <a
            href="/library"
            className="text-sm text-blue underline hover:text-navy"
          >
            Browse the public library
          </a>
        </div>
      </div>
    </main>
  );
}
