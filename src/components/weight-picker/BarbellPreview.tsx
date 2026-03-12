'use client';

import {
  computePerSide,
  type Inventory,
  type LoadSelection,
} from '@/domain/lifting';

const diameterMap = {
  xl: 'h-28 w-7',
  lg: 'h-24 w-6',
  md: 'h-20 w-5',
  sm: 'h-16 w-4',
  xs: 'h-12 w-3',
};

type BarbellPreviewProps = {
  copy: {
    previewLabel: string;
    totalLabel: string;
    barLabel: string;
    noPlates: string;
    perSideBreakdown: string;
  };
  inventory: Inventory;
  selection: LoadSelection;
  totalPrimary: string;
  totalSecondary: string | null;
};

export function BarbellPreview({
  copy,
  inventory,
  selection,
  totalPrimary,
  totalSecondary,
}: BarbellPreviewProps) {
  const plates = computePerSide(inventory.plates, selection.platesPerSide);
  const barbell = inventory.barbells.find(
    (entry) => entry.id === selection.selectedBarId,
  );
  const leftSide = [...plates].reverse();

  return (
    <section className="space-y-4" aria-label={copy.previewLabel}>
      <div className="weight-card rounded-[1.5rem] p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label">{copy.totalLabel}</p>
            <p className="font-display text-foreground mt-2 text-4xl tracking-[-0.04em]">
              {totalPrimary}
            </p>
            {totalSecondary ? (
              <p className="text-muted-foreground mt-1 text-sm">
                {totalSecondary}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="section-label">{copy.barLabel}</p>
            <p className="text-foreground mt-2 text-sm font-semibold">
              {barbell?.name ?? ''}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          <div className="flex min-w-[17rem] items-center justify-center gap-2">
            <div className="flex h-32 items-end gap-1">
              {leftSide.length === 0 ? (
                <div className="text-muted-foreground flex items-center text-xs">
                  {copy.noPlates}
                </div>
              ) : (
                leftSide.flatMap((entry) =>
                  Array.from({ length: entry.count }).map((_, index) => (
                    <div
                      key={`${entry.plate.id}-left-${index}`}
                      aria-hidden="true"
                      className={`${diameterMap[entry.plate.diameter]} rounded-t-full rounded-b-md border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]`}
                      style={{ backgroundColor: entry.plate.colorToken }}
                    />
                  )),
                )
              )}
            </div>

            <div className="h-3 w-52 rounded-full bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" />

            <div className="flex h-32 items-end gap-1">
              {plates.flatMap((entry) =>
                Array.from({ length: entry.count }).map((_, index) => (
                  <div
                    key={`${entry.plate.id}-right-${index}`}
                    aria-hidden="true"
                    className={`${diameterMap[entry.plate.diameter]} rounded-t-full rounded-b-md border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]`}
                    style={{ backgroundColor: entry.plate.colorToken }}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="weight-card rounded-[1.5rem] p-4">
        <p className="section-label">{copy.perSideBreakdown}</p>
        {plates.length === 0 ? (
          <p className="text-muted-foreground mt-3 text-sm">{copy.noPlates}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {plates.map((entry) => (
              <li
                key={entry.plate.id}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-foreground font-medium">
                  {entry.plate.label} kg
                </span>
                <span className="text-muted-foreground">x {entry.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
