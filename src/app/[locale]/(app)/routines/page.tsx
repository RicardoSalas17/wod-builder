import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listRoutines } from '@/data/routines';
import { Link } from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function RoutinesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'routines' });
  const routines = await listRoutines();
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  type RoutineListItem = Awaited<ReturnType<typeof listRoutines>>[number];

  return (
    <div className="page-shell space-y-8">
      <header className="page-header flex flex-wrap items-end justify-between gap-6">
        <div className="relative z-10 space-y-4">
          <span className="accent-pill">{t('libraryTag')}</span>
          <div className="space-y-2">
            <p className="page-kicker">{t('subtitle')}</p>
            <h1 className="page-title">{t('title')}</h1>
          </div>
          <p className="page-lead">{t('lead')}</p>
        </div>
        <div className="relative z-10 grid w-full max-w-md gap-3 sm:grid-cols-[1fr_auto] lg:w-auto">
          <div className="metric-chip text-right sm:min-w-[10rem]">
            <p className="section-label">{t('totalLabel')}</p>
            <p className="metric-value">{routines.length}</p>
          </div>
          <div className="flex items-center justify-end">
            <Button asChild size="lg">
              <Link href="/routines/new">{t('create')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {routines.length === 0 ? (
        <Card className="border-dashed border-white/12">
          <CardHeader className="space-y-3">
            <span className="accent-pill w-fit">{t('emptyTag')}</span>
            <CardTitle className="text-3xl">{t('emptyTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-5 text-sm sm:text-base">
            <p className="max-w-2xl leading-7">{t('emptyBody')}</p>
            <Button asChild size="lg">
              <Link href="/routines/new">{t('emptyCta')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {routines.map((routine: RoutineListItem, index: number) => {
            const exercisesCount = routine.blocks.reduce(
              (total: number, block: RoutineListItem['blocks'][number]) =>
                total + block.exercises.length,
              0,
            );

            return (
              <Card
                key={routine.id}
                className="module-card group gap-0 border-white/10 py-0"
              >
                <CardHeader className="relative z-10 space-y-4 border-b border-white/8 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="section-label">
                      {t('sessionLabel')} {String(index + 1).padStart(2, '0')}
                    </span>
                    {routine.focus ? (
                      <span className="data-pill border-accent/25 bg-accent/10 text-accent">
                        {routine.focus}
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl leading-tight">
                      {routine.title || t('untitled')}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                      {t('updatedLabel')} {formatter.format(routine.updatedAt)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-5 pt-5 pb-6">
                  <p className="text-muted-foreground text-sm leading-6">
                    {routine.description || t('cardBody')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="data-pill">
                      {routine._count.blocks} {t('blocksCountLabel')}
                    </span>
                    <span className="data-pill">
                      {exercisesCount} {t('exercisesCountLabel')}
                    </span>
                    <span className="data-pill">
                      {routine._count.sessions} {t('sessionsCountLabel')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-1">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/routines/${routine.id}`}>{t('open')}</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/logbook/new?routineId=${routine.id}`}>
                        {t('logSession')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
