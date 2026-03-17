import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/components/site/locale-switcher';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { Button } from '@/components/ui/button';

export async function AppHeader() {
  const t = await getTranslations('nav');
  const appItems = [
    { href: '/workouts', label: t('allWorkouts') },
    { href: '/routines', label: t('allRoutines') },
    { href: '/logbook', label: t('allLogbook') },
    { href: '/workouts/new', label: t('newWorkout') },
  ];

  return (
    <header className="bg-background/75 border-b border-white/8 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-foreground text-xl tracking-[-0.03em]"
        >
          {t('brand')}
        </Link>
        <nav
          aria-label="Workouts"
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          {appItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full px-3.5 py-2 transition hover:bg-white/6 focus-visible:ring-2 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-1">
            <Link href="/workouts/new">{t('createWod')}</Link>
          </Button>
          <LocaleSwitcher label={t('language')} />
          <ThemeToggle label={t('toggleTheme')} />
        </nav>
      </div>
    </header>
  );
}
