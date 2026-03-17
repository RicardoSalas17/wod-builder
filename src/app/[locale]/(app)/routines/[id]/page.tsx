import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DuplicateRoutineButton } from '@/components/routines/duplicate-routine-button';
import { getRoutineById } from '@/data/routines';
import { Link } from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [t, routine] = await Promise.all([
    getTranslations({ locale, namespace: 'routineDetail' }),
    getRoutineById(id),
  ]);

  if (!routine) {
    notFound();
  }

  type RoutineBlockItem = (typeof routine.blocks)[number];
  type RoutineExerciseItem = RoutineBlockItem['exercises'][number];
  const exercisesCount = routine.blocks.reduce(
    (total, block) => total + block.exercises.length,
    0,
  );

  return (
    <div className="page-shell space-y-8">
      <header className="page-header flex flex-wrap items-end justify-between gap-6">
        <div className="relative z-10 space-y-4">
          <span className="accent-pill">{t('detailTag')}</span>
          <div className="space-y-2">
            <p className="page-kicker">{t('title')}</p>
            <h1 className="page-title">{routine.title || t('untitled')}</h1>
          </div>
          <p className="page-lead">{routine.description || t('lead')}</p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {routine.focus ? (
            <div className="metric-chip min-w-[10rem]">
              <p className="section-label">{t('focusLabel')}</p>
              <p className="metric-value text-xl">{routine.focus}</p>
            </div>
          ) : null}
          <Button asChild size="sm" variant="outline">
            <Link href={`/logbook/new?routineId=${routine.id}`}>
              {t('logSession')}
            </Link>
          </Button>
          <DuplicateRoutineButton
            routineId={routine.id}
            copy={{
              idle: t('duplicate'),
              loading: t('duplicating'),
              error: t('duplicateError'),
            }}
          />
          <Button asChild size="sm">
            <Link href={`/routines/${routine.id}/edit`}>{t('edit')}</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
        <Card className="overflow-hidden lg:sticky lg:top-6 lg:self-start">
          <CardHeader className="border-b border-white/8 pb-5">
            <CardTitle className="text-3xl">{t('structureLabel')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            <div className="metric-chip">
              <p className="section-label">{t('blocksCountLabel')}</p>
              <p className="metric-value">{routine.blocks.length}</p>
            </div>
            <div className="metric-chip">
              <p className="section-label">{t('exercisesLabel')}</p>
              <p className="metric-value">{exercisesCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-4">
              <p className="section-label">{t('logSession')}</p>
              <p className="text-muted-foreground mt-3 leading-6">
                {t('lead')}
              </p>
              <Button asChild size="sm" className="mt-4 w-full">
                <Link href={`/logbook/new?routineId=${routine.id}`}>
                  {t('logSession')}
                </Link>
              </Button>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-4">
              <p className="section-label">{t('duplicateCardLabel')}</p>
              <p className="text-muted-foreground mt-3 leading-6">
                {t('duplicateCardBody')}
              </p>
              <div className="mt-4">
                <DuplicateRoutineButton
                  routineId={routine.id}
                  copy={{
                    idle: t('duplicate'),
                    loading: t('duplicating'),
                    error: t('duplicateError'),
                  }}
                  variant="outline"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/8 pb-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-label">{t('structureLabel')}</p>
                <CardTitle className="mt-2 text-3xl">
                  {t('blocksTitle')}
                </CardTitle>
              </div>
              <span className="data-pill border-accent/30 bg-accent/10 text-accent">
                {routine.blocks.length} {t('blocksCountLabel')}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            {routine.blocks.length === 0 ? (
              <p className="text-muted-foreground leading-6">
                {t('blocksEmpty')}
              </p>
            ) : (
              <div className="space-y-4">
                {routine.blocks.map(
                  (block: RoutineBlockItem, index: number) => (
                    <div
                      key={block.id}
                      className="module-card rounded-[1.5rem] border-white/8 p-5"
                    >
                      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-start gap-4">
                          <div className="bg-accent/12 text-accent flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(76,173,56,0.25)] font-semibold">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="space-y-2">
                            <span className="section-label">
                              {t('blockLabel')}
                            </span>
                            <h3 className="font-display text-2xl leading-none tracking-[-0.02em]">
                              {block.title}
                            </h3>
                          </div>
                        </div>
                        <span className="data-pill">
                          {block.exercises.length} {t('exercisesLabel')}
                        </span>
                      </div>
                      {block.exercises.length === 0 ? (
                        <p className="text-muted-foreground mt-4 text-sm leading-6">
                          {t('exercisesEmpty')}
                        </p>
                      ) : (
                        <ul className="relative z-10 mt-4 space-y-3">
                          {block.exercises.map(
                            (exercise: RoutineExerciseItem) => {
                              const meta = [
                                exercise.targetSets
                                  ? `${exercise.targetSets} ${t('setsShort')}`
                                  : null,
                                exercise.targetReps
                                  ? exercise.targetReps
                                  : null,
                                exercise.restSeconds
                                  ? `${exercise.restSeconds}s`
                                  : null,
                                exercise.loadTrackingEnabled
                                  ? t('loadTracked')
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(' • ');

                              return (
                                <li
                                  key={exercise.id}
                                  className="rounded-2xl border border-white/6 bg-black/10 px-4 py-4"
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <p className="text-foreground font-medium">
                                        {exercise.name}
                                      </p>
                                      {exercise.notes ? (
                                        <p className="text-muted-foreground mt-2 text-xs leading-5">
                                          {exercise.notes}
                                        </p>
                                      ) : null}
                                    </div>
                                    {meta ? (
                                      <span className="data-pill text-[0.68rem] tracking-[0.18em]">
                                        {meta}
                                      </span>
                                    ) : null}
                                  </div>
                                </li>
                              );
                            },
                          )}
                        </ul>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button asChild size="sm" variant="ghost">
        <Link href="/routines">{t('back')}</Link>
      </Button>
    </div>
  );
}
