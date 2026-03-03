'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkoutBuilder } from '@/hooks/use-workout-builder';

const blockTypes = ['warmup', 'strength', 'metcon'] as const;

type BuilderCopy = {
  subtitle: string;
  workoutTitleLabel: string;
  workoutTitlePlaceholder: string;
  workoutBuilderTitle: string;
  addBlock: string;
  addMovement: string;
  remove: string;
  moveUp: string;
  moveDown: string;
  movementName: string;
  load: string;
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
};

type BuilderClientProps = {
  copy: BuilderCopy;
};

export function BuilderClient({ copy }: BuilderClientProps) {
  const { state, dispatch } = useWorkoutBuilder();
  const blockTitles = {
    warmup: copy.blockWarmup,
    strength: copy.blockStrength,
    metcon: copy.blockMetcon,
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{copy.subtitle}</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {state.title || copy.workoutTitlePlaceholder}
          </h1>
          <label className="sr-only" htmlFor="wod-title">
            {copy.workoutTitleLabel}
          </label>
          <input
            id="wod-title"
            className="border-border/60 focus-visible:ring-accent mt-2 w-full max-w-md rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            value={state.title}
            onChange={(event) =>
              dispatch({ type: 'set-title', title: event.target.value })
            }
            placeholder={copy.workoutTitlePlaceholder}
          />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.workoutBuilderTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <div className="border-border/70 bg-background text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
                {copy.emptyBlocks}
              </div>
            ) : (
              <div className="space-y-4">
                {state.blocks.map((block, index) => (
                  <Card key={block.id} className="border-accent/60 border-2">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                      <CardTitle>{block.title}</CardTitle>
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
                    <CardContent className="space-y-3">
                      {block.movements.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          {copy.emptyMovements}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {block.movements.map((movement) => (
                            <div
                              key={movement.id}
                              className="border-border/60 bg-background grid gap-2 rounded-lg border p-3 md:grid-cols-[1.4fr_0.8fr_0.8fr_auto]"
                            >
                              <label
                                className="sr-only"
                                htmlFor={`${movement.id}-name`}
                              >
                                {copy.movementName}
                              </label>
                              <input
                                id={`${movement.id}-name`}
                                className="border-border/60 focus-visible:ring-accent w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
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
                                htmlFor={`${movement.id}-load`}
                              >
                                {copy.load}
                              </label>
                              <input
                                id={`${movement.id}-load`}
                                className="border-border/60 focus-visible:ring-accent w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                                placeholder={copy.load}
                                value={movement.load}
                                onChange={(event) =>
                                  dispatch({
                                    type: 'update-movement',
                                    blockId: block.id,
                                    movementId: movement.id,
                                    patch: { load: event.target.value },
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
                                className="border-border/60 focus-visible:ring-accent w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
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

        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>{copy.previewTitle}</CardTitle>
          </CardHeader>
          <div aria-live="polite" className="sr-only">
            {state.blocks.length === 0
              ? copy.previewEmpty
              : copy.previewUpdated}
          </div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {state.title || copy.workoutTitlePlaceholder}
          </p>
          <CardContent className="text-muted-foreground space-y-4 text-sm">
            {state.blocks.length === 0 ? (
              <p>{copy.previewEmpty}</p>
            ) : (
              <div className="space-y-4">
                {state.blocks.map((block) => (
                  <div
                    key={block.id}
                    className="border-accent/40 bg-background rounded-xl border p-4"
                  >
                    <p className="text-accent text-xs font-semibold tracking-wide uppercase">
                      {block.title}
                    </p>
                    {block.movements.length === 0 ? (
                      <p className="text-muted-foreground mt-2 text-sm">
                        {copy.previewEmptyMovements}
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-1 text-sm">
                        {block.movements.map((movement) => (
                          <li key={movement.id}>
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
