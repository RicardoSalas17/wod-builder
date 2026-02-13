import Link from "next/link";

import { Button } from "@/components/ui/button";

const appItems = [
  { href: "/workouts", label: "All workouts" },
  { href: "/workouts/new", label: "New workout" },
];

export function AppHeader() {
  return (
    <header className="border-b border-border/80 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-base font-semibold text-foreground">
          WOD Builder
        </Link>
        <nav
          aria-label="Workouts"
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          {appItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-1">
            <Link href="/workouts/new">Create WOD</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
