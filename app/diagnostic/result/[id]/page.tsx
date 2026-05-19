// Stub result page. Day 7 builds the full layout.

type Params = Promise<{ id: string }>;

export default async function ResultPage({ params }: { params: Params }) {
  const { id } = await params;
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-content w-full text-center">
        <p className="text-eyebrow text-blue uppercase mb-2">Saved</p>
        <h1 className="text-3xl font-bold text-navy mb-3">
          Your diagnostic is in.
        </h1>
        <p className="text-sm text-grey-medium font-mono break-all mb-6">
          {id}
        </p>
        <p className="text-base text-black">
          The full result page lands on Day 7.
        </p>
      </div>
    </main>
  );
}
