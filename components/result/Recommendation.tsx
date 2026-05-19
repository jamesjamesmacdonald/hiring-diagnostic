import type { Recommendation } from '@/lib/types';

export default function RecommendationBlock({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <section className="mb-8">
      <p className="text-eyebrow text-blue uppercase mb-2">The fix</p>
      <h3 className="text-2xl font-bold text-navy mb-4">
        {recommendation.headline}
      </h3>
      <p className="text-base text-black mb-4 whitespace-pre-line leading-relaxed">
        {recommendation.fixScript}
      </p>
      <p className="text-xs text-grey-medium">
        Source: {recommendation.source}
      </p>
    </section>
  );
}
