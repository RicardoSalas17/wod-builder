'use client';
import { useRef, useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MovementLoadField,
  type WeightPickerCopy,
} from '@/components/weight-picker/MovementLoadField';
import { useWorkoutBuilder } from '@/hooks/use-workout-builder';
import type { BuilderState } from '@/lib/workout-builder';

const blockTypes = ['warmup', 'strength', 'metcon'] as const;

type BuilderCopy = {
  modeTag: string;
  lead: string;
  buildFlowLabel: string;
  blocksCountLabel: string;
  previewLabel: string;
  currentTitleLabel: string;
  blockLabel: string;
  subtitle: string;
  workoutTitleLabel: string;
  blockTitleLabel: string;
  workoutTitlePlaceholder: string;
  workoutBuilderTitle: string;
  addBlock: string;
  addMovement: string;
  remove: string;
  moveUp: string;
  moveDown: string;
  moveMovementUp: string;
  moveMovementDown: string;
  exportJson: string;
  clearDraft: string;
  clearConfirm: string;
  movementName: string;
  load: string;
  notes: string;
  notesPlaceholder: string;
  reps: string;
  emptyBlocks: string;
  emptyMovements: string;
  previewTitle: string;
  previewEmpty: string;
  previewEmptyMovements: string;
  previewUpdated: string;
  newMovement: string;
  blockWarmup: string;
  blockStrength: string;
  blockMetcon: string;
  importSuccess: string;
  importError: string;
  importJson: string;
  save: string;
  saving: string;
  saveSuccess: string;
  saveError: string;
  weightPicker: WeightPickerCopy;
};

type BuilderClientProps = {
  copy: BuilderCopy;
  initialState?: BuilderState;
  saveEndpoint?: string;
  saveMethod?: 'POST' | 'PATCH';
  saveRedirectHref?: string;
  storageKey?: string;
};

