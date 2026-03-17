'use client';

import { useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MovementLoadField,
  type WeightPickerCopy,
} from '@/components/weight-picker/MovementLoadField';
import { useLogbookBuilder } from '@/hooks/use-logbook-builder';
import type { LogbookBuilderState } from '@/lib/logbook-builder';

type LogSessionBuilderCopy = {
  title: string;
  subtitle: string;
  modeTag: string;
  lead: string;
  overviewLabel: string;
  exercisesCountLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  performedAtLabel: string;
  durationLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  exerciseName: string;
  exerciseNotesLabel: string;
  setLabel: string;
  repsLabel: string;
  loadLabel: string;
  completedLabel: string;
  setNotesLabel: string;
  addExercise: string;
  addSet: string;
  remove: string;
  applyHelperLoad: string;
  helperLoadReady: string;
  previewLabel: string;
  previewTitle: string;
  previewEmpty: string;
  previewUpdated: string;
  emptyExercises: string;
  save: string;
  saving: string;
  saveSuccess: string;
  saveError: string;
  clearDraft: string;
  clearConfirm: string;
  newExercise: string;
  weightPicker: WeightPickerCopy;
};

type LogSessionBuilderClientProps = {
  copy: LogSessionBuilderCopy;
  initialState?: LogbookBuilderState;
  saveEndpoint?: string;
  saveMethod?: 'POST' | 'PATCH';
  saveRedirectHref?: string;
  storageKey?: string;
};

