import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeToggle } from '@/components/site/theme-toggle';

export async function SiteHeader() {
  const t = await getTranslations('nav');
  const navItems = [
    { href: '/workouts', label: t('workouts') },
    { href: '/workouts/new', label: t('create') },
  ];

  return (
    <header className="bg-background/75 border-b border-white/8 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-foreground text-xl tracking-[-0.03em]"
        >
          {t('brand')}
        </Link>
        <nav
          aria-label="Primary"
          className="text-muted-foreground flex items-center gap-3 text-sm"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground focus-visible:ring-ring rounded-full px-3 py-2 transition hover:bg-white/6 focus-visible:ring-2 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/workouts/new">{t('startBuilding')}</Link>
          </Button>
          <LocaleSwitcher label={t('language')} />
          <ThemeToggle label={t('toggleTheme')} />
        </nav>
      </div>
    </header>
  );
}
