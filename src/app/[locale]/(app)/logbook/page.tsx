import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listRoutines } from '@/data/routines';
import { listLogSessions } from '@/data/logbook';
import { Link } from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function LogbookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    query?: string;
    routineId?: string;
    source?: 'all' | 'routine' | 'free';
  }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'logbook' });
  const selectedSource = resolvedSearchParams.source ?? 'all';
  const selectedRoutineId = resolvedSearchParams.routineId ?? '';
  const currentQuery = resolvedSearchParams.query ?? '';
  const [sessions, routines] = await Promise.all([
    listLogSessions({
      query: currentQuery,
      routineId: selectedRoutineId || undefined,
      source: selectedSource,
    }),
    listRoutines(),
  ]);
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  type LogSessionListItem = Awaited<ReturnType<typeof listLogSessions>>[number];

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
            <p className="metric-value">{sessions.length}</p>
          </div>
          <div className="flex items-center justify-end">
            <Button asChild size="lg">
              <Link href="/logbook/new">{t('create')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <Card className="overflow-hidden border-white/10">
        <CardHeader className="border-b border-white/8 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-label">{t('filtersLabel')}</p>
              <CardTitle className="mt-2 text-3xl">
                {t('filtersTitle')}
              </CardTitle>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/logbook">{t('clearFilters')}</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.7fr_auto]">
            <div className="space-y-2">
              <label className="section-label" htmlFor="logbook-query">
                {t('searchLabel')}
              </label>
              <input
                id="logbook-query"
                name="query"
                defaultValue={currentQuery}
                className="field-input"
                placeholder={t('searchPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label className="section-label" htmlFor="logbook-routine-filter">
                {t('routineFilterLabel')}
              </label>
              <select
                id="logbook-routine-filter"
                name="routineId"
                defaultValue={selectedRoutineId}
                className="field-input"
              >
                <option value="">{t('allRoutines')}</option>
                {routines.map((routine) => (
                  <option key={routine.id} value={routine.id}>
                    {routine.title || t('untitledRoutine')}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="section-label" htmlFor="logbook-source-filter">
                {t('sourceFilterLabel')}
              </label>
              <select
                id="logbook-source-filter"
                name="source"
                defaultValue={selectedSource}
                className="field-input"
              >
                <option value="all">{t('sourceAll')}</option>
                <option value="routine">{t('sourceRoutine')}</option>
                <option value="free">{t('sourceFree')}</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full lg:w-auto">
                {t('applyFilters')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {sessions.length === 0 ? (
        <Card className="border-dashed border-white/12">
          <CardHeader className="space-y-3">
            <span className="accent-pill w-fit">{t('emptyTag')}</span>
            <CardTitle className="text-3xl">{t('emptyTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-5 text-sm sm:text-base">
            <p className="max-w-2xl leading-7">{t('emptyBody')}</p>
            <Button asChild size="lg" variant="outline">
              <Link href="/routines">{t('emptyCta')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session: LogSessionListItem, index: number) => (
            <Card
              key={session.id}
              className="module-card group gap-0 border-white/10 py-0"
            >
              <CardHeader className="relative z-10 space-y-4 border-b border-white/8 pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-3">
                    <span className="section-label">
                      {t('sessionLabel')} {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="timeline-dot" aria-hidden="true" />
                      <span className="text-muted-foreground">
                        {formatter.format(session.performedAt)}
                      </span>
                    </div>
                  </div>
                  {session.routine ? (
                    <span className="data-pill border-accent/25 bg-accent/10 text-accent">
                      {t('fromRoutine')}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl leading-tight">
                    {session.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-5 pt-5 pb-6">
                <p className="text-muted-foreground text-sm leading-6">
                  {session.routine?.title || t('cardBody')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="data-pill">
                    {session._count.exercises} {t('exercisesCountLabel')}
                  </span>
                  {session.durationMinutes ? (
                    <span className="data-pill">
                      {session.durationMinutes} {t('minutesShort')}
                    </span>
                  ) : null}
                </div>
                <div className="border-t border-white/8 pt-1">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/logbook/${session.id}`}>{t('open')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
