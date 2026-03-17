'use client';

import { useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoutineBuilder } from '@/hooks/use-routine-builder';
import type { RoutineBuilderState } from '@/lib/routine-builder';

type RoutineBuilderCopy = {
  title: string;
  subtitle: string;
  modeTag: string;
  lead: string;
  overviewLabel: string;
  blocksCountLabel: string;
  currentTitleLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  focusLabel: string;
  focusPlaceholder: string;
  builderTitle: string;
  blockLabel: string;
  blockTitleLabel: string;
  blockTitlePlaceholder: string;
  addBlock: string;
  addExercise: string;
  exerciseName: string;
  sets: string;
  reps: string;
  restSeconds: string;
  notes: string;
  notesPlaceholder: string;
  trackLoad: string;
  previewLabel: string;
  previewTitle: string;
  previewEmpty: string;
  previewUpdated: string;
  emptyBlocks: string;
  emptyExercises: string;
  save: string;
  saving: string;
  saveSuccess: string;
  saveError: string;
  clearDraft: string;
  clearConfirm: string;
  remove: string;
  moveUp: string;
  moveDown: string;
  moveExerciseUp: string;
  moveExerciseDown: string;
  newExercise: string;
};

type RoutineBuilderClientProps = {
  copy: RoutineBuilderCopy;
  initialState?: RoutineBuilderState;
  saveEndpoint?: string;
  saveMethod?: 'POST' | 'PATCH';
  saveRedirectHref?: string;
  storageKey?: string;
};