export function LogSessionBuilderClient({
  copy,
  initialState,
  saveEndpoint = '/api/logbook',
  saveMethod = 'POST',
  saveRedirectHref,
  storageKey,
}: LogSessionBuilderClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const router = useRouter();
  const { state, dispatch, reset } = useLogbookBuilder({
    initialState,
    storageKey,
  });
  const totalSets = state.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch(saveEndpoint, {
        method: saveMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error('save failed');
      }

      const data = await response.json();
      setSaveMessage(copy.saveSuccess);
      reset();
      router.push(saveRedirectHref ?? `/logbook/${data.id}`);
    } catch {
      setSaveMessage(copy.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    if (window.confirm(copy.clearConfirm)) {
      reset();
    }
  };

  return (
    <div className="page-shell space-y-8">
      <header className="page-header flex flex-wrap items-end justify-between gap-6">
        <div className="relative z-10 w-full max-w-3xl space-y-4">
          <span className="accent-pill">{copy.modeTag}</span>
          <div className="space-y-2">
            <p className="page-kicker">{copy.subtitle}</p>
            <h1 className="page-title">
              {state.title || copy.titlePlaceholder}
            </h1>
          </div>
          <p className="page-lead">{copy.lead}</p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="metric-chip min-w-[8rem] text-right">
            <p className="section-label">{copy.exercisesCountLabel}</p>
            <p className="metric-value">{state.exercises.length}</p>
          </div>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? copy.saving : copy.save}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClear}>
            {copy.clearDraft}
          </Button>
          <p className="sr-only" aria-live="polite">
            {saveMessage}
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/8 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-label">{copy.overviewLabel}</p>
                <CardTitle className="mt-2 text-3xl">{copy.title}</CardTitle>
              </div>
              <span className="text-muted-foreground rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                {state.exercises.length} {copy.exercisesCountLabel}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="metric-chip">
                <p className="section-label">{copy.exercisesCountLabel}</p>
                <p className="metric-value">{state.exercises.length}</p>
              </div>
              <div className="metric-chip">
                <p className="section-label">{copy.setLabel}</p>
                <p className="metric-value">{totalSets}</p>
              </div>
              <div className="metric-chip">
                <p className="section-label">{copy.performedAtLabel}</p>
                <p className="metric-value text-xl">
                  {state.performedAt || '—'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <label className="section-label" htmlFor="logbook-title">
                  {copy.titleLabel}
                </label>
                <input
                  id="logbook-title"
                  className="field-input"
                  value={state.title}
                  onChange={(event) =>
                    dispatch({ type: 'set-title', title: event.target.value })
                  }
                  placeholder={copy.titlePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <label className="section-label" htmlFor="logbook-date">
                  {copy.performedAtLabel}
                </label>
                <input
                  id="logbook-date"
                  type="date"
                  className="field-input"
                  value={state.performedAt}
                  onChange={(event) =>
                    dispatch({
                      type: 'set-performed-at',
                      performedAt: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="section-label" htmlFor="logbook-duration">
                  {copy.durationLabel}
                </label>
                <input
                  id="logbook-duration"
                  className="field-input"
                  value={state.durationMinutes}
                  onChange={(event) =>
                    dispatch({
                      type: 'set-duration-minutes',
                      durationMinutes: event.target.value,
                    })
                  }
                  placeholder="45"
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="section-label" htmlFor="logbook-notes">
                  {copy.notesLabel}
                </label>
                <textarea
                  id="logbook-notes"
                  className="field-input min-h-24"
                  value={state.notes}
                  onChange={(event) =>
                    dispatch({ type: 'set-notes', notes: event.target.value })
                  }
                  placeholder={copy.notesPlaceholder}
                />
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch({ type: 'add-exercise' })}
            >
              {copy.addExercise}
            </Button>

            {state.exercises.length === 0 ? (
              <div className="text-muted-foreground rounded-[1.5rem] border border-dashed border-white/14 bg-white/[0.03] p-5 text-sm">
                {copy.emptyExercises}
              </div>
            ) : (
              <div className="space-y-4">
                {state.exercises.map((exercise, exerciseIndex) => (
                  <Card
                    key={exercise.id}
                    className="module-card overflow-hidden border-white/10 bg-white/[0.035]"
                  >
                    <CardHeader className="border-b border-white/8 pb-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="w-full max-w-2xl space-y-3">
                          <span className="section-label">
                            {copy.exerciseName}{' '}
                            {String(exerciseIndex + 1).padStart(2, '0')}
                          </span>
                          <input
                            className="field-input"
                            placeholder={copy.exerciseName}
                            value={exercise.name}
                            onChange={(event) =>
                              dispatch({
                                type: 'update-exercise',
                                exerciseId: exercise.id,
                                patch: { name: event.target.value },
                              })
                            }
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            dispatch({
                              type: 'remove-exercise',
                              exerciseId: exercise.id,
                            })
                          }
                        >
                          {copy.remove}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <textarea
                        className="field-input min-h-20"
                        placeholder={copy.exerciseNotesLabel}
                        value={exercise.notes ?? ''}
                        onChange={(event) =>
                          dispatch({
                            type: 'update-exercise',
                            exerciseId: exercise.id,
                            patch: { notes: event.target.value },
                          })
                        }
                      />

                      {exercise.loadTrackingEnabled ? (
                        <div className="space-y-3">
                          <MovementLoadField
                            copy={copy.weightPicker}
                            movementId={exercise.id}
                            movementName={exercise.name || copy.newExercise}
                            onLoadSummaryChange={(summary) =>
                              dispatch({
                                type: 'update-exercise',
                                exerciseId: exercise.id,
                                patch: { helperLoad: summary },
                              })
                            }
                          />
                          {exercise.helperLoad ? (
                            <div className="module-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border-white/8 bg-black/10 px-4 py-3">
                              <p className="text-sm">
                                {copy.helperLoadReady}: {exercise.helperLoad}
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  dispatch({
                                    type: 'apply-helper-load',
                                    exerciseId: exercise.id,
                                    load: exercise.helperLoad ?? '',
                                  })
                                }
                              >
                                {copy.applyHelperLoad}
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="space-y-3">
                        {exercise.sets.map((set) => (
                          <div
                            key={set.id}
                            className="module-card rounded-[1.35rem] border-white/8 bg-black/10 p-4"
                          >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                              <span className="section-label">
                                {copy.setLabel} {set.setNumber}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  dispatch({
                                    type: 'remove-set',
                                    exerciseId: exercise.id,
                                    setId: set.id,
                                  })
                                }
                                disabled={exercise.sets.length === 1}
                              >
                                {copy.remove}
                              </Button>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                              <input
                                className="field-input rounded-xl px-3 py-2.5"
                                placeholder={copy.repsLabel}
                                value={set.reps ?? ''}
                                onChange={(event) =>
                                  dispatch({
                                    type: 'update-set',
                                    exerciseId: exercise.id,
                                    setId: set.id,
                                    patch: { reps: event.target.value },
                                  })
                                }
                              />
                              <input
                                className="field-input rounded-xl px-3 py-2.5"
                                placeholder={copy.loadLabel}
                                value={set.load ?? ''}
                                onChange={(event) =>
                                  dispatch({
                                    type: 'update-set',
                                    exerciseId: exercise.id,
                                    setId: set.id,
                                    patch: { load: event.target.value },
                                  })
                                }
                              />
                              <label className="text-foreground flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm">
                                <input
                                  type="checkbox"
                                  checked={set.completed}
                                  className="h-4 w-4 accent-[var(--accent)]"
                                  onChange={(event) =>
                                    dispatch({
                                      type: 'update-set',
                                      exerciseId: exercise.id,
                                      setId: set.id,
                                      patch: {
                                        completed: event.target.checked,
                                      },
                                    })
                                  }
                                />
                                {copy.completedLabel}
                              </label>
                              <input
                                className="field-input rounded-xl px-3 py-2.5"
                                placeholder={copy.setNotesLabel}
                                value={set.notes ?? ''}
                                onChange={(event) =>
                                  dispatch({
                                    type: 'update-set',
                                    exerciseId: exercise.id,
                                    setId: set.id,
                                    patch: { notes: event.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          dispatch({ type: 'add-set', exerciseId: exercise.id })
                        }
                      >
                        {copy.addSet}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden lg:sticky lg:top-6 lg:self-start">
          <CardHeader className="border-b border-white/8 pb-5">
            <div>
              <p className="section-label">{copy.previewLabel}</p>
              <CardTitle className="mt-2 text-3xl">
                {copy.previewTitle}
              </CardTitle>
            </div>
          </CardHeader>
          <div aria-live="polite" className="sr-only">
            {state.exercises.length === 0
              ? copy.previewEmpty
              : copy.previewUpdated}
          </div>
          <CardContent className="text-muted-foreground space-y-4 pt-6 text-sm">
            <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-5">
              <p className="section-label">{copy.titleLabel}</p>
              <p className="font-display text-foreground mt-3 text-3xl leading-none tracking-[-0.03em]">
                {state.title || copy.titlePlaceholder}
              </p>
              <p className="mt-3 text-sm">{state.performedAt}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="metric-chip">
                <p className="section-label">{copy.exercisesCountLabel}</p>
                <p className="metric-value">{state.exercises.length}</p>
              </div>
              <div className="metric-chip">
                <p className="section-label">{copy.setLabel}</p>
                <p className="metric-value">{totalSets}</p>
              </div>
            </div>
            {state.exercises.length === 0 ? (
              <p>{copy.previewEmpty}</p>
            ) : (
              <div className="space-y-4">
                {state.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="module-card rounded-[1.5rem] border-white/8 p-4"
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <p className="font-display text-foreground text-2xl leading-none tracking-[-0.02em]">
                        {exercise.name || copy.newExercise}
                      </p>
                      <span className="data-pill">
                        {exercise.sets.length} {copy.setLabel}
                      </span>
                    </div>
                    <ul className="relative z-10 mt-3 space-y-2 text-sm">
                      {exercise.sets.map((set) => (
                        <li
                          key={set.id}
                          className="rounded-xl border border-white/6 bg-black/10 px-3 py-3"
                        >
                          {copy.setLabel} {set.setNumber}
                          {set.reps ? ` · ${set.reps}` : ''}
                          {set.load ? ` · ${set.load}` : ''}
                          {set.completed ? ' · OK' : ' · Skip'}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
