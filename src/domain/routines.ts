export type RoutineExercise = {
  id: string;
  name: string;
  targetSets?: string;
  targetReps?: string;
  restSeconds?: string;
  notes?: string;
  loadTrackingEnabled: boolean;
};

export type RoutineBlock = {
  id: string;
  title: string;
  exercises: RoutineExercise[];
};

export type Routine = {
  id: string;
  title: string;
  description?: string;
  focus?: string;
  blocks: RoutineBlock[];
  updatedAt: string;
};
