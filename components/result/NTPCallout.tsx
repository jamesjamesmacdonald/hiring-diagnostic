// NTP routing CTA per BUILD_SPEC.md Section 16.
// Series A or B+ with worst-leak < 50: 15-min consult CTA.
// Seed with worst-leak < 40: weekly placement intelligence signup.
// Everyone else: no NTP CTA (library contribution covers the call to action).

import type { Stage } from '@/lib/types';

export type NTPCta = {
  headline: string;
  body: string;
  ctaLabel: string;
  href: string;
};

export function ntpCtaFor(
  stage: Stage,
  worstLeakScore: number
): NTPCta | null {
  if (
    (stage === 'series-a' || stage === 'series-b-plus') &&
    worstLeakScore < 50
  ) {
    return {
      headline: 'Want help fixing this faster?',
      body: 'NTP Talent runs retained search and hiring-process coaching for Series A and B teams in Australia. If your worst leak is below 50, a 15-minute call gets you on a faster path. James has placed senior tech talent for Australian scale-ups for ten years.',
      ctaLabel: 'Book the 15-min call',
      href: 'mailto:james@ntptalent.com.au?subject=Hiring%20Funnel%20Diagnostic%3A%20consult',
    };
  }
  if (stage === 'seed' && worstLeakScore < 40) {
    return {
      headline: 'Hiring at seed?',
      body: 'NTP Talent sends a weekly brief to seed founders: where senior tech talent moved, what they accepted, what got countered. Free.',
      ctaLabel: 'Get the weekly brief',
      href: 'mailto:james@ntptalent.com.au?subject=NTP%20placement%20intelligence%20signup',
    };
  }
  return null;
}

export default function NTPCallout({ cta }: { cta: NTPCta }) {
  return (
    <section className="my-8 p-6 bg-navy text-white rounded-md">
      <p className="text-eyebrow text-gold uppercase mb-2">NTP Talent</p>
      <h3 className="text-xl font-bold mb-2">{cta.headline}</h3>
      <p className="text-sm mb-4 opacity-95 leading-relaxed">{cta.body}</p>
      <a
        href={cta.href}
        className="inline-block px-5 py-2 bg-gold text-navy font-bold rounded-md hover:opacity-90 transition"
      >
        {cta.ctaLabel}
      </a>
    </section>
  );
}
