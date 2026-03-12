'use client';

import { useEffect, useMemo } from 'react';

import {
  computeTotalWeight,
  DEFAULT_INVENTORY,
  findBarbell,
  suggestPlates,
  toDisplayUnits,
  type Inventory,
} from '@/domain/lifting';
import type { WeightUnit } from '@/domain/units';
import { useWeightPickerStore } from '@/stores/use-weight-picker-store';
import { BarSelector } from './BarSelector';
import { BarbellPreview } from './BarbellPreview';
import { PlateGrid } from './PlateGrid';
import { TargetWeightInput } from './TargetWeightInput';

export type WeightPickerCopy = {
  title: string;
  demoTitle: string;
  demoBody: string;
  movementLabel: string;
  unitPreferenceLabel: string;
  showBothUnits: string;
  unitKg: string;
  unitLb: string;
  resetLoad: string;
  barSelectorLabel: string;
  barWeightLabel: string;
  quickModeLabel: string;
  quickModeHint: string;
  targetWeightLabel: string;
  suggestPlates: string;
  platesLabel: string;
  perSideLabel: string;
  decrementPlate: string;
  incrementPlate: string;
  selectedCount: string;
  previewLabel: string;
  totalLabel: string;
  barLabel: string;
  noPlates: string;
  perSideBreakdown: string;
  trackingLabel: string;
  lastUsedLabel: string;
  personalRecordLabel: string;
  trackingHint: string;
  configuredLabel: string;
};

type MovementLoadFieldProps = {
  copy: WeightPickerCopy;
  movementId: string;
  movementName?: string;
  inventory?: Inventory;
  onLoadSummaryChange?: (summary: string) => void;
  demo?: boolean;
};

