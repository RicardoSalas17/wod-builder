'use client';

import type { Barbell } from '@/domain/lifting';
import {
  convertWeight,
  formatWeight,
  getSecondaryUnit,
  type WeightUnit,
} from '@/domain/units';

type BarSelectorProps = {
  bars: Barbell[];
  copy: {
    barSelectorLabel: string;
    barWeightLabel: string;
  };
  name: string;
  selectedBarId: string;
  unitPreference: WeightUnit;
  showBothUnits: boolean;
  onChange: (barbellId: string) => void;
};

export function BarSelector({
  bars,
  copy,
  name,
  selectedBarId,
  unitPreference,
  showBothUnits,
  onChange,
}: BarSelectorProps) {
  const secondaryUnit = getSecondaryUnit(unitPreference);

  return (
    <fieldset className="space-y-3">
      <legend className="section-label">{copy.barSelectorLabel}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {bars.map((bar) => {
          const isSelected = bar.id === selectedBarId;
          const primaryWeight = formatWeight(
            convertWeight(bar.weightKg, 'kg', unitPreference),
            unitPreference,
          );
          const secondaryWeight = formatWeight(
            convertWeight(bar.weightKg, 'kg', secondaryUnit),
            secondaryUnit,
          );

          return (
            <label key={bar.id} className="block">
              <input
                checked={isSelected}
                className="peer sr-only"
                name={name}
                onChange={() => onChange(bar.id)}
                type="radio"
                value={bar.id}
              />
              <span className="weight-card peer-checked:border-accent/50 peer-checked:bg-accent/10 peer-checked:text-foreground peer-focus-visible:ring-accent/60 flex min-h-11 cursor-pointer flex-col gap-1 rounded-[1.35rem] p-4 peer-focus-visible:ring-2">
                <span className="text-sm font-semibold">{bar.name}</span>
                <span className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                  {copy.barWeightLabel}
                </span>
                <span className="text-lg font-semibold">{primaryWeight}</span>
                {showBothUnits ? (
                  <span className="text-muted-foreground text-xs">
                    {secondaryWeight}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
