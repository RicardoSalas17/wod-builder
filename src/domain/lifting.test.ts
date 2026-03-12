import { describe, expect, it } from 'vitest';

import {
  computePerSide,
  computeTotalWeight,
  createDefaultLoadSelection,
  DEFAULT_INVENTORY,
  suggestPlates,
  toDisplayUnits,
} from '@/domain/lifting';

describe('lifting helpers', () => {
  it('computes loaded plates per side in descending order', () => {
    const entries = computePerSide(DEFAULT_INVENTORY.plates, {
      'plate-5kg': 2,
      'plate-20kg': 1,
    });

    expect(entries.map((entry) => entry.plate.id)).toEqual([
      'plate-20kg',
      'plate-5kg',
    ]);
  });

  it('computes total weight including both sleeves', () => {
    const selection = createDefaultLoadSelection();
    selection.platesPerSide = {
      'plate-20kg': 1,
      'plate-10kg': 1,
    };

    expect(computeTotalWeight(selection, DEFAULT_INVENTORY)).toMatchObject({
      totalKg: 80,
      totalLb: 176.4,
      barKg: 20,
      plateKgPerSide: 30,
    });
  });

  it('builds display strings in both units', () => {
    expect(toDisplayUnits(80, 'kg', true)).toEqual({
      primary: '80 kg',
      secondary: '176.4 lb',
    });
  });

  it('suggests a greedy plate stack for a target total', () => {
    const suggestion = suggestPlates(100, 20, DEFAULT_INVENTORY, 'kg');

    expect(suggestion.platesPerSide).toEqual({
      'plate-25kg': 1,
      'plate-15kg': 1,
    });
    expect(suggestion.remainingKg).toBe(0);
    expect(suggestion.achievedTotalKg).toBe(100);
  });
});
