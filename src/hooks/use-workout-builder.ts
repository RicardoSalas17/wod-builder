"use client";

import { useEffect, useReducer, useState } from "react";

import {
  builderReducer,
  initialBuilderState,
  type BuilderState,
} from "@/lib/workout-builder";

const STORAGE_KEY = "wod-builder:draft:v1";

function coerceState(value: unknown): BuilderState | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as BuilderState;
  if (typeof candidate.title !== "string") return null;
  if (!Array.isArray(candidate.blocks)) return null;
  return candidate;
}

export function useWorkoutBuilder() {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const nextState = coerceState(parsed);
        if (nextState) {
          dispatch({ type: "hydrate", state: nextState });
        }
      } catch {
        // ignore invalid drafts
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, isHydrated]);

  return {
    state,
    dispatch,
    reset: () => {
      dispatch({ type: "hydrate", state: initialBuilderState });
      localStorage.removeItem(STORAGE_KEY);
    },
  };
}
