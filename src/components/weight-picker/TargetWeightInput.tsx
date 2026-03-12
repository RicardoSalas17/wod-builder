'use client';

import { useState } from 'react';

import type { WeightUnit } from '@/domain/units';

type TargetWeightInputProps = {
  copy: {
    quickModeLabel: string;
    quickModeHint: string;
    targetWeightLabel: string;
    suggestPlates: string;
  };
  unitPreference: WeightUnit;
  onSuggest: (targetWeight: number) => void;
};

export function TargetWeightInput({
  copy,
  unitPreference,
  onSuggest,
}: TargetWeightInputProps) {
  const [value, setValue] = useState('');

  return (
    <section className="space-y-3" aria-label={copy.quickModeLabel}>
      <div className="flex items-center justify-between gap-3">
        <p className="section-label">{copy.quickModeLabel}</p>
        <p className="text-muted-foreground text-xs">{copy.quickModeHint}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">{copy.targetWeightLabel}</span>
          <div className="relative">
            <input
              className="weight-input pr-14"
              inputMode="decimal"
              onChange={(event) => setValue(event.target.value)}
              placeholder={`100 ${unitPreference}`}
              type="number"
              value={value}
            />
            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm uppercase">
              {unitPreference}
            </span>
          </div>
        </label>
        <button
          className="weight-control min-w-44 px-5 text-sm font-semibold"
          onClick={() => {
            const nextValue = Number(value);
            if (Number.isFinite(nextValue) && nextValue > 0) {
              onSuggest(nextValue);
            }
          }}
          type="button"
        >
          {copy.suggestPlates}
        </button>
      </div>
    </section>
  );
}
