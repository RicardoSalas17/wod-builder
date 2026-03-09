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
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{tDetail('title')}</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {workout.title || tDetail('untitled')}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            {tDetail('duplicate')}
          </Button>
          <Button size="sm">{tDetail('edit')}</Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{tDetail('blocksTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {workout.blocks.length === 0 ? (
              <p className="text-muted-foreground">{tDetail('blocksEmpty')}</p>
            ) : (
              <div className="space-y-4">
                {workout.blocks.map((block) => {
                  const blockLabel = blockLabels[block.type];
                  return (
                    <div
                      key={block.id}
                      className="border-border/60 bg-background/60 rounded-xl border p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-muted-foreground text-xs tracking-wide uppercase">
                            {blockLabel}
                          </p>
                          <h3 className="text-base font-semibold">
                            {block.title || blockLabel}
                          </h3>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {tDetail('movementsLabel')}: {block.movements.length}
                        </span>
                      </div>

                      {block.movements.length === 0 ? (
                        <p className="text-muted-foreground mt-3 text-xs">
                          {tDetail('movementsEmpty')}
                        </p>
                      ) : (
                        <ul className="mt-3 space-y-2">
                          {block.movements.map((movement) => {
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
                                className="flex flex-wrap items-center justify-between gap-2"
                              >
                                <div>
                                  <p className="text-foreground font-medium">
                                    {movement.name}
                                  </p>
                                  {movement.notes ? (
                                    <p className="text-muted-foreground text-xs">
                                      {movement.notes}
                                    </p>
                                  ) : null}
                                </div>
                                {meta ? (
                                  <span className="text-muted-foreground text-xs">
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
