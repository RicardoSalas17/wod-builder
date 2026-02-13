"use client";

import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { defaultLocale, locales } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale =
    typeof params.locale === "string" ? params.locale : defaultLocale;

  const basePath = pathname || "/";

  return (
    <nav
      aria-label="Language"
      className="flex items-center rounded-full border border-border/60 bg-background/70 p-1 text-xs"
    >
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={basePath}
            locale={locale}
            className={cn(
              "rounded-full px-2.5 py-1 font-semibold uppercase tracking-wide transition",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={isActive ? "true" : undefined}
          >
            {locale}
          </Link>
        );
      })}
    </nav>
  );
}
