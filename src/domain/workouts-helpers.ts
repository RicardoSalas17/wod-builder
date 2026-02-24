import type { BlockType, WorkoutBlock } from "./workouts";

export const blockLabelMap: Record<BlockType, string> = {
  warmup: "Warm-up",
  strength: "Strength",
  metcon: "Metcon",
};

export function createEmptyBlock(type: BlockType): WorkoutBlock {
  return {
    id: crypto.randomUUID(),
    type,
    title: blockLabelMap[type],
    movements: [],
  };
}

export function createEmptyMovement() {
  return {
    id: crypto.randomUUID(),
    name: "",
    notes: "",
    load: "",
    reps: "",
  };
}
