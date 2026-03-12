'use client';

import { create } from 'zustand';

import {
  createDefaultLoadSelection,
  type LoadSelection,
  type PlateCounts,
} from '@/domain/lifting';
import type { WeightUnit } from '@/domain/units';

type WeightPickerState = {
  unitPreference: WeightUnit;
  showBothUnits: boolean;
  movementSelections: Record<string, LoadSelection>;
  ensureMovement: (movementId: string) => void;
  setUnitPreference: (unit: WeightUnit) => void;
  setShowBothUnits: (value: boolean) => void;
  setSelectedBar: (movementId: string, barbellId: string) => void;
  setPlateCount: (movementId: string, plateId: string, count: number) => void;
  applySuggestedPlates: (
    movementId: string,
    platesPerSide: PlateCounts,
  ) => void;
  resetMovement: (movementId: string) => void;
};

function updateSelection(
  state: WeightPickerState,
  movementId: string,
  updater: (selection: LoadSelection) => LoadSelection,
) {
  const currentSelection =
    state.movementSelections[movementId] ??
    createDefaultLoadSelection(state.unitPreference);

  return {
    movementSelections: {
      ...state.movementSelections,
      [movementId]: updater(currentSelection),
    },
  };
}

export const useWeightPickerStore = create<WeightPickerState>((set) => ({
  unitPreference: 'kg',
  showBothUnits: true,
  movementSelections: {},
  ensureMovement: (movementId) =>
    set((state) => {
      if (state.movementSelections[movementId]) {
        return state;
      }

      return {
        movementSelections: {
          ...state.movementSelections,
          [movementId]: createDefaultLoadSelection(state.unitPreference),
        },
      };
    }),
  setUnitPreference: (unitPreference) =>
    set((state) => ({
      unitPreference,
      movementSelections: Object.fromEntries(
        Object.entries(state.movementSelections).map(
          ([movementId, selection]) => [
            movementId,
            { ...selection, unitPreference },
          ],
        ),
      ),
    })),
  setShowBothUnits: (showBothUnits) =>
    set((state) => ({
      showBothUnits,
      movementSelections: Object.fromEntries(
        Object.entries(state.movementSelections).map(
          ([movementId, selection]) => [
            movementId,
            { ...selection, showBothUnits },
          ],
        ),
      ),
    })),
  setSelectedBar: (movementId, barbellId) =>
    set((state) =>
      updateSelection(state, movementId, (selection) => ({
        ...selection,
        selectedBarId: barbellId,
        lastUpdated: new Date().toISOString(),
      })),
    ),
  setPlateCount: (movementId, plateId, count) =>
    set((state) =>
      updateSelection(state, movementId, (selection) => {
        const nextPlates = { ...selection.platesPerSide };

        if (count <= 0) {
          delete nextPlates[plateId];
        } else {
          nextPlates[plateId] = count;
        }

        return {
          ...selection,
          platesPerSide: nextPlates,
          lastUpdated: new Date().toISOString(),
        };
      }),
    ),
  applySuggestedPlates: (movementId, platesPerSide) =>
    set((state) =>
      updateSelection(state, movementId, (selection) => ({
        ...selection,
        platesPerSide,
        lastUpdated: new Date().toISOString(),
      })),
    ),
  resetMovement: (movementId) =>
    set((state) =>
      updateSelection(state, movementId, (selection) => ({
        ...createDefaultLoadSelection(state.unitPreference),
        selectedBarId: selection.selectedBarId,
        unitPreference: state.unitPreference,
        showBothUnits: state.showBothUnits,
      })),
    ),
}));
