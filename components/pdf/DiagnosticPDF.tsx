// Full-report PDF rendered server-side via @react-pdf/renderer.
// Pages: cover, funnel, then one fix page per stage (all five, worst-first).
// Visual style is kept light and minimal to sit alongside batko.ai.
// Artefact markdown is stripped to plain text so the PDF stays clean.

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

const INK = '#1F3A5F'; // dark navy, primary text
const ACCENT = '#2E75B6'; // blue accent
const MUTED = '#6B7280'; // secondary text
const HAIRLINE = '#E5E7EB'; // light divider
const BODY = '#333333';

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
    paddingVertical: 56,
    paddingHorizontal: 56,
    fontSize: 10.5,
    fontFamily: 'Helvetica',
    color: BODY,
  },
  eyebrow: {
    fontSize: 8.5,
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: 700,
    marginBottom: 10,
  },
  h1: { fontSize: 30, color: INK, fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: 17, color: INK, fontWeight: 700, marginBottom: 6 },
  h3: { fontSize: 12.5, color: INK, fontWeight: 700, marginBottom: 8 },
  body: { fontSize: 10.5, color: BODY, lineHeight: 1.6, marginBottom: 10 },
  muted: { fontSize: 9, color: MUTED },
  rule: {
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
    marginVertical: 22,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginBottom: 7,
    paddingHorizontal: 10,
  },
  barLabel: { color: '#FFFFFF', fontWeight: 700, fontSize: 11 },
  barScore: {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: 12,
    marginLeft: 'auto',
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 56,
    right: 56,
    fontSize: 8,
    color: MUTED,
  },
});

export type StageFix = {
  stage: FunnelStage;
  score: number;
  isWorstLeak: boolean;
  recommendation: Recommendation;
  artefact: Artefact | null;
};

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
  fixes,
}: {
  row: Row;
  fixes: StageFix[];
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

  return (
    <Document
      title="The Hiring Funnel Diagnostic"
      author="Michael Batko and James MacDonald"
      subject={`Hiring funnel report for ${row.id}`}
    >
      {/* Cover */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 150 }}>
          <Text style={styles.eyebrow}>The Hiring Funnel Diagnostic</Text>
          <Text style={styles.h1}>Your hiring funnel report</Text>
          <View style={{ marginTop: 22 }}>
            <Text style={styles.body}>
              {COMPANY_STAGE_LABELS[row.company_stage]}
              {'   '}
              {ROLE_TYPE_LABELS[row.role_type]}
              {'   '}
              {REGION_LABELS[row.region]}
            </Text>
            <Text style={styles.muted}>{date}</Text>
          </View>
        </View>
        <Text style={styles.footer}>
          A partnership between Michael Batko, Hourglass AI and James
          MacDonald, Building Tech Teams, NTP Talent.
        </Text>
      </Page>

      {/* Funnel */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Your funnel</Text>
        <Text style={styles.h2}>Five stages, five scores</Text>
        <View style={{ marginTop: 18 }}>
          {stages.map(({ stage, score }) => {
            const isWorst = stage === row.worst_leak;
            return (
              <View key={stage} wrap={false}>
                <View
                  style={{
                    ...styles.bar,
                    width: WIDTH_PCT[stage],
                    backgroundColor: STATUS_COLOR[statusFor(score)],
                    borderLeftWidth: isWorst ? 5 : 0,
                    borderLeftColor: INK,
                  }}
                >
                  <Text style={styles.barLabel}>{STAGE_LABELS[stage]}</Text>
                  <Text style={styles.barScore}>{score}</Text>
                </View>
                {isWorst && (
                  <Text
                    style={{
                      fontSize: 7.5,
                      color: INK,
                      fontWeight: 700,
                      marginTop: -3,
                      marginBottom: 5,
                      letterSpacing: 1,
                    }}
                  >
                    WORST LEAK
                  </Text>
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.rule} />
        <Text style={styles.eyebrow}>Your worst leak</Text>
        <Text style={styles.h2}>
          {STAGE_LABELS[row.worst_leak]}
        </Text>
        <Text style={styles.body}>
          Scored{' '}
          {(row[`${row.worst_leak}_score` as keyof Row] as number) ?? 0} out
          of 100. The full priority order and every fix follow on the next
          pages.
        </Text>
        {row.forcing_prompt && (
          <>
            <Text style={styles.eyebrow}>Your success criteria</Text>
            <Text style={styles.body}>{row.forcing_prompt}</Text>
          </>
        )}
      </Page>

      {/* One fix page per stage, worst-first */}
      {fixes.map((fix, idx) => (
        <Page key={fix.stage} size="A4" style={styles.page}>
          <Text style={styles.eyebrow}>
            Priority {idx + 1} of {fixes.length}
            {fix.isWorstLeak ? '   Worst leak' : ''}
          </Text>
          <Text style={styles.h2}>{STAGE_LABELS[fix.stage]}</Text>
          <Text style={{ ...styles.muted, marginBottom: 16 }}>
            Scored {fix.score} out of 100.
          </Text>

          <Text style={styles.h3}>{fix.recommendation.headline}</Text>
          <Text style={styles.body}>{fix.recommendation.fixScript}</Text>
          <Text style={styles.muted}>
            Source: {fix.recommendation.source}
          </Text>

          {fix.artefact && (
            <>
              <View style={styles.rule} />
              <Text style={styles.eyebrow}>Artefact</Text>
              <Text style={styles.h3}>{fix.artefact.title}</Text>
              <Text style={styles.body}>{plain(fix.artefact.content)}</Text>
            </>
          )}
          <Text style={styles.footer} fixed>
            The Hiring Funnel Diagnostic
          </Text>
        </Page>
      ))}
    </Document>
  );
}
