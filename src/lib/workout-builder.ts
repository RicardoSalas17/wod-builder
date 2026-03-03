import { createId } from '@/domain/ids';
import type { BlockType, Movement, WorkoutBlock } from '@/domain/workouts';

export type BuilderState = {
  title: string;
  blocks: WorkoutBlock[];
};

type BuilderAction =
  | { type: 'set-title'; title: string }
  | { type: 'add-block'; blockType: BlockType; title: string }
  | { type: 'remove-block'; blockId: string }
  | { type: 'move-block'; blockId: string; direction: 'up' | 'down' }
  | { type: 'add-movement'; blockId: string }
  | { type: 'remove-movement'; blockId: string; movementId: string }
  | { type: 'hydrate'; state: BuilderState }
  | {
      type: 'update-movement';
      blockId: string;
      movementId: string;
      patch: Partial<Movement>;
    }
  | { type: 'update-block-title'; blockId: string; title: string }
  | {
      type: 'move-movement';
      blockId: string;
      movementId: string;
      direction: 'up' | 'down';
    };

export const initialBuilderState: BuilderState = {
  title: '',
  blocks: [],
};

function createBlock(type: BlockType, title: string): WorkoutBlock {
  return {
    id: createId('block'),
    type,
    title,
    movements: [],
  };
}

function createMovement(): Movement {
  return {
    id: createId('move'),
    name: '',
    notes: '',
    load: '',
    reps: '',
  };
}

export function builderReducer(
  state: BuilderState,
  action: BuilderAction,
): BuilderState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'set-title':
      return { ...state, title: action.title };
    case 'add-block':
      return {
        ...state,
        blocks: [...state.blocks, createBlock(action.blockType, action.title)],
      };
    case 'remove-block':
      return {
        ...state,
        blocks: state.blocks.filter((block) => block.id !== action.blockId),
      };
    case 'move-block': {
      const index = state.blocks.findIndex((b) => b.id === action.blockId);
      if (index === -1) return state;
      const nextIndex = action.direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= state.blocks.length) return state;

      const nextBlocks = [...state.blocks];
      const [moved] = nextBlocks.splice(index, 1);
      nextBlocks.splice(nextIndex, 0, moved);
      return { ...state, blocks: nextBlocks };
    }
    case 'add-movement':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.blockId
            ? { ...block, movements: [...block.movements, createMovement()] }
            : block,
        ),
      };
    case 'remove-movement':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.blockId
            ? {
                ...block,
                movements: block.movements.filter(
                  (movement) => movement.id !== action.movementId,
                ),
              }
            : block,
        ),
      };
    case 'update-movement':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.blockId
            ? {
                ...block,
                movements: block.movements.map((movement) =>
                  movement.id === action.movementId
                    ? { ...movement, ...action.patch }
                    : movement,
                ),
              }
            : block,
        ),
      };
    case 'update-block-title':
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.blockId
            ? { ...block, title: action.title }
            : block,
        ),
      };

    case 'move-movement':
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          if (block.id !== action.blockId) return block;
          const index = block.movements.findIndex(
            (movement) => movement.id === action.movementId,
          );
          if (index === -1) return block;
          const nextIndex = action.direction === 'up' ? index - 1 : index + 1;
          if (nextIndex < 0 || nextIndex >= block.movements.length)
            return block;

          const nextMovements = [...block.movements];
          const [moved] = nextMovements.splice(index, 1);
          nextMovements.splice(nextIndex, 0, moved);

          return { ...block, movements: nextMovements };
        }),
      };
    default:
      return state;
  }
}
