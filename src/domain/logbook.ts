export type LogSet = {
  id: string;
  setNumber: number;
  reps?: string;
  load?: string;
  completed: boolean;
  notes?: string;
};

export type LogExercise = {
  id: string;
  name: string;
  notes?: string;
  loadTrackingEnabled: boolean;
  helperLoad?: string;
  sets: LogSet[];
};

export type LogSession = {
  id: string;
  title: string;
  performedAt: string;
  notes?: string;
  durationMinutes?: string;
  routineId?: string;
  exercises: LogExercise[];
  updatedAt: string;
};