function UnitToggle({
  copy,
  selectedUnit,
  onChange,
}: {
  copy: WeightPickerCopy;
  selectedUnit: WeightUnit;
  onChange: (unit: WeightUnit) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="section-label">{copy.unitPreferenceLabel}</p>
      <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
        {(['kg', 'lb'] as const).map((unit) => {
          const isActive = unit === selectedUnit;

          return (
            <button
              key={unit}
              aria-pressed={isActive}
              className={`min-h-11 rounded-full px-4 text-sm font-semibold uppercase transition ${
                isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/6'
              }`}
              onClick={() => onChange(unit)}
              type="button"
            >
              {unit === 'kg' ? copy.unitKg : copy.unitLb}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TrackingCard({
  copy,
  lastUpdated,
}: {
  copy: WeightPickerCopy;
  lastUpdated: string | null;
}) {
  return (
    <div className="weight-card rounded-[1.5rem] p-4">
      <p className="section-label">{copy.trackingLabel}</p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
            {copy.lastUsedLabel}
          </dt>
          <dd className="text-foreground mt-1 text-sm font-medium">--</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
            {copy.personalRecordLabel}
          </dt>
          <dd className="text-foreground mt-1 text-sm font-medium">--</dd>
        </div>
      </dl>
      <p className="text-muted-foreground mt-3 text-xs leading-5">
        {copy.trackingHint}
        {lastUpdated
          ? ` Last touched ${new Date(lastUpdated).toLocaleDateString()}.`
          : ''}
      </p>
    </div>
  );
}

export function MovementLoadField({
  copy,
  movementId,
  movementName,
  inventory = DEFAULT_INVENTORY,
  onLoadSummaryChange,
  demo = false,
}: MovementLoadFieldProps) {
  const {
    ensureMovement,
    showBothUnits,
    movementSelections,
    setSelectedBar,
    setPlateCount,
    setUnitPreference,
    setShowBothUnits,
    applySuggestedPlates,
    resetMovement,
    unitPreference,
  } = useWeightPickerStore((state) => state);

  useEffect(() => {
    ensureMovement(movementId);
  }, [ensureMovement, movementId]);

  const selection = movementSelections[movementId];

  const computed = useMemo(() => {
    if (!selection) return null;
    return computeTotalWeight(selection, inventory);
  }, [inventory, selection]);

  const display = useMemo(() => {
    if (!computed) return null;
    return toDisplayUnits(computed.totalKg, unitPreference, showBothUnits);
  }, [computed, showBothUnits, unitPreference]);

  const barbell = selection
    ? findBarbell(inventory, selection.selectedBarId)
    : null;
  const barDisplay =
    barbell && selection
      ? toDisplayUnits(barbell.weightKg, unitPreference, showBothUnits)
      : null;

  const summary = display
    ? [display.primary, display.secondary].filter(Boolean).join(' / ')
    : '';

  useEffect(() => {
    onLoadSummaryChange?.(summary);
  }, [onLoadSummaryChange, summary]);

  if (!selection || !computed || !display || !barDisplay) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-label">{demo ? copy.demoTitle : copy.title}</p>
          <h4 className="text-foreground mt-2 text-base font-semibold">
            {movementName || copy.movementLabel}
          </h4>
          {demo ? (
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
              {copy.demoBody}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-foreground flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm">
            <input
              checked={showBothUnits}
              className="h-4 w-4 accent-[var(--accent)]"
              onChange={(event) => setShowBothUnits(event.target.checked)}
              type="checkbox"
            />
            {copy.showBothUnits}
          </label>
          <button
            className="weight-control px-4 text-sm font-semibold"
            onClick={() => resetMovement(movementId)}
            type="button"
          >
            {copy.resetLoad}
          </button>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {`${copy.totalLabel} ${display.primary}. ${barDisplay.primary}.`}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.34fr_0.66fr]">
        <UnitToggle
          copy={copy}
          onChange={setUnitPreference}
          selectedUnit={unitPreference}
        />
        <div className="weight-card rounded-[1.35rem] p-4">
          <p className="section-label">{copy.configuredLabel}</p>
          <p className="text-foreground mt-3 text-sm font-semibold">
            {display.primary}
          </p>
          {display.secondary ? (
            <p className="text-muted-foreground mt-1 text-xs">
              {display.secondary}
            </p>
          ) : null}
        </div>
      </div>

      <BarSelector
        bars={inventory.barbells}
        copy={{
          barSelectorLabel: copy.barSelectorLabel,
          barWeightLabel: copy.barWeightLabel,
        }}
        name={`weight-picker-bar-${movementId}`}
        onChange={(barbellId) => setSelectedBar(movementId, barbellId)}
        selectedBarId={selection.selectedBarId}
        showBothUnits={showBothUnits}
        unitPreference={unitPreference}
      />

      <TargetWeightInput
        copy={{
          quickModeHint: copy.quickModeHint,
          quickModeLabel: copy.quickModeLabel,
          suggestPlates: copy.suggestPlates,
          targetWeightLabel: copy.targetWeightLabel,
        }}
        onSuggest={(targetWeight) => {
          if (!barbell) return;
          const suggestion = suggestPlates(
            targetWeight,
            barbell.weightKg,
            inventory,
            unitPreference,
          );
          applySuggestedPlates(movementId, suggestion.platesPerSide);
        }}
        unitPreference={unitPreference}
      />

      <PlateGrid
        copy={{
          decrementPlate: copy.decrementPlate,
          incrementPlate: copy.incrementPlate,
          perSideLabel: copy.perSideLabel,
          platesLabel: copy.platesLabel,
          selectedCount: copy.selectedCount,
        }}
        onDecrease={(plateId) =>
          setPlateCount(
            movementId,
            plateId,
            (selection.platesPerSide[plateId] ?? 0) - 1,
          )
        }
        onIncrease={(plateId) =>
          setPlateCount(
            movementId,
            plateId,
            (selection.platesPerSide[plateId] ?? 0) + 1,
          )
        }
        plates={inventory.plates}
        platesPerSide={selection.platesPerSide}
        unitPreference={unitPreference}
      />

      <div className="grid gap-4 xl:grid-cols-[0.65fr_0.35fr]">
        <BarbellPreview
          copy={{
            barLabel: copy.barLabel,
            noPlates: copy.noPlates,
            perSideBreakdown: copy.perSideBreakdown,
            previewLabel: copy.previewLabel,
            totalLabel: copy.totalLabel,
          }}
          inventory={inventory}
          selection={selection}
          totalPrimary={display.primary}
          totalSecondary={display.secondary}
        />
        <TrackingCard copy={copy} lastUpdated={selection.lastUpdated} />
      </div>
    </section>
  );
}
