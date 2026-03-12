'use client';

import type { Plate, PlateCounts, PlatePattern } from '@/domain/lifting';
import { convertWeight, formatWeight, type WeightUnit } from '@/domain/units';

const patternMap: Record<PlatePattern, string> = {
  solid: '',
  stripe:
    'bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgba(255,255,255,0.15)_10px,rgba(255,255,255,0.15)_18px)]',
  grid: 'bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:14px_14px]',
  dot: 'bg-[radial-gradient(circle,rgba(255,255,255,0.16)_14%,transparent_15%)] bg-[size:14px_14px]',
  ring: 'bg-[radial-gradient(circle_at_center,transparent_42%,rgba(255,255,255,0.18)_43%,rgba(255,255,255,0.18)_52%,transparent_53%)]',
};

type PlateGridProps = {
  copy: {
    platesLabel: string;
    perSideLabel: string;
    decrementPlate: string;
    incrementPlate: string;
    selectedCount: string;
  };
  plates: Plate[];
  platesPerSide: PlateCounts;
  unitPreference: WeightUnit;
  onDecrease: (plateId: string) => void;
  onIncrease: (plateId: string) => void;
};

export function PlateGrid({
  copy,
  plates,
  platesPerSide,
  unitPreference,
  onDecrease,
  onIncrease,
}: PlateGridProps) {
  return (
    <section className="space-y-3" aria-label={copy.platesLabel}>
      <div className="flex items-center justify-between gap-3">
        <p className="section-label">{copy.platesLabel}</p>
        <p className="text-muted-foreground text-xs">{copy.perSideLabel}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {plates.map((plate) => {
          const count = platesPerSide[plate.id] ?? 0;

          return (
            <div key={plate.id} className="weight-card rounded-[1.35rem] p-4">
              <div className="flex items-start justify-between gap-3">
                <div
                  aria-hidden="true"
                  className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-black/10 ${patternMap[plate.pattern]}`}
                  style={{
                    backgroundColor: plate.colorToken,
                    color: plate.textColor,
                  }}
                >
                  <span className="text-lg font-black tracking-tight">
                    {plate.label}
                  </span>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm font-semibold">
                    {formatWeight(plate.weightKg, 'kg', 2)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatWeight(
                      convertWeight(plate.weightKg, 'kg', unitPreference),
                      unitPreference,
                      2,
                    )}
                  </p>
                  <p className="text-muted-foreground text-[0.68rem] tracking-[0.18em] uppercase">
                    {plate.pattern}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  aria-label={`${copy.decrementPlate} ${plate.label}`}
                  className="weight-control w-11"
                  onClick={() => onDecrease(plate.id)}
                  type="button"
                >
                  -
                </button>
                <div className="text-center">
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-muted-foreground text-[0.68rem] tracking-[0.18em] uppercase">
                    {copy.selectedCount}
                  </p>
                </div>
                <button
                  aria-label={`${copy.incrementPlate} ${plate.label}`}
                  className="weight-control w-11"
                  onClick={() => onIncrease(plate.id)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
