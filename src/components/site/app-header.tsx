import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";

export async function AppHeader() {
  const t = await getTranslations("nav");
  const appItems = [
    { href: "/workouts", label: t("allWorkouts") },
    { href: "/workouts/new", label: t("newWorkout") },
  ];

  return (
    <header className="border-b border-border/80 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-base font-semibold text-foreground">
          {t("brand")}
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
            <Link href="/workouts/new">{t("createWod")}</Link>
          </Button>
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
