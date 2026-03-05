import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerClient } from './timer-client';
import { Link } from '@/i18n/navigation';

type WorkoutDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function WorkoutDetailPage({
  params,
}: WorkoutDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'timer' });
  const tDetail = await getTranslations({ locale, namespace: 'workoutDetail' });

  const timerCopy = {
    title: t('title'),
    mode: t('mode'),
    emom: t('emom'),
    amrap: t('amrap'),
    forTime: t('forTime'),
    intervalSeconds: t('intervalSeconds'),
    rounds: t('rounds'),
    durationMinutes: t('durationMinutes'),
    start: t('start'),
    pause: t('pause'),
    reset: t('reset'),
    statusIdle: t('statusIdle'),
    statusRunning: t('statusRunning'),
    statusPaused: t('statusPaused'),
    statusFinished: t('statusFinished'),
    roundLabel: t('roundLabel'),
    timeRemaining: t('timeRemaining'),
    timeElapsed: t('timeElapsed'),
    announceStart: t('announceStart'),
    announcePause: t('announcePause'),
    announceReset: t('announceReset'),
    announceTen: t('announceTen'),
    announceComplete: t('announceComplete'),
    soundToggle: t('soundToggle'),
    soundOn: t('soundOn'),
    soundOff: t('soundOff'),
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{tDetail('title')}</p>
          <h1 className="text-2xl font-semibold tracking-tight">WOD #{id}</h1>
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
          <CardContent className="text-muted-foreground space-y-3 text-sm">
            <p>{tDetail('blocksEmpty')}</p>
            <div className="border-border/70 bg-background rounded-xl border border-dashed p-4">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                {tDetail('placeholder')}
              </p>
              <p className="mt-2 text-sm">{tDetail('placeholderBody')}</p>
            </div>
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
