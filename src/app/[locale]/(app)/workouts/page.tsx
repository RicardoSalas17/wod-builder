import { getTranslations, setRequestLocale } from 'next-intl/server';

import { listWorkouts } from '@/data/workouts';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function WorkoutsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'workouts' });
  const workouts = await listWorkouts();
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });

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
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-right">
            <p className="section-label">{t('totalLabel')}</p>
            <p className="font-display text-foreground text-2xl">
              {workouts.length}
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/workouts/new">{t('create')}</Link>
          </Button>
        </div>
      </header>

      {workouts.length === 0 ? (
        <Card className="border-dashed border-white/12">
          <CardHeader className="space-y-3">
            <span className="accent-pill w-fit">{t('emptyTag')}</span>
            <CardTitle className="text-3xl">{t('emptyTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-5 text-sm sm:text-base">
            <p className="max-w-2xl leading-7">{t('emptyBody')}</p>
            <Button asChild size="lg">
              <Link href="/workouts/new">{t('emptyCta')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {workouts.map((workout, index) => (
            <Card
              key={workout.id}
              className="group overflow-hidden border-white/10"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="section-label">
                    {t('sessionLabel')} {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="border-accent/25 bg-accent/10 text-accent rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                    {t('readyTag')}
                  </span>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl leading-tight">
                    {workout.title || t('untitled')}
                  </CardTitle>
                  <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                    {t('updatedLabel')} {formatter.format(workout.updatedAt)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex items-end justify-between gap-4">
                <p className="text-muted-foreground max-w-[16rem] text-sm leading-6">
                  {t('cardBody')}
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/workouts/${workout.id}`}>{t('open')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
