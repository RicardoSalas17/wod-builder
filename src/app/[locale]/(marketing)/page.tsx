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
      tag: t("tagBuilder"),
      title: 'Builder blocks',
      description:
        'Warm-up, Strength, and Metcon blocks with structured movements and live preview.',
    },
    {
      tag: t("tagTimer"),
      title: 'Trainer-first timer',
      description:
        'EMOM, AMRAP, and For Time with accessible controls and spoken updates.',
    },
    {
      tag: t("tagUnits"),
      title: 'Units you can trust',
      description:
        'Global lb/kg switch with consistent conversions across the app.',
    },
  ];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-24 -left-40 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(14,116,144,0.35),transparent_70%)] blur-3xl" />
        <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(248,113,113,0.32),transparent_65%)] blur-3xl" />
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm font-semibold tracking-[0.2em] uppercase">
              WOD Builder & Timer
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {t('headline')}
            </h1>
            <p className="text-muted-foreground text-lg text-pretty sm:text-xl">
              {t('subtitle')}
            </p>
            <div className="border-accent bg-accent/10 text-accent mt-4 inline-flex items-center gap-2 rounded-full border-2 px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
              {t('strip')}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/workouts/new">{t("ctaPrimary")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2 px-6"
              >
                <Link href="/workouts">{t("ctaSecondary")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full px-6"
              >
                <Link href="/workouts">{t("ctaTertiary")}</Link>
              </Button>
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
              <span>Accessible keyboard flows</span>
              <span>Live preview</span>
              <span>Units + timer built-in</span>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-accent/70 bg-linear-to-br from-background via-background to-accent/10 p-6 shadow-[0_20px_45px_-30px_rgba(76,173,56,0.65)]"
          >
            <div className="space-y-4">
              <div className="border-border/60 bg-background rounded-2xl border p-4 shadow-sm">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Warm-up
                </p>
                <p className="mt-2 text-sm font-medium">
                  3 rounds · 8 cal row · 10 air squats · 20 sec plank
                </p>
              </div>
              <div className="border-border/60 bg-background rounded-2xl border p-4 shadow-sm">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Strength
                </p>
                <p className="mt-2 text-sm font-medium">
                  Back squat 5x5 · Build to heavy triple
                </p>
              </div>
              <div className="border-border/60 bg-background rounded-2xl border p-4 shadow-sm">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Metcon
                </p>
                <p className="mt-2 text-sm font-medium">
                  12 min AMRAP · 6 burpees · 10 KB swings · 200m run
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
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <Link href="/workouts/new">Explore</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
