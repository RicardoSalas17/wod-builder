'use client';

import { useEffect, useReducer, useRef } from 'react';

import {
  builderReducer,
  initialBuilderState,
  type BuilderState,
} from '@/lib/workout-builder';

const STORAGE_KEY = 'wod-builder:draft:v1';

function coerceState(value: unknown): BuilderState | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as BuilderState;
  if (typeof candidate.title !== 'string') return null;
  if (!Array.isArray(candidate.blocks)) return null;
  return candidate;
}

type UseWorkoutBuilderOptions = {
  initialState?: BuilderState;
  storageKey?: string;
};

export function useWorkoutBuilder(options: UseWorkoutBuilderOptions = {}) {
  const initialState = options.initialState ?? initialBuilderState;
  const storageKey = options.storageKey ?? STORAGE_KEY;

  const [state, dispatch] = useReducer(builderReducer, initialState);
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
