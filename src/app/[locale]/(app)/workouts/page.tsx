import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Workouts</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your workout library
          </h1>
        </div>
        <Button asChild>
          <Link href="/workouts/new">Create WOD</Link>
        </Button>
      </header>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No workouts yet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Start by creating your first workout. You can add blocks for warm-up,
            strength, and metcon, then preview the full flow.
          </p>
          <Button asChild size="sm">
            <Link href="/workouts/new">Build your first WOD</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
