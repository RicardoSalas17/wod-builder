import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLogSessionById } from '@/data/logbook';
import { Link } from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function LogSessionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [t, session] = await Promise.all([
    getTranslations({ locale, namespace: 'logSession' }),
    getLogSessionById(id),
  ]);

  if (!session) {
    notFound();
  }

  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  type LogExerciseItem = (typeof session.exercises)[number];
  type LogSetItem = LogExerciseItem['sets'][number];
  const completedSets = session.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0,
  );
  const totalSets = session.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  return (
    <div className="page-shell space-y-8">
      <header className="page-header flex flex-wrap items-end justify-between gap-6">
        <div className="relative z-10 space-y-4">
          <span className="accent-pill">{t('detailTag')}</span>
          <div className="space-y-2">
            <p className="page-kicker">{t('title')}</p>
            <h1 className="page-title">{session.title}</h1>
          </div>
          <p className="page-lead">{session.notes || t('lead')}</p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="metric-chip min-w-[10rem]">
            <p className="section-label">{t('performedAtLabel')}</p>
            <p className="metric-value text-xl">
              {formatter.format(session.performedAt)}
            </p>
          </div>
          <Button asChild size="sm">
            <Link href={`/logbook/${session.id}/edit`}>{t('edit')}</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
        <Card className="overflow-hidden lg:sticky lg:top-6 lg:self-start">
          <CardHeader className="border-b border-white/8 pb-5">
            <CardTitle className="text-3xl">{t('summaryTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="metric-chip">
                <p className="section-label">{t('exercisesTitle')}</p>
                <p className="metric-value">{session.exercises.length}</p>
              </div>
              <div className="metric-chip">
                <p className="section-label">{t('setLabel')}</p>
                <p className="metric-value">
                  {completedSets}/{totalSets}
                </p>
              </div>
            </div>
            {session.routine ? (
              <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-4">
                <p className="section-label">{t('routineLabel')}</p>
                <p className="mt-2 font-medium">{session.routine.title}</p>
              </div>
            ) : null}
            {session.durationMinutes ? (
              <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-4">
                <p className="section-label">{t('durationLabel')}</p>
                <p className="mt-2">{session.durationMinutes} min</p>
              </div>
            ) : null}
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="w-full justify-center"
            >
              <Link href="/logbook">{t('back')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/8 pb-5">
            <CardTitle className="text-3xl">{t('exercisesTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            {session.exercises.map((exercise: LogExerciseItem) => (
              <div
                key={exercise.id}
                className="module-card rounded-[1.5rem] border-white/8 p-5"
              >
                <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-display text-2xl leading-none tracking-[-0.02em]">
                    {exercise.name}
                  </h3>
                  <span className="data-pill">
                    {exercise.sets.length} {t('setLabel')}
                  </span>
                </div>
                {exercise.notes ? (
                  <p className="text-muted-foreground mt-3 leading-6">
                    {exercise.notes}
                  </p>
                ) : null}
                <div className="relative z-10 mt-4 grid gap-3 md:grid-cols-2">
                  {exercise.sets.map((set: LogSetItem) => (
                    <div
                      key={set.id}
                      className={`rounded-2xl border px-4 py-4 ${
                        set.completed
                          ? 'border-[rgba(76,173,56,0.24)] bg-[rgba(76,173,56,0.08)]'
                          : 'border-white/6 bg-black/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">
                          {t('setLabel')} {set.setNumber}
                        </p>
                        <span className="data-pill text-[0.68rem] tracking-[0.18em]">
                          {set.completed ? t('doneTag') : t('skippedTag')}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs tracking-[0.14em] uppercase">
                        {set.reps ? (
                          <span className="data-pill">{set.reps}</span>
                        ) : null}
                        {set.load ? (
                          <span className="data-pill">{set.load}</span>
                        ) : null}
                        {set.notes ? (
                          <span className="data-pill">{set.notes}</span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
