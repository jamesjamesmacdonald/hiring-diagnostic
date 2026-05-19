'use client';

import type { Question, Response } from '@/lib/types';
import { RESPONSE_OPTIONS } from '@/lib/types';

type Props = {
  question: Question;
  selected: Response | null;
  onSelect: (response: Response) => void;
  index: number;
};

export default function QuestionCard({
  question,
  selected,
  onSelect,
  index,
}: Props) {
  return (
    <fieldset className="border border-grey-light rounded-lg p-5 bg-white">
      <legend className="px-2 text-xs font-bold text-blue uppercase tracking-wide">
        Question {index + 1}
      </legend>
      <p className="text-base text-black font-medium mb-4">{question.text}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {RESPONSE_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <label
              key={opt.value}
              className={[
                'cursor-pointer text-center px-3 py-2 rounded-md border-2 text-sm font-medium transition select-none',
                isSelected
                  ? 'border-blue bg-blue text-white'
                  : 'border-grey-light text-navy hover:border-blue',
              ].join(' ')}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={isSelected}
                onChange={() => onSelect(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      <p className="text-xs text-grey-medium">Source: {question.source}</p>
    </fieldset>
  );
}
