import { describe, expect, it } from 'vitest';

import {
  convertWeight,
  formatWeight,
  getSecondaryUnit,
  kgToLb,
  lbToKg,
  roundToStep,
} from '@/domain/units';

describe('units helpers', () => {
  it('converts kg to lb', () => {
    expect(kgToLb(100)).toBe(220.5);
  });

  it('converts lb to kg', () => {
    expect(lbToKg(220.5)).toBe(100);
  });

  it('rounds to a custom step', () => {
    expect(roundToStep(102.4, 2.5)).toBe(102.5);
  });

  it('formats weight strings', () => {
    expect(formatWeight(100, 'kg')).toBe('100 kg');
  });

  it('returns the opposite unit', () => {
    expect(getSecondaryUnit('kg')).toBe('lb');
  });

  it('converts between units generically', () => {
    expect(convertWeight(45, 'lb', 'kg')).toBe(20.4);
  });
});
