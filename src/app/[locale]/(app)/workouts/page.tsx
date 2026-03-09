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
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
        </div>
        <Button asChild>
          <Link href="/workouts/new">{t('create')}</Link>
        </Button>
      </header>

      {workouts.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>{t('emptyTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4 text-sm">
            <p>{t('emptyBody')}</p>
            <Button asChild size="sm">
              <Link href="/workouts/new">{t('emptyCta')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {workouts.map((workout) => (
            <Card key={workout.id} className="border-border/60">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">
                  {workout.title || t('untitled')}
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  {t('updatedLabel')} {formatter.format(workout.updatedAt)}
                </p>
              </CardHeader>
              <CardContent>
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