export function BuilderClient({
  copy,
  initialState,
  saveEndpoint = '/api/workouts',
  saveMethod = 'POST',
  saveRedirectHref,
  storageKey,
}: BuilderClientProps) {
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { state, dispatch, reset } = useWorkoutBuilder({
    initialState,
    storageKey,
  });
  const blockTitles = {
    warmup: copy.blockWarmup,
    strength: copy.blockStrength,
    metcon: copy.blockMetcon,
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch(saveEndpoint, {
        method: saveMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: state.title,
          blocks: state.blocks,
        }),
      });

      if (!response.ok) {
        throw new Error('save failed');
      }

      const data = await response.json();
      setSaveMessage(copy.saveSuccess);
      reset();
      router.push(saveRedirectHref ?? `/workouts/${data.id}`);
    } catch {
      setSaveMessage(copy.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const candidate = parsed?.workout ?? parsed;

      if (
        !candidate ||
        typeof candidate.title !== 'string' ||
        !Array.isArray(candidate.blocks)
      ) {
        throw new Error('invalid');
      }

      dispatch({ type: 'hydrate', state: candidate });
      setImportMessage(copy.importSuccess);
    } catch {
      setImportMessage(copy.importError);
    } finally {
      event.target.value = '';
    }
  };

  const handleExport = () => {
    const title = state.title || copy.workoutTitlePlaceholder;
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const filename = `${slug || 'wod'}.json`;
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      workout: state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
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
              {state.title || copy.workoutTitlePlaceholder}
            </h1>
          </div>
          <p className="page-lead">{copy.lead}</p>
          <label className="sr-only" htmlFor="wod-title">
            {copy.workoutTitleLabel}
          </label>
          <input
            id="wod-title"
            className="field-input max-w-2xl"
            value={state.title}
            onChange={(event) =>
              dispatch({ type: 'set-title', title: event.target.value })
            }
            placeholder={copy.workoutTitlePlaceholder}
          />
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? copy.saving : copy.save}
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport}>
            {copy.exportJson}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            {copy.importJson}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={handleImport}
          />
          <Button size="sm" variant="ghost" onClick={handleClear}>
            {copy.clearDraft}
          </Button>
          <p className="sr-only" aria-live="polite">
            {importMessage}
          </p>
          <p className="sr-only" aria-live="polite">
            {saveMessage}
          </p>
          {importMessage ? (
            <p className="text-muted-foreground w-full text-sm leading-6">
              {importMessage}
            </p>
          ) : null}
          {saveMessage ? (
            <p
              className={`w-full text-sm leading-6 ${
                saveMessage === copy.saveError ? 'text-rose-300' : 'text-accent'
              }`}
            >
              {saveMessage}
            </p>
          ) : null}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/8 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-label">{copy.buildFlowLabel}</p>
                <CardTitle className="mt-2 text-3xl">
                  {copy.workoutBuilderTitle}
                </CardTitle>
              </div>
              <span className="text-muted-foreground rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                {state.blocks.length} {copy.blocksCountLabel}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <MovementLoadField
              copy={copy.weightPicker}
              demo
              movementId="builder-weight-demo"
              movementName={copy.newMovement}
            />

            <div className="flex flex-wrap gap-2">
              {blockTypes.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    dispatch({
                      type: 'add-block',
                      blockType: type,
                      title: blockTitles[type],
                    })
                  }
                >
                  {copy.addBlock} {blockTitles[type]}
                </Button>
              ))}
            </div>

            {state.blocks.length === 0 ? (
              <div className="text-muted-foreground rounded-[1.5rem] border border-dashed border-white/14 bg-white/[0.03] p-5 text-sm">
                {copy.emptyBlocks}
              </div>
            ) : (
              <div className="space-y-4">
                {state.blocks.map((block, index) => (
                  <Card
                    key={block.id}
                    className="overflow-hidden border-white/10 bg-white/[0.035]"
                  >
                    <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/8 pb-5">
                      <CardTitle className="w-full">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="section-label">
                            {copy.blockLabel}{' '}
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="border-accent/25 bg-accent/10 text-accent rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                            {blockTitles[block.type]}
                          </span>
                        </div>
                        <label
                          className="sr-only"
                          htmlFor={`block-title-${block.id}`}
                        >
                          {copy.blockTitleLabel}
                        </label>
                        <input
                          id={`block-title-${block.id}`}
                          className="font-display w-full bg-transparent text-2xl leading-none tracking-[-0.02em] focus-visible:outline-none"
                          value={block.title}
                          onChange={(event) =>
                            dispatch({
                              type: 'update-block-title',
                              blockId: block.id,
                              title: event.target.value,
                            })
                          }
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
                          disabled={index === 0}
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
                          disabled={index === state.blocks.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
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
                      {block.movements.length === 0 ? (
                        <p className="text-muted-foreground text-sm leading-6">
                          {copy.emptyMovements}
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {block.movements.map((movement, movementIndex) => (
                            <div
                              key={movement.id}
                              className="space-y-4 rounded-[1.35rem] border border-white/8 bg-black/10 p-4"
                            >
                              <div className="grid gap-2 md:grid-cols-[1.4fr_0.8fr_auto]">
                                <label
                                  className="sr-only"
                                  htmlFor={`${movement.id}-name`}
                                >
                                  {copy.movementName}
                                </label>
                                <input
                                  id={`${movement.id}-name`}
                                  className="field-input rounded-xl px-3 py-2.5"
                                  placeholder={copy.movementName}
                                  value={movement.name}
                                  onChange={(event) =>
                                    dispatch({
                                      type: 'update-movement',
                                      blockId: block.id,
                                      movementId: movement.id,
                                      patch: { name: event.target.value },
                                    })
                                  }
                                />
                                <label
                                  className="sr-only"
                                  htmlFor={`${movement.id}-reps`}
                                >
                                  {copy.reps}
                                </label>
                                <input
                                  id={`${movement.id}-reps`}
                                  className="field-input rounded-xl px-3 py-2.5"
                                  placeholder={copy.reps}
                                  value={movement.reps}
                                  onChange={(event) =>
                                    dispatch({
                                      type: 'update-movement',
                                      blockId: block.id,
                                      movementId: movement.id,
                                      patch: { reps: event.target.value },
                                    })
                                  }
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    title={copy.moveMovementUp}
                                    aria-label={copy.moveMovementUp}
                                    onClick={() =>
                                      dispatch({
                                        type: 'move-movement',
                                        blockId: block.id,
                                        movementId: movement.id,
                                        direction: 'up',
                                      })
                                    }
                                    disabled={movementIndex === 0}
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    title={copy.moveMovementDown}
                                    aria-label={copy.moveMovementDown}
                                    onClick={() =>
                                      dispatch({
                                        type: 'move-movement',
                                        blockId: block.id,
                                        movementId: movement.id,
                                        direction: 'down',
                                      })
                                    }
                                    disabled={
                                      movementIndex ===
                                      block.movements.length - 1
                                    }
                                  >
                                    ↓
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      dispatch({
                                        type: 'remove-movement',
                                        blockId: block.id,
                                        movementId: movement.id,
                                      })
                                    }
                                  >
                                    {copy.remove}
                                  </Button>
                                </div>
                              </div>

                              <label
                                className="sr-only"
                                htmlFor={`${movement.id}-notes`}
                              >
                                {copy.notes}
                              </label>
                              <textarea
                                id={`${movement.id}-notes`}
                                className="field-input min-h-24 rounded-[1.15rem]"
                                placeholder={copy.notesPlaceholder}
                                value={movement.notes ?? ''}
                                onChange={(event) =>
                                  dispatch({
                                    type: 'update-movement',
                                    blockId: block.id,
                                    movementId: movement.id,
                                    patch: { notes: event.target.value },
                                  })
                                }
                              />

                              <MovementLoadField
                                copy={copy.weightPicker}
                                movementId={movement.id}
                                movementName={movement.name || copy.newMovement}
                                onLoadSummaryChange={(summary) =>
                                  dispatch({
                                    type: 'update-movement',
                                    blockId: block.id,
                                    movementId: movement.id,
                                    patch: { load: summary },
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
                          dispatch({ type: 'add-movement', blockId: block.id })
                        }
                      >
                        {copy.addMovement}
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
                {state.title || copy.workoutTitlePlaceholder}
              </p>
            </div>
            {state.blocks.length === 0 ? (
              <p>{copy.previewEmpty}</p>
            ) : (
              <div className="space-y-4">
                {state.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="section-label">
                        {copy.blockLabel} {String(index + 1).padStart(2, '0')}
                      </p>
                      <span className="border-accent/25 bg-accent/10 text-accent rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                        {blockTitles[block.type]}
                      </span>
                    </div>
                    <p className="font-display text-foreground mt-3 text-2xl leading-none tracking-[-0.02em]">
                      {block.title}
                    </p>
                    {block.movements.length === 0 ? (
                      <p className="text-muted-foreground mt-3 text-sm">
                        {copy.previewEmptyMovements}
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2 text-sm">
                        {block.movements.map((movement) => (
                          <li
                            key={movement.id}
                            className="rounded-xl border border-white/6 bg-black/10 px-3 py-2"
                          >
                            {movement.name || copy.newMovement}
                            {movement.load ? ` · ${movement.load}` : ''}
                            {movement.reps ? ` · ${movement.reps}` : ''}
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
