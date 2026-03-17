import { createId } from '@/domain/ids';
import type { RoutineBlock, RoutineExercise } from '@/domain/routines';

export type RoutineBuilderState = {
  title: string;
  description: string;
  focus: string;
  blocks: RoutineBlock[];
};

type RoutineBuilderAction =
  | { type: 'hydrate'; state: RoutineBuilderState }
  | { type: 'set-title'; title: string }
  | { type: 'set-description'; description: string }
  | { type: 'set-focus'; focus: string }
  | { type: 'add-block' }
  | { type: 'remove-block'; blockId: string }
  | { type: 'move-block'; blockId: string; direction: 'up' | 'down' }
  | { type: 'update-block-title'; blockId: string; title: string }
  | { type: 'add-exercise'; blockId: string }
  | { type: 'remove-exercise'; blockId: string; exerciseId: string }
  | {
      type: 'update-exercise';
      blockId: string;
      exerciseId: string;
      patch: Partial<RoutineExercise>;
    }
  | {
      type: 'move-exercise';
      blockId: string;
      exerciseId: string;
      direction: 'up' | 'down';
    };

export const initialRoutineBuilderState: RoutineBuilderState = {
  title: '',
  description: '',
  focus: '',
  blocks: [],
};

function createBlock(): RoutineBlock {
  return {
    id: createId('routine-block'),
    title: 'Nuevo bloque',
    exercises: [],
  };
}

function createExercise(): RoutineExercise {
  return {
    id: createId('routine-exercise'),
    name: '',
    targetSets: '',
    targetReps: '',
    restSeconds: '',
    notes: '',
    loadTrackingEnabled: false,
  };
}

export function routineBuilderReducer(
  state: RoutineBuilderState,
  action: RoutineBuilderAction,
): RoutineBuilderState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'set-title':
      return { ...state, title: action.title };
    case 'set-description':
      return { ...state, description: action.description };
    case 'set-focus':
      return { ...state, focus: action.focus };
    case 'add-block':
      return { ...state, blocks: [...state.blocks, createBlock()] };
    case 'remove-block':
      return {
        ...state,
        blocks: state.blocks.filter((block) => block.id !== action.blockId),
      };
    case 'move-block': {
      const index = state.blocks.findIndex(
        (block) => block.id === action.blockId,
      );
      if (index === -1) return state;
      const nextIndex = action.direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= state.blocks.length) return state;

      const nextBlocks = [...state.blocks];
      const [moved] = nextBlocks.splice(index, 1);
      nextBlocks.splice(nextIndex, 0, moved);
      return { ...state, blocks: nextBlocks };
    }
    case 'update-block-title':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.blockId
            ? { ...block, title: action.title }
            : block,
        ),
      };
    case 'add-exercise':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.blockId
            ? { ...block, exercises: [...block.exercises, createExercise()] }
            : block,
        ),
      };
    case 'remove-exercise':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.blockId
            ? {
                ...block,
                exercises: block.exercises.filter(
                  (exercise) => exercise.id !== action.exerciseId,
                ),
              }
            : block,
        ),
      };
    case 'update-exercise':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.blockId
            ? {
                ...block,
                exercises: block.exercises.map((exercise) =>
                  exercise.id === action.exerciseId
                    ? { ...exercise, ...action.patch }
                    : exercise,
                ),
              }
            : block,
        ),
      };
    case 'move-exercise':
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          if (block.id !== action.blockId) return block;
          const index = block.exercises.findIndex(
            (exercise) => exercise.id === action.exerciseId,
          );
          if (index === -1) return block;
          const nextIndex = action.direction === 'up' ? index - 1 : index + 1;
          if (nextIndex < 0 || nextIndex >= block.exercises.length)
            return block;

          const nextExercises = [...block.exercises];
          const [moved] = nextExercises.splice(index, 1);
          nextExercises.splice(nextIndex, 0, moved);

          return { ...block, exercises: nextExercises };
        }),
      };
    default:
      return state;
  }
}
