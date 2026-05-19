'use client';

import { useMemo, useState } from 'react';
import type {
  DiagnosticContext,
  FunnelStage,
  QuestionAnswer,
  Response,
} from '@/lib/types';
import {
  FUNNEL_STAGES,
  RESPONSE_SCORES,
  STAGE_DESCRIPTIONS,
  STAGE_LABELS,
} from '@/lib/types';
import { QUESTIONS, questionsForStage } from '@/lib/questions';
import { buildStageScores } from '@/lib/scoring';
import StageContext from '@/components/diagnostic/StageContext';
import QuestionCard from '@/components/diagnostic/QuestionCard';
import LiveFunnel from '@/components/diagnostic/LiveFunnel';
import ForcingPrompt from '@/components/diagnostic/ForcingPrompt';

// Static map of questionId → stage. Built once at module load from the question library.
const QUESTION_TO_STAGE: Record<string, FunnelStage> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q.stage])
);

// Step 1 = context picker. Steps 2-6 = ALIGN..ONBOARD. Step 7 = forcing prompt (lands Day 5).
const TOTAL_STEPS = 7;

export default function DiagnosticPage() {
  const [step, setStep] = useState(1);
  const [context, setContext] = useState<DiagnosticContext | null>(null);
  const [answers, setAnswers] = useState<Record<string, Response>>({});
  const [forcingPrompt, setForcingPrompt] = useState('');

  const stageIndex = step - 2;
  const currentStage: FunnelStage | null =
    stageIndex >= 0 && stageIndex < FUNNEL_STAGES.length
      ? FUNNEL_STAGES[stageIndex]
      : null;

  const stageScores = useMemo(() => {
    const answersArray: QuestionAnswer[] = Object.entries(answers).map(
      ([questionId, response]) => ({
        questionId,
        response,
        score: RESPONSE_SCORES[response],
      })
    );
    return buildStageScores(answersArray, QUESTION_TO_STAGE);
  }, [answers]);

  function handleContextSubmit(ctx: DiagnosticContext) {
    setContext(ctx);
    setStep(2);
  }

  function handleSelect(questionId: string, response: Response) {
    setAnswers((prev) => ({ ...prev, [questionId]: response }));
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function next() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-page mx-auto px-6 py-10">
        <div className="md:grid md:grid-cols-[1fr_280px] md:gap-10">
          <div className="max-w-content mx-auto md:mx-0 w-full">
            {step === 1 && (
              <Step1 onSubmit={handleContextSubmit} initial={context} />
            )}
            {currentStage && context && (
              <StageStep
                key={currentStage}
                stage={currentStage}
                stageNumber={stageIndex + 1}
                answers={answers}
                onSelect={handleSelect}
                onBack={back}
                onNext={next}
              />
            )}
            {step === TOTAL_STEPS && (
              <ForcingPrompt
                initial={forcingPrompt}
                onBack={back}
                onComplete={(s) => {
                  setForcingPrompt(s);
                  // Day 6 wires this onComplete to POST and redirect.
                }}
                submitLabel="Submit"
              />
            )}
          </div>
          <div className="hidden md:block">
            <div className="sticky top-10">
              <LiveFunnel
                currentStage={currentStage}
                stageScores={stageScores}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Step1({
  onSubmit,
  initial,
}: {
  onSubmit: (ctx: DiagnosticContext) => void;
  initial: DiagnosticContext | null;
}) {
  return (
    <section>
      <p className="text-eyebrow text-blue uppercase mb-2">Step 1 of 7</p>
      <h1 className="text-3xl font-bold text-navy mb-2">
        Tell us about the hire.
      </h1>
      <p className="text-base text-black mb-8">
        Three required fields. One optional. Takes 30 seconds.
      </p>
      <StageContext onSubmit={onSubmit} initial={initial} />
    </section>
  );
}

function StageStep({
  stage,
  stageNumber,
  answers,
  onSelect,
  onBack,
  onNext,
}: {
  stage: FunnelStage;
  stageNumber: number;
  answers: Record<string, Response>;
  onSelect: (questionId: string, response: Response) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const questions = questionsForStage(stage);
  const isLastStage = stageNumber === FUNNEL_STAGES.length;
  return (
    <section>
      <p className="text-eyebrow text-blue uppercase mb-2">
        Stage {stageNumber} of {FUNNEL_STAGES.length}
      </p>
      <h1 className="text-3xl font-bold text-navy mb-2">
        {STAGE_LABELS[stage]}
      </h1>
      <p className="text-base text-black mb-8">{STAGE_DESCRIPTIONS[stage]}</p>
      <div className="space-y-4 mb-8">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx}
            selected={answers[q.id] ?? null}
            onSelect={(r) => onSelect(q.id, r)}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 text-navy font-medium hover:text-blue"
        >
          &larr; Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-navy text-white font-bold rounded-md hover:bg-blue transition"
        >
          {isLastStage ? 'Final step' : 'Next stage'} &rarr;
        </button>
      </div>
    </section>
  );
}

