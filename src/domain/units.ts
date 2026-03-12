export type WeightUnit = 'kg' | 'lb';

export const KG_TO_LB = 2.2046226218;
export const LB_TO_KG = 1 / KG_TO_LB;

export function roundToStep(value: number, step = 0.5) {
  return Math.round(value / step) * step;
}

export function roundWeight(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function kgToLb(valueKg: number) {
  return roundWeight(valueKg * KG_TO_LB, 1);
}

export function lbToKg(valueLb: number) {
  return roundWeight(valueLb * LB_TO_KG, 1);
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit) {
  if (from === to) {
    return roundWeight(value, 1);
  }

  return from === 'kg' ? kgToLb(value) : lbToKg(value);
}

export function normalizeToKg(value: number, unit: WeightUnit) {
  return unit === 'kg' ? roundWeight(value, 1) : lbToKg(value);
}

export function formatWeight(value: number, unit: WeightUnit, digits = 1) {
  return `${roundWeight(value, digits)} ${unit}`;
}

export function getSecondaryUnit(unit: WeightUnit): WeightUnit {
  return unit === 'kg' ? 'lb' : 'kg';
}
