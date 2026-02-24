"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { blockLabelMap } from "@/domain/workouts-helpers";
import { useWorkoutBuilder } from "@/hooks/use-workout-builder";

const blockTypes = ["warmup", "strength", "metcon"] as const;

export default function NewWorkoutPage() {
  const { state, dispatch } = useWorkoutBuilder();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Create workout</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Build a new WOD
          </h1>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workout builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {blockTypes.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant="outline"
                  onClick={() => dispatch({ type: "add-block", blockType: type })}
                >
                  Add {blockLabelMap[type]}
                </Button>
              ))}
            </div>

            {state.blocks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 bg-background p-4 text-sm text-muted-foreground">
                Add a block to start building your workout.
              </div>
            ) : (
              <div className="space-y-4">
                {state.blocks.map((block, index) => (
                  <Card key={block.id} className="border-2 border-accent/60">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                      <CardTitle>{block.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move block up"
                          onClick={() =>
                            dispatch({
                              type: "move-block",
                              blockId: block.id,
                              direction: "up",
                            })
                          }
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move block down"
                          onClick={() =>
                            dispatch({
                              type: "move-block",
                              blockId: block.id,
                              direction: "down",
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
                            dispatch({ type: "remove-block", blockId: block.id })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {block.movements.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No movements yet. Add the first one.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {block.movements.map((movement) => (
                            <div
                              key={movement.id}
                              className="grid gap-2 rounded-lg border border-border/60 bg-background p-3 md:grid-cols-[1.4fr_0.8fr_0.8fr_auto]"
                            >
                              <input
                                className="w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm"
                                placeholder="Movement name"
                                value={movement.name}
                                onChange={(event) =>
                                  dispatch({
                                    type: "update-movement",
                                    blockId: block.id,
                                    movementId: movement.id,
                                    patch: { name: event.target.value },
                                  })
                                }
                              />
                              <input
                                className="w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm"
                                placeholder="Load"
                                value={movement.load}
                                onChange={(event) =>
                                  dispatch({
                                    type: "update-movement",
                                    blockId: block.id,
                                    movementId: movement.id,
                                    patch: { load: event.target.value },
                                  })
                                }
                              />
                              <input
                                className="w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm"
                                placeholder="Reps"
                                value={movement.reps}
                                onChange={(event) =>
                                  dispatch({
                                    type: "update-movement",
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
                                    type: "remove-movement",
                                    blockId: block.id,
                                    movementId: movement.id,
                                  })
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          dispatch({ type: "add-movement", blockId: block.id })
                        }
                      >
                        Add movement
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
            <CardTitle>Live preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {state.blocks.length === 0 ? (
              <p>Preview will appear here as you add blocks.</p>
            ) : (
              <div className="space-y-4">
                {state.blocks.map((block) => (
                  <div
                    key={block.id}
                    className="rounded-xl border border-accent/40 bg-background p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {block.title}
                    </p>
                    {block.movements.length === 0 ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        No movements yet.
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-1 text-sm">
                        {block.movements.map((movement) => (
                          <li key={movement.id}>
                            {movement.name || "New movement"}
                            {movement.load ? ` · ${movement.load}` : ""}
                            {movement.reps ? ` · ${movement.reps}` : ""}
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
