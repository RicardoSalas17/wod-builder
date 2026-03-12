'use client';

import { useParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { defaultLocale, locales } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type LocaleSwitcherProps = {
  label: string;
};

export function LocaleSwitcher({ label }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale =
    typeof params.locale === 'string' ? params.locale : defaultLocale;

  const basePath = (() => {
    if (!pathname) {
      return '/';
    }
    const localePrefix = `/${currentLocale}`;
    if (pathname === localePrefix) {
      return '/';
    }
    if (pathname.startsWith(`${localePrefix}/`)) {
      return pathname.slice(localePrefix.length);
    }
    return pathname;
  })();

  return (
    <nav
      aria-label={label}
      className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 text-xs backdrop-blur-sm"
    >
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={basePath}
            locale={locale}
            className={cn(
              'rounded-full px-2.5 py-1 font-semibold tracking-wide uppercase transition',
              isActive
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
            )}
            aria-current={isActive ? 'true' : undefined}
          >
            {locale}
          </Link>
        );
      })}
    </nav>
  );
}
