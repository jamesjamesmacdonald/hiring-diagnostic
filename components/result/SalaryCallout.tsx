// Inline salary band card. Only used when:
//   1. The user provided a role title in Step 1, AND
//   2. The worst leak is CLOSE (live market data is most actionable there).
// Renders the fallback notice when the AI Jobs Index returns nothing.

import type { SalaryData } from '@/lib/types';

const AUD = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

type Props = {
  data: SalaryData | null;
  role: string;
  region: string;
};

export default function SalaryCallout({ data, role, region }: Props) {
  if (!data) {
    return (
      <section className="my-6 p-5 bg-grey-light rounded-md">
        <p className="text-eyebrow text-blue uppercase mb-2">
          AI Jobs Index
        </p>
        <p className="text-sm text-navy">
          Live AI Jobs Index data is connecting. For now, the recommendation
          is the same.
        </p>
      </section>
    );
  }

  return (
    <section className="my-6 p-5 bg-blue-light rounded-md">
      <p className="text-eyebrow text-blue uppercase mb-2">AI Jobs Index</p>
      <h3 className="text-lg font-bold text-navy mb-2">
        Live market data for {role} in {region}
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <Stat label="25th" value={AUD.format(data.p25)} />
        <Stat label="Median" value={AUD.format(data.median)} bold />
        <Stat label="75th" value={AUD.format(data.p75)} />
      </div>
      <p className="text-xs text-grey-medium">
        Anchor your offer to the 60-75th percentile if you are hiring
        competitively. Source: AI Jobs Index{data.asOf ? `, ${data.asOf}` : ''}
        {data.sampleSize ? ` (n=${data.sampleSize})` : ''}.
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
