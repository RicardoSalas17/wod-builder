import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WorkoutDetailPageProps = {
  params: { id: string };
};

export default function WorkoutDetailPage({ params }: WorkoutDetailPageProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Workout detail</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            WOD #{params.id}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            Duplicate
          </Button>
          <Button size="sm">Edit WOD</Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workout blocks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Blocks will render here once persistence is wired.</p>
            <div className="rounded-xl border border-dashed border-border/70 bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Placeholder
              </p>
              <p className="mt-2 text-sm">
                We will show warm-up, strength, and metcon blocks here.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Timer & notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Timer controls and coach notes will live on this panel.</p>
            <Button asChild size="sm" variant="ghost">
              <Link href="/workouts">Back to workouts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
