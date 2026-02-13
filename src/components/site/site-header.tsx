import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";

const navItems = [
  { href: "/workouts", label: "Workouts" },
  { href: "/workouts/new", label: "Create" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          WOD Builder
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-4 text-sm text-muted-foreground"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/workouts/new">Start building</Link>
          </Button>
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
