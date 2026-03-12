import {
  convertWeight,
  formatWeight,
  getSecondaryUnit,
  normalizeToKg,
  roundWeight,
  type WeightUnit,
} from '@/domain/units';

export type PlatePattern = 'solid' | 'stripe' | 'grid' | 'dot' | 'ring';

export type Barbell = {
  id: string;
  name: string;
  weightKg: number;
  sleeveLength: number;
};

export type Plate = {
  id: string;
  label: string;
  weightKg: number;
  colorToken: string;
  textColor: string;
  diameter: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  pattern: PlatePattern;
};

export type Inventory = {
  barbells: Barbell[];
  plates: Plate[];
  availablePerSide?: Record<string, number>;
};

export type PlateCounts = Record<string, number>;

export type WeightSnapshot = {
  value: number | null;
  unit: WeightUnit;
};

export type LoadSelection = {
  selectedBarId: string;
  platesPerSide: PlateCounts;
  unitPreference: WeightUnit;
  showBothUnits: boolean;
  lastUsedWeight: WeightSnapshot | null;
  personalRecord: WeightSnapshot | null;
  lastUpdated: string | null;
};

export type ComputedTotal = {
  totalKg: number;
  totalLb: number;
  barKg: number;
  plateKgPerSide: number;
};

export type PlateSuggestion = {
  platesPerSide: PlateCounts;
  remainingKg: number;
  achievedTotalKg: number;
};

export const DEFAULT_BARBELLS: Barbell[] = [
  { id: 'bar-20kg', name: 'Olympic 20 kg', weightKg: 20, sleeveLength: 7 },
  { id: 'bar-15kg', name: 'Technique 15 kg', weightKg: 15, sleeveLength: 7 },
  { id: 'bar-10kg', name: 'Training 10 kg', weightKg: 10, sleeveLength: 6 },
];

export const DEFAULT_PLATES: Plate[] = [
  {
    id: 'plate-25kg',
    label: '25',
    weightKg: 25,
    colorToken: 'var(--plate-red)',
    textColor: '#fff7f4',
    diameter: 'xl',
    pattern: 'solid',
  },
  {
    id: 'plate-20kg',
    label: '20',
    weightKg: 20,
    colorToken: 'var(--plate-blue)',
    textColor: '#eff8ff',
    diameter: 'xl',
    pattern: 'stripe',
  },
  {
    id: 'plate-15kg',
    label: '15',
    weightKg: 15,
    colorToken: 'var(--plate-yellow)',
    textColor: '#19160f',
    diameter: 'lg',
    pattern: 'grid',
  },
  {
    id: 'plate-10kg',
    label: '10',
    weightKg: 10,
    colorToken: 'var(--plate-green)',
    textColor: '#071109',
    diameter: 'lg',
    pattern: 'dot',
  },
  {
    id: 'plate-5kg',
    label: '5',
    weightKg: 5,
    colorToken: 'var(--plate-white)',
    textColor: '#141917',
    diameter: 'md',
    pattern: 'ring',
  },
  {
    id: 'plate-2.5kg',
    label: '2.5',
    weightKg: 2.5,
    colorToken: 'var(--plate-black)',
    textColor: '#f3f0e8',
    diameter: 'sm',
    pattern: 'stripe',
  },
  {
    id: 'plate-1.25kg',
    label: '1.25',
    weightKg: 1.25,
    colorToken: 'var(--plate-sand)',
    textColor: '#111614',
    diameter: 'xs',
    pattern: 'dot',
  },
];

export const DEFAULT_INVENTORY: Inventory = {
  barbells: DEFAULT_BARBELLS,
  plates: DEFAULT_PLATES,
  availablePerSide: {
    'plate-25kg': 4,
    'plate-20kg': 4,
    'plate-15kg': 2,
    'plate-10kg': 4,
    'plate-5kg': 4,
    'plate-2.5kg': 2,
    'plate-1.25kg': 2,
  },
};

export const DEFAULT_BARBELL_ID = DEFAULT_BARBELLS[0].id;

export function createDefaultLoadSelection(
  unitPreference: WeightUnit = 'kg',
): LoadSelection {
  return {
    selectedBarId: DEFAULT_BARBELL_ID,
    platesPerSide: {},
    unitPreference,
    showBothUnits: true,
    lastUsedWeight: null,
    personalRecord: null,
    lastUpdated: null,
  };
}

export function findBarbell(inventory: Inventory, barbellId: string) {
  return (
    inventory.barbells.find((barbell) => barbell.id === barbellId) ??
    inventory.barbells[0]
  );
}

export function findPlate(inventory: Inventory, plateId: string) {
  return inventory.plates.find((plate) => plate.id === plateId);
}

export function computePerSide(plates: Plate[], platesPerSide: PlateCounts) {
  return plates
    .map((plate) => ({ plate, count: platesPerSide[plate.id] ?? 0 }))
    .filter((entry) => entry.count > 0)
    .sort((left, right) => right.plate.weightKg - left.plate.weightKg);
}

export function computeTotalWeight(
  selection: LoadSelection,
  inventory: Inventory,
): ComputedTotal {
  const barbell = findBarbell(inventory, selection.selectedBarId);
  const plateKgPerSide = computePerSide(
    inventory.plates,
    selection.platesPerSide,
  ).reduce((sum, entry) => sum + entry.plate.weightKg * entry.count, 0);
  const totalKg = roundWeight(barbell.weightKg + plateKgPerSide * 2, 2);

  return {
    totalKg,
    totalLb: convertWeight(totalKg, 'kg', 'lb'),
    barKg: barbell.weightKg,
    plateKgPerSide: roundWeight(plateKgPerSide, 2),
  };
}

export function toDisplayUnits(
  totalKg: number,
  unitPreference: WeightUnit,
  showBothUnits: boolean,
) {
  const primaryValue = convertWeight(totalKg, 'kg', unitPreference);
  const secondaryUnit = getSecondaryUnit(unitPreference);
  const secondaryValue = convertWeight(totalKg, 'kg', secondaryUnit);

  return {
    primary: formatWeight(primaryValue, unitPreference),
    secondary: showBothUnits
      ? formatWeight(secondaryValue, secondaryUnit)
      : null,
  };
}

export function suggestPlates(
  targetTotal: number,
  barWeightKg: number,
  inventory: Inventory,
  unit: WeightUnit,
): PlateSuggestion {
  const targetKg = normalizeToKg(targetTotal, unit);
  const perSideTargetKg = Math.max((targetKg - barWeightKg) / 2, 0);
  let remainingKg = roundWeight(perSideTargetKg, 2);
  const platesPerSide: PlateCounts = {};

  const sortedPlates = [...inventory.plates].sort(
    (left, right) => right.weightKg - left.weightKg,
  );

  for (const plate of sortedPlates) {
    const available =
      inventory.availablePerSide?.[plate.id] ?? Number.POSITIVE_INFINITY;
    const count = Math.min(
      Math.floor((remainingKg + 0.0001) / plate.weightKg),
      available,
    );

    if (count <= 0) {
      continue;
    }

    platesPerSide[plate.id] = count;
    remainingKg = roundWeight(remainingKg - plate.weightKg * count, 2);
  }

  const achievedPerSideKg = Object.entries(platesPerSide).reduce(
    (sum, [plateId, count]) => {
      const plate = findPlate(inventory, plateId);
      return plate ? sum + plate.weightKg * count : sum;
    },
    0,
  );

  return {
    platesPerSide,
    remainingKg,
    achievedTotalKg: roundWeight(barWeightKg + achievedPerSideKg * 2, 2),
  };
}
