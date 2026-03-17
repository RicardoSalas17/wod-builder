'use client';

import { useEffect, useReducer, useRef } from 'react';

import {
  initialRoutineBuilderState,
  routineBuilderReducer,
  type RoutineBuilderState,
} from '@/lib/routine-builder';

const STORAGE_KEY = 'wod-builder:routine-draft:v1';

function coerceState(value: unknown): RoutineBuilderState | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as RoutineBuilderState;
  if (typeof candidate.title !== 'string') return null;
  if (typeof candidate.description !== 'string') return null;
  if (typeof candidate.focus !== 'string') return null;
  if (!Array.isArray(candidate.blocks)) return null;
  return candidate;
}

type UseRoutineBuilderOptions = {
  initialState?: RoutineBuilderState;
  storageKey?: string;
};

export function useRoutineBuilder(options: UseRoutineBuilderOptions = {}) {
  const initialState = options.initialState ?? initialRoutineBuilderState;
  const storageKey = options.storageKey ?? STORAGE_KEY;

  const [state, dispatch] = useReducer(routineBuilderReducer, initialState);
  const shouldSkipPersist = useRef(true);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const nextState = coerceState(parsed);
        if (nextState) {
          dispatch({ type: 'hydrate', state: nextState });
        }
      } catch {
        // ignore invalid drafts
      }
    } else {
      dispatch({ type: 'hydrate', state: initialState });
    }
    shouldSkipPersist.current = true;
  }, [initialState, storageKey]);

  useEffect(() => {
    if (shouldSkipPersist.current) {
      shouldSkipPersist.current = false;
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  return {
    state,
    dispatch,
    reset: () => {
      dispatch({ type: 'hydrate', state: initialState });
      localStorage.removeItem(storageKey);
    },
  };
}
