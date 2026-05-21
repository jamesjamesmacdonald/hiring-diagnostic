// Inline salary band card. Shown when the worst leak is CLOSE and the user
// gave a role title that matches a canonical band. National Australian
// figures, averaged across six 2025-26 salary guides. Renders nothing when
// there is no matching band.

import type { SalaryData } from '@/lib/types';

const AUD = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

type Props = {
  data: SalaryData | null;
};

export default function SalaryCallout({ data }: Props) {
  if (!data) return null;

  return (
    <section className="my-6 p-5 bg-blue-light rounded-md">
      <p className="text-eyebrow text-blue uppercase mb-2">Market benchmark</p>
      <h3 className="text-lg font-bold text-navy mb-1">
        {data.role}, Australia
      </h3>
      <p className="text-xs text-grey-medium mb-3">
        Base salary, national figures.
      </p>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <Stat label="Low" value={AUD.format(data.p25)} />
        <Stat label="Median" value={AUD.format(data.median)} bold />
        <Stat label="High" value={AUD.format(data.p75)} />
      </div>
      <p className="text-xs text-grey-medium">
        Anchor your offer to the 60-75th percentile if you are hiring
        competitively. {data.source}
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="text-center bg-white rounded p-2">
      <p className="text-xs text-grey-medium mb-1">{label}</p>
      <p
        className={`tabular-nums text-navy ${bold ? 'text-xl font-bold' : 'text-base font-medium'}`}
      >
        {value}
      </p>
    </div>
  );
}
