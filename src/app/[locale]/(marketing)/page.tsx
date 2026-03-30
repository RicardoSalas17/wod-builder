import { Link } from '@/i18n/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'marketing' });
  const highlights = [
    {
      tag: t('tagBuilder'),
      title: t('highlightBuilderTitle'),
      description: t('highlightBuilderBody'),
    },
    {
      tag: t('tagTimer'),
      title: t('highlightTimerTitle'),
      description: t('highlightTimerBody'),
    },
    {
      tag: t('tagUnits'),
      title: t('highlightUnitsTitle'),
      description: t('highlightUnitsBody'),
    },
  ];
  const quickPoints = [
    t('pointAccessibility'),
    t('pointPreview'),
    t('pointIntegrated'),
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 -left-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(76,173,56,0.22),transparent_68%)] blur-3xl" />
        <div className="absolute top-[-10%] right-[-8%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(243,240,232,0.11),transparent_62%)] blur-3xl" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="page-kicker">WOD Builder & Timer</p>
            <h1 className="page-title max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
              {t('headline')}
            </h1>
            <p className="page-lead max-w-2xl text-base sm:text-lg">
              {t('subtitle')}
            </p>
            <div className="accent-pill mt-4">{t('strip')}</div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/workouts/new">{t('ctaPrimary')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-6">
                <Link href="/routines">{t('ctaSecondary')}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="px-6">
                <Link href="/logbook">{t('ctaTertiary')}</Link>
              </Button>
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-3 text-xs tracking-[0.18em] uppercase">
              {quickPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] border border-white/10 p-6 sm:p-8">
            <div className="space-y-5">
              <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-5">
                <p className="section-label">{t('sampleWarmupLabel')}</p>
                <p className="text-foreground mt-3 text-sm leading-6 font-medium">
                  {t('sampleWarmupBody')}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-5">
                <p className="section-label">{t('sampleStrengthLabel')}</p>
                <p className="text-foreground mt-3 text-sm leading-6 font-medium">
                  {t('sampleStrengthBody')}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-5">
                <p className="section-label">{t('sampleMetconLabel')}</p>
                <p className="text-foreground mt-3 text-sm leading-6 font-medium">
                  {t('sampleMetconBody')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card
              key={item.title}
              className="border-accent/70 border-2 shadow-[0_12px_24px_-16px_rgba(76,173,56,0.6)]"
            >
              <CardHeader className="space-y-3">
                <span className="border-accent/70 bg-accent/15 text-accent inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
                  {item.tag}
                </span>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/workouts/new">{t('explore')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
