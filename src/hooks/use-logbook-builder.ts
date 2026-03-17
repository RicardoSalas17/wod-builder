'use client';

import { useEffect, useReducer, useRef } from 'react';

import {
  initialLogbookBuilderState,
  logbookBuilderReducer,
  type LogbookBuilderState,
} from '@/lib/logbook-builder';

const STORAGE_KEY = 'wod-builder:logbook-draft:v1';

function coerceState(value: unknown): LogbookBuilderState | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as LogbookBuilderState;
  if (typeof candidate.title !== 'string') return null;
  if (typeof candidate.performedAt !== 'string') return null;
  if (typeof candidate.notes !== 'string') return null;
  if (typeof candidate.durationMinutes !== 'string') return null;
  if (typeof candidate.routineId !== 'string') return null;
  if (!Array.isArray(candidate.exercises)) return null;
  return candidate;
}

type UseLogbookBuilderOptions = {
  initialState?: LogbookBuilderState;
  storageKey?: string;
};

export function useLogbookBuilder(options: UseLogbookBuilderOptions = {}) {
  const initialState = options.initialState ?? initialLogbookBuilderState;
  const storageKey = options.storageKey ?? STORAGE_KEY;

  const [state, dispatch] = useReducer(logbookBuilderReducer, initialState);
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
