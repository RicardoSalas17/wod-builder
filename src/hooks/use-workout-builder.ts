"use client";

import { useReducer } from "react";

import { builderReducer, initialBuilderState } from "@/lib/workout-builder";

export function useWorkoutBuilder() {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState);

  return {
    state,
    dispatch,
  };
}
