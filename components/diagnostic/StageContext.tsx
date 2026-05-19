'use client';

import { useState } from 'react';
import type {
  DiagnosticContext,
  Stage,
  RoleType,
  Region,
} from '@/lib/types';
import {
  COMPANY_STAGE_LABELS,
  ROLE_TYPE_LABELS,
  REGION_LABELS,
} from '@/lib/types';

type Props = {
  onSubmit: (context: DiagnosticContext) => void;
  initial?: DiagnosticContext | null;
};

export default function StageContext({ onSubmit, initial }: Props) {
  const [stage, setStage] = useState<Stage | ''>(initial?.stage ?? '');
  const [roleType, setRoleType] = useState<RoleType | ''>(
    initial?.roleType ?? ''
  );
  const [region, setRegion] = useState<Region | ''>(initial?.region ?? '');
  const [roleTitle, setRoleTitle] = useState(initial?.roleTitle ?? '');

  const canSubmit = Boolean(stage && roleType && region);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      stage: stage as Stage,
      roleType: roleType as RoleType,
      region: region as Region,
      roleTitle: roleTitle.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <Field
        label="What stage is your company?"
        value={stage}
        onChange={(v) => setStage(v as Stage | '')}
        options={Object.entries(COMPANY_STAGE_LABELS)}
      />
      <Field
        label="What role type is this hire?"
        value={roleType}
        onChange={(v) => setRoleType(v as RoleType | '')}
        options={Object.entries(ROLE_TYPE_LABELS)}
      />
      <Field
        label="Where is the hire based?"
        value={region}
        onChange={(v) => setRegion(v as Region | '')}
        options={Object.entries(REGION_LABELS)}
      />
      <div>
        <label
          htmlFor="role-title"
          className="block text-sm font-bold text-navy mb-2"
        >
          Role title (optional)
        </label>
        <input
          id="role-title"
          type="text"
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          placeholder="Senior Backend Engineer"
          className="w-full px-3 py-2 border border-grey-medium rounded-md focus:outline-none focus:border-blue"
        />
        <p className="text-xs text-grey-medium mt-1">
          Unlocks live AI Jobs Index salary data in the CLOSE stage.
        </p>
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full px-6 py-3 bg-navy text-white font-bold rounded-md hover:bg-blue disabled:bg-grey-medium disabled:cursor-not-allowed transition"
      >
        Start the diagnostic
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-navy mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-grey-medium rounded-md focus:outline-none focus:border-blue bg-white"
      >
        <option value="">Choose one</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