export function RoutineBuilderClient({
  copy,
  initialState,
  saveEndpoint = '/api/routines',
  saveMethod = 'POST',
  saveRedirectHref,
  storageKey,
}: RoutineBuilderClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const router = useRouter();
  const { state, dispatch, reset } = useRoutineBuilder({
    initialState,
    storageKey,
  });
  const exercisesCount = state.blocks.reduce(
    (total, block) => total + block.exercises.length,
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
      router.push(saveRedirectHref ?? `/routines/${data.id}`);
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
            <p className="section-label">{copy.blocksCountLabel}</p>
            <p className="metric-value">{state.blocks.length}</p>
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
                <CardTitle className="mt-2 text-3xl">
                  {copy.builderTitle}
                </CardTitle>
              </div>
              <span className="text-muted-foreground rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                {state.blocks.length} {copy.blocksCountLabel}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="metric-chip">
                <p className="section-label">{copy.blocksCountLabel}</p>
                <p className="metric-value">{state.blocks.length}</p>
              </div>
              <div className="metric-chip">
                <p className="section-label">{copy.exerciseName}</p>
                <p className="metric-value">{exercisesCount}</p>
              </div>
              <div className="metric-chip">
                <p className="section-label">{copy.focusLabel}</p>
                <p className="metric-value text-xl">{state.focus || '—'}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <label className="section-label" htmlFor="routine-title">
                  {copy.titleLabel}
                </label>
                <input
                  id="routine-title"
                  className="field-input"
                  value={state.title}
                  onChange={(event) =>
                    dispatch({ type: 'set-title', title: event.target.value })
                  }
                  placeholder={copy.titlePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <label className="section-label" htmlFor="routine-focus">
                  {copy.focusLabel}
                </label>
                <input
                  id="routine-focus"
                  className="field-input"
                  value={state.focus}
                  onChange={(event) =>
                    dispatch({ type: 'set-focus', focus: event.target.value })
                  }
                  placeholder={copy.focusPlaceholder}
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="section-label" htmlFor="routine-description">
                  {copy.descriptionLabel}
                </label>
                <textarea
                  id="routine-description"
                  className="field-input min-h-24"
                  value={state.description}
                  onChange={(event) =>
                    dispatch({
                      type: 'set-description',
                      description: event.target.value,
                    })
                  }
                  placeholder={copy.descriptionPlaceholder}
                />
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch({ type: 'add-block' })}
            >
              {copy.addBlock}
            </Button>

            {state.blocks.length === 0 ? (
              <div className="text-muted-foreground rounded-[1.5rem] border border-dashed border-white/14 bg-white/[0.03] p-5 text-sm">
                {copy.emptyBlocks}
              </div>
            ) : (
              <div className="space-y-4">
                {state.blocks.map((block, blockIndex) => (
                  <Card
                    key={block.id}
                    className="module-card overflow-hidden border-white/10 bg-white/[0.035]"
                  >
                    <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/8 pb-5">
                      <CardTitle className="w-full">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="section-label">
                            {copy.blockLabel}{' '}
                            {String(blockIndex + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <input
                          className="font-display w-full bg-transparent text-2xl leading-none tracking-[-0.02em] focus-visible:outline-none"
                          value={block.title}
                          onChange={(event) =>
                            dispatch({
                              type: 'update-block-title',
                              blockId: block.id,
                              title: event.target.value,
                            })
                          }
                          placeholder={copy.blockTitlePlaceholder}
                        />
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          title={copy.moveUp}
                          aria-label={copy.moveUp}
                          onClick={() =>
                            dispatch({
                              type: 'move-block',
                              blockId: block.id,
                              direction: 'up',
                            })
                          }
                          disabled={blockIndex === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title={copy.moveDown}
                          aria-label={copy.moveDown}
                          onClick={() =>
                            dispatch({
                              type: 'move-block',
                              blockId: block.id,
                              direction: 'down',
                            })
                          }
                          disabled={blockIndex === state.blocks.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            dispatch({
                              type: 'remove-block',
                              blockId: block.id,
                            })
                          }
                        >
                          {copy.remove}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      {block.exercises.length === 0 ? (
                        <p className="text-muted-foreground text-sm leading-6">
                          {copy.emptyExercises}
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {block.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exercise.id}
                              className="module-card space-y-4 rounded-[1.35rem] border-white/8 bg-black/10 p-4"
                            >
                              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <input
                                  className="field-input rounded-xl px-3 py-2.5 xl:col-span-2"
                                  placeholder={copy.exerciseName}
                                  value={exercise.name}
                                  onChange={(event) =>
                                    dispatch({
                                      type: 'update-exercise',
                                      blockId: block.id,
                                      exerciseId: exercise.id,
                                      patch: { name: event.target.value },
                                    })
                                  }
                                />
                                <input
                                  className="field-input rounded-xl px-3 py-2.5"
                                  placeholder={copy.sets}
                                  value={exercise.targetSets ?? ''}
                                  onChange={(event) =>
                                    dispatch({
                                      type: 'update-exercise',
                                      blockId: block.id,
                                      exerciseId: exercise.id,
                                      patch: { targetSets: event.target.value },
                                    })
                                  }
                                />
                                <input
                                  className="field-input rounded-xl px-3 py-2.5"
                                  placeholder={copy.reps}
                                  value={exercise.targetReps ?? ''}
                                  onChange={(event) =>
                                    dispatch({
                                      type: 'update-exercise',
                                      blockId: block.id,
                                      exerciseId: exercise.id,
                                      patch: { targetReps: event.target.value },
                                    })
                                  }
                                />
                                <input
                                  className="field-input rounded-xl px-3 py-2.5"
                                  placeholder={copy.restSeconds}
                                  value={exercise.restSeconds ?? ''}
                                  onChange={(event) =>
                                    dispatch({
                                      type: 'update-exercise',
                                      blockId: block.id,
                                      exerciseId: exercise.id,
                                      patch: {
                                        restSeconds: event.target.value,
                                      },
                                    })
                                  }
                                />
                                <div className="flex items-center gap-2 xl:col-span-3 xl:justify-end">
                                  <label className="text-foreground flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={exercise.loadTrackingEnabled}
                                      className="h-4 w-4 accent-[var(--accent)]"
                                      onChange={(event) =>
                                        dispatch({
                                          type: 'update-exercise',
                                          blockId: block.id,
                                          exerciseId: exercise.id,
                                          patch: {
                                            loadTrackingEnabled:
                                              event.target.checked,
                                          },
                                        })
                                      }
                                    />
                                    {copy.trackLoad}
                                  </label>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    title={copy.moveExerciseUp}
                                    aria-label={copy.moveExerciseUp}
                                    onClick={() =>
                                      dispatch({
                                        type: 'move-exercise',
                                        blockId: block.id,
                                        exerciseId: exercise.id,
                                        direction: 'up',
                                      })
                                    }
                                    disabled={exerciseIndex === 0}
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    title={copy.moveExerciseDown}
                                    aria-label={copy.moveExerciseDown}
                                    onClick={() =>
                                      dispatch({
                                        type: 'move-exercise',
                                        blockId: block.id,
                                        exerciseId: exercise.id,
                                        direction: 'down',
                                      })
                                    }
                                    disabled={
                                      exerciseIndex ===
                                      block.exercises.length - 1
                                    }
                                  >
                                    ↓
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      dispatch({
                                        type: 'remove-exercise',
                                        blockId: block.id,
                                        exerciseId: exercise.id,
                                      })
                                    }
                                  >
                                    {copy.remove}
                                  </Button>
                                </div>
                              </div>
                              <textarea
                                className="field-input min-h-24 rounded-[1.15rem]"
                                placeholder={copy.notesPlaceholder}
                                value={exercise.notes ?? ''}
                                onChange={(event) =>
                                  dispatch({
                                    type: 'update-exercise',
                                    blockId: block.id,
                                    exerciseId: exercise.id,
                                    patch: { notes: event.target.value },
                                  })
                                }
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          dispatch({ type: 'add-exercise', blockId: block.id })
                        }
                      >
                        {copy.addExercise}
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
            {state.blocks.length === 0
              ? copy.previewEmpty
              : copy.previewUpdated}
          </div>
          <CardContent className="text-muted-foreground space-y-4 pt-6 text-sm">
            <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-5">
              <p className="section-label">{copy.currentTitleLabel}</p>
              <p className="font-display text-foreground mt-3 text-3xl leading-none tracking-[-0.03em]">
                {state.title || copy.titlePlaceholder}
              </p>
              {state.focus ? (
                <p className="mt-3 text-sm">{state.focus}</p>
              ) : null}
              {state.description ? (
                <p className="mt-3 text-sm leading-6">{state.description}</p>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="metric-chip">
                <p className="section-label">{copy.blocksCountLabel}</p>
                <p className="metric-value">{state.blocks.length}</p>
              </div>
              <div className="metric-chip">
                <p className="section-label">{copy.exerciseName}</p>
                <p className="metric-value">{exercisesCount}</p>
              </div>
            </div>
            {state.blocks.length === 0 ? (
              <p>{copy.previewEmpty}</p>
            ) : (
              <div className="space-y-4">
                {state.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="module-card rounded-[1.5rem] border-white/8 p-4"
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div>
                        <p className="section-label">
                          {copy.blockLabel} {String(index + 1).padStart(2, '0')}
                        </p>
                        <p className="font-display text-foreground mt-3 text-2xl leading-none tracking-[-0.02em]">
                          {block.title}
                        </p>
                      </div>
                      <span className="data-pill">
                        {block.exercises.length} {copy.exerciseName}
                      </span>
                    </div>
                    {block.exercises.length === 0 ? (
                      <p className="mt-3 text-sm">{copy.emptyExercises}</p>
                    ) : (
                      <ul className="relative z-10 mt-3 space-y-2 text-sm">
                        {block.exercises.map((exercise) => (
                          <li
                            key={exercise.id}
                            className="rounded-xl border border-white/6 bg-black/10 px-3 py-3"
                          >
                            {exercise.name || copy.newExercise}
                            {exercise.targetSets
                              ? ` · ${exercise.targetSets} ${copy.sets}`
                              : ''}
                            {exercise.targetReps
                              ? ` · ${exercise.targetReps}`
                              : ''}
                          </li>
                        ))}
                      </ul>
                    )}
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
