export type BlockType = "warmup" | "strength" | "metcon";

export type Movement = {
  id: string;
  name: string;
  notes?: string;
  load?: string;
  reps?: string;
};

export type WorkoutBlock = {
  id: string;
  type: BlockType;
  title: string;
  movements: Movement[];
};

export type Workout = {
  id: string;
  title: string;
  blocks: WorkoutBlock[];
  updatedAt: string;
};
