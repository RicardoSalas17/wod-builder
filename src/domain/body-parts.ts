export const BODY_PARTS = [
  'CHEST',
  'BACK',
  'LEGS',
  'SHOULDERS',
  'ARMS',
  'CORE',
  'CARDIO',
] as const;

export type BodyPart = (typeof BODY_PARTS)[number];
