// Routing CTA per BUILD_SPEC.md Section 16.
// Series A or B+ with worst-leak < 50: NTP Talent 15-min consult CTA.
// Seed with worst-leak < 40: Building Tech Teams newsletter signup.
// Everyone else: no CTA (library contribution covers the call to action).

import type { Stage } from '@/lib/types';

export type NTPCta = {
  eyebrow: string;
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
      eyebrow: 'NTP Talent',
      headline: 'Want help fixing this faster?',
      body: 'NTP Talent runs retained search and hiring-process coaching for Series A and B teams in Australia. If your worst leak is below 50, a 15-minute call gets you on a faster path. James has placed senior tech talent for Australian scale-ups for ten years.',
      ctaLabel: 'Book the 15-min call',
      href: 'https://calendly.com/james-ntptalent/new-meeting',
    };
  }
  if (stage === 'seed' && worstLeakScore < 40) {
    return {
      eyebrow: 'Building Tech Teams',
      headline: 'Hiring at seed?',
      body: "Building Tech Teams is James's weekly newsletter for Australian founders and engineering leaders. Hiring, team-building, what works. Free.",
      ctaLabel: 'Subscribe to Building Tech Teams',
      href: 'https://substack.com/@buildingtechteams',
    };
  }
  return null;
}

export default function NTPCallout({ cta }: { cta: NTPCta }) {
  return (
    <section className="my-8 p-6 bg-navy text-white rounded-md">
      <p className="text-eyebrow text-gold uppercase mb-2">{cta.eyebrow}</p>
      <h3 className="text-xl font-bold mb-2">{cta.headline}</h3>
      <p className="text-sm mb-4 opacity-95 leading-relaxed">{cta.body}</p>
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-5 py-2 bg-gold text-navy font-bold rounded-md hover:opacity-90 transition"
      >
        {cta.ctaLabel}
      </a>
    </section>
  );
}
