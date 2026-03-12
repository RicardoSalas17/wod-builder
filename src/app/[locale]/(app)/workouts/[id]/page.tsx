import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BlockType } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { getWorkoutById } from '@/data/workouts';
import { TimerClient } from './timer-client';

export const dynamic = 'force-dynamic';

type WorkoutDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function WorkoutDetailPage({
  params,
}: WorkoutDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [tTimer, tDetail, tBuilder] = await Promise.all([
    getTranslations({ locale, namespace: 'timer' }),
    getTranslations({ locale, namespace: 'workoutDetail' }),
    getTranslations({ locale, namespace: 'builder' }),
  ]);

  const workout = await getWorkoutById(id);
  if (!workout) {
    notFound();
  }

  const blockLabels: Record<BlockType, string> = {
    WARMUP: tBuilder('blockWarmup'),
    STRENGTH: tBuilder('blockStrength'),
    METCON: tBuilder('blockMetcon'),
  };

  const timerCopy = {
    performanceLabel: tTimer('performanceLabel'),
    title: tTimer('title'),
    mode: tTimer('mode'),
    emom: tTimer('emom'),
    amrap: tTimer('amrap'),
    forTime: tTimer('forTime'),
    intervalSeconds: tTimer('intervalSeconds'),
    rounds: tTimer('rounds'),
    durationMinutes: tTimer('durationMinutes'),
    start: tTimer('start'),
    pause: tTimer('pause'),
    reset: tTimer('reset'),
    statusIdle: tTimer('statusIdle'),
    statusRunning: tTimer('statusRunning'),
    statusPaused: tTimer('statusPaused'),
    statusFinished: tTimer('statusFinished'),
    roundLabel: tTimer('roundLabel'),
    timeRemaining: tTimer('timeRemaining'),
    timeElapsed: tTimer('timeElapsed'),
    announceStart: tTimer('announceStart'),
    announcePause: tTimer('announcePause'),
    announceReset: tTimer('announceReset'),
    announceTen: tTimer('announceTen'),
    announceComplete: tTimer('announceComplete'),
    soundToggle: tTimer('soundToggle'),
    soundOn: tTimer('soundOn'),
    soundOff: tTimer('soundOff'),
  };

  return (
    <div className="page-shell space-y-8">
      <header className="page-header flex flex-wrap items-end justify-between gap-6">
        <div className="relative z-10 space-y-4">
          <span className="accent-pill">{tDetail('detailTag')}</span>
          <div className="space-y-2">
            <p className="page-kicker">{tDetail('title')}</p>
            <h1 className="page-title">
              {workout.title || tDetail('untitled')}
            </h1>
          </div>
          <p className="page-lead">{tDetail('lead')}</p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <p className="section-label">{tDetail('blocksCountLabel')}</p>
            <p className="font-display text-foreground text-2xl">
              {workout.blocks.length}
            </p>
          </div>
          <Button size="sm" variant="outline">
            {tDetail('duplicate')}
          </Button>
          <Button asChild size="sm">
            <Link href={`/workouts/${workout.id}/edit`}>{tDetail('edit')}</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/8 pb-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-label">{tDetail('structureLabel')}</p>
                <CardTitle className="mt-2 text-3xl">
                  {tDetail('blocksTitle')}
                </CardTitle>
              </div>
              <span className="border-accent/30 bg-accent/10 text-accent rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                {tDetail('coachViewTag')}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            {workout.blocks.length === 0 ? (
              <p className="text-muted-foreground leading-6">
                {tDetail('blocksEmpty')}
              </p>
            ) : (
              <div className="space-y-4">
                {workout.blocks.map((block, index) => {
                  const blockLabel = blockLabels[block.type];
                  return (
                    <div
                      key={block.id}
                      className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="section-label">
                              {tDetail('blockLabel')}{' '}
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="border-accent/25 bg-accent/10 text-accent rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                              {blockLabel}
                            </span>
                          </div>
                          <h3 className="font-display text-2xl leading-none tracking-[-0.02em]">
                            {block.title || blockLabel}
                          </h3>
                        </div>
                        <span className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                          {tDetail('movementsLabel')}: {block.movements.length}
                        </span>
                      </div>

                      {block.movements.length === 0 ? (
                        <p className="text-muted-foreground mt-4 text-sm leading-6">
                          {tDetail('movementsEmpty')}
                        </p>
                      ) : (
                        <ul className="mt-4 space-y-3">
                          {workout.blocks[index].movements.map((movement) => {
                            const meta = [
                              movement.load
                                ? `${tBuilder('load')}: ${movement.load}`
                                : null,
                              movement.reps
                                ? `${tBuilder('reps')}: ${movement.reps}`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(' • ');

                            return (
                              <li
                                key={movement.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/6 bg-black/10 px-4 py-3"
                              >
                                <div>
                                  <p className="text-foreground font-medium">
                                    {movement.name}
                                  </p>
                                  {movement.notes ? (
                                    <p className="text-muted-foreground mt-1 text-xs leading-5">
                                      {movement.notes}
                                    </p>
                                  ) : null}
                                </div>
                                {meta ? (
                                  <span className="text-muted-foreground text-xs tracking-[0.12em] uppercase">
                                    {meta}
                                  </span>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <TimerClient copy={timerCopy} />
      </div>

      <Button asChild size="sm" variant="ghost">
        <Link href="/workouts">{tDetail('back')}</Link>
      </Button>
    </div>
  );
}
