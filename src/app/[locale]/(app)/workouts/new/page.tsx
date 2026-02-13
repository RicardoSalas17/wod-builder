import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewWorkoutPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">Create workout</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Build a new WOD
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workout builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Add Warm-up, Strength, and Metcon blocks. Reorder movements with
              accessible controls and preview the session as you build.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                Add block
              </Button>
              <Button size="sm" variant="ghost">
                Import template
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Live preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Preview will appear here as you add blocks.</p>
            <div className="rounded-xl border border-dashed border-border/70 bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Empty preview
              </p>
              <p className="mt-2 text-sm">
                Add a block to start generating a coach-ready flow.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
