// 4-page A4 PDF rendered server-side via @react-pdf/renderer.
// Pages: cover, funnel, fix, artefact. Mobile rendering of the artefact
// markdown is lossy by design — we strip markdown to plain text so the
// PDF stays clean. The web result page already shows the rich version.

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Artefact, FunnelStage, Recommendation } from '@/lib/types';
import {
  COMPANY_STAGE_LABELS,
  FUNNEL_STAGES,
  REGION_LABELS,
  ROLE_TYPE_LABELS,
  STAGE_LABELS,
} from '@/lib/types';

// Brand colours per BUILD_SPEC.md Section 12.
const NAVY = '#1F3A5F';
const BLUE = '#2E75B6';
const GOLD = '#FCE5B6';
const GREY_LIGHT = '#F2F2F2';
const GREY_MEDIUM = '#7A7A7A';

const STATUS_COLOR = {
  tight: '#16A34A',
  functional: '#CA8A04',
  leaking: '#DC2626',
  broken: '#7F1D1D',
} as const;

const WIDTH_PCT: Record<FunnelStage, string> = {
  align: '100%',
  attract: '95%',
  assess: '90%',
  close: '85%',
  onboard: '80%',
};

function statusFor(score: number): keyof typeof STATUS_COLOR {
  if (score >= 80) return 'tight';
  if (score >= 60) return 'functional';
  if (score >= 40) return 'leaking';
  return 'broken';
}

// Strip the most common markdown so PDF text reads naturally.
function plain(md: string): string {
  return md
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^---+\s*$/gm, '')
    .replace(/\|/g, '  ')
    .trim();
}

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000',
  },
  eyebrow: {
    fontSize: 9,
    color: BLUE,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 700,
    marginBottom: 8,
  },
  h1: {
    fontSize: 28,
    color: NAVY,
    fontWeight: 700,
    marginBottom: 14,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: 20,
    color: NAVY,
    fontWeight: 700,
    marginBottom: 10,
  },
  h3: {
    fontSize: 14,
    color: NAVY,
    fontWeight: 700,
    marginBottom: 8,
  },
  body: {
    fontSize: 11,
    lineHeight: 1.55,
    marginBottom: 10,
  },
  small: {
    fontSize: 9,
    color: GREY_MEDIUM,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginBottom: 6,
    paddingHorizontal: 10,
    color: 'white',
  },
  barLabel: { color: 'white', fontWeight: 700, fontSize: 12 },
  barScore: {
    color: 'white',
    fontWeight: 700,
    fontSize: 14,
    marginLeft: 'auto',
  },
  worstTag: {
    backgroundColor: GOLD,
    color: NAVY,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 8,
    fontWeight: 700,
    marginLeft: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: GREY_LIGHT,
    marginVertical: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: GREY_MEDIUM,
  },
});

type Row = {
  id: string;
  company_stage: keyof typeof COMPANY_STAGE_LABELS;
  role_type: keyof typeof ROLE_TYPE_LABELS;
  region: keyof typeof REGION_LABELS;
  align_score: number;
  attract_score: number;
  assess_score: number;
  close_score: number;
  onboard_score: number;
  worst_leak: FunnelStage;
  forcing_prompt: string | null;
  created_at: string;
};

export default function DiagnosticPDF({
  row,
  recommendation,
  artefact,
}: {
  row: Row;
  recommendation: Recommendation;
  artefact: Artefact;
}) {
  const date = new Date(row.created_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const stages = FUNNEL_STAGES.map((stage) => ({
    stage,
    score: (row[`${stage}_score` as keyof Row] as number) ?? 0,
  }));

  const worstScore =
    (row[`${row.worst_leak}_score` as keyof Row] as number) ?? 0;

  return (
    <Document
      title="The Hiring Funnel Diagnostic"
      author="James MacDonald"
      subject={`Result for ${row.id}`}
    >
      {/* Cover */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 120 }}>
          <Text style={styles.eyebrow}>Building Tech Teams</Text>
          <Text style={styles.h1}>The Hiring Funnel Diagnostic</Text>
          <Text style={styles.body}>
            {COMPANY_STAGE_LABELS[row.company_stage]} ·{' '}
            {ROLE_TYPE_LABELS[row.role_type]} · {REGION_LABELS[row.region]}
          </Text>
          <Text style={styles.body}>{date}</Text>
        </View>
        <Text style={styles.footer}>
          Built by James MacDonald at NTP Talent. Co-launching with Building
          Tech Teams Episode 1.
        </Text>
      </Page>

      {/* Funnel */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Your funnel</Text>
        <Text style={styles.h2}>Five stages. Five scores.</Text>
        <View style={{ marginTop: 16 }}>
          {stages.map(({ stage, score }) => {
            const isWorst = stage === row.worst_leak;
            return (
              <View
                key={stage}
                style={{
                  ...styles.bar,
                  width: WIDTH_PCT[stage],
                  backgroundColor: STATUS_COLOR[statusFor(score)],
                  borderLeftWidth: isWorst ? 6 : 2,
                  borderLeftColor: isWorst ? GOLD : 'transparent',
                }}
              >
                <Text style={styles.barLabel}>{STAGE_LABELS[stage]}</Text>
                <Text style={styles.barScore}>{score}</Text>
                {isWorst && (
                  <Text style={styles.worstTag}>WORST LEAK</Text>
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.divider} />
        <Text style={styles.eyebrow}>Your worst leak</Text>
        <Text style={styles.h2}>{STAGE_LABELS[row.worst_leak]}</Text>
        <Text style={styles.body}>You scored {worstScore} out of 100.</Text>
        {row.forcing_prompt && (
          <>
            <Text style={styles.eyebrow}>Your success criterion</Text>
            <Text style={styles.body}>{row.forcing_prompt}</Text>
          </>
        )}
      </Page>

      {/* Fix */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>The fix</Text>
        <Text style={styles.h2}>{recommendation.headline}</Text>
        <Text style={styles.body}>{recommendation.fixScript}</Text>
        <View style={styles.divider} />
        <Text style={styles.small}>Source: {recommendation.source}</Text>
      </Page>

      {/* Artefact */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Artefact</Text>
        <Text style={styles.h3}>{artefact.title}</Text>
        <Text style={styles.body}>{plain(artefact.content)}</Text>
        <Text style={styles.footer}>
          hiring-diagnostic.vercel.app · Building Tech Teams · NTP Talent
        </Text>
      </Page>
    </Document>
  );
}
