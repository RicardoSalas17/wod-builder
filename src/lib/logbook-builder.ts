import { createId } from '@/domain/ids';
import type { LogExercise, LogSet } from '@/domain/logbook';

export type LogbookBuilderState = {
  title: string;
  performedAt: string;
  notes: string;
  durationMinutes: string;
  routineId: string;
  exercises: LogExercise[];
};

type LogbookBuilderAction =
  | { type: 'hydrate'; state: LogbookBuilderState }
  | { type: 'set-title'; title: string }
  | { type: 'set-performed-at'; performedAt: string }
  | { type: 'set-notes'; notes: string }
  | { type: 'set-duration-minutes'; durationMinutes: string }
  | { type: 'add-exercise' }
  | { type: 'remove-exercise'; exerciseId: string }
  | { type: 'add-set'; exerciseId: string }
  | { type: 'remove-set'; exerciseId: string; setId: string }
  | { type: 'apply-helper-load'; exerciseId: string; load: string }
  | { type: 'update-exercise'; exerciseId: string; patch: Partial<LogExercise> }
  | {
      type: 'update-set';
      exerciseId: string;
      setId: string;
      patch: Partial<LogSet>;
    };

export const initialLogbookBuilderState: LogbookBuilderState = {
  title: '',
  performedAt: new Date().toISOString().slice(0, 10),
  notes: '',
  durationMinutes: '',
  routineId: '',
  exercises: [],
};

function createSet(setNumber: number): LogSet {
  return {
    id: createId('log-set'),
    setNumber,
    reps: '',
    load: '',
    completed: true,
    notes: '',
  };
}

function createExercise(): LogExercise {
  return {
    id: createId('log-exercise'),
    name: '',
    notes: '',
    loadTrackingEnabled: false,
    helperLoad: '',
    sets: [createSet(1)],
  };
}

function renumberSets(sets: LogSet[]) {
  return sets.map((set, index) => ({ ...set, setNumber: index + 1 }));
}

export function logbookBuilderReducer(
  state: LogbookBuilderState,
  action: LogbookBuilderAction,
): LogbookBuilderState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'set-title':
      return { ...state, title: action.title };
    case 'set-performed-at':
      return { ...state, performedAt: action.performedAt };
    case 'set-notes':
      return { ...state, notes: action.notes };
    case 'set-duration-minutes':
      return { ...state, durationMinutes: action.durationMinutes };
    case 'add-exercise':
      return { ...state, exercises: [...state.exercises, createExercise()] };
    case 'remove-exercise':
      return {
        ...state,
        exercises: state.exercises.filter(
          (exercise) => exercise.id !== action.exerciseId,
        ),
      };
    case 'add-set':
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.exerciseId
            ? {
                ...exercise,
                sets: [...exercise.sets, createSet(exercise.sets.length + 1)],
              }
            : exercise,
        ),
      };
    case 'remove-set':
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.exerciseId
            ? {
                ...exercise,
                sets: renumberSets(
                  exercise.sets.filter((set) => set.id !== action.setId),
                ),
              }
            : exercise,
        ),
      };
    case 'apply-helper-load':
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.exerciseId
            ? {
                ...exercise,
                helperLoad: action.load,
                sets: exercise.sets.map((set) =>
                  set.load ? set : { ...set, load: action.load },
                ),
              }
            : exercise,
        ),
      };
    case 'update-exercise':
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.exerciseId
            ? { ...exercise, ...action.patch }
            : exercise,
        ),
      };
    case 'update-set':
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id === action.setId ? { ...set, ...action.patch } : set,
                ),
              }
            : exercise,
        ),
      };
    default:
      return state;
  }
}
