import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    title: "Builder blocks",
    description:
      "Warm-up, Strength, and Metcon blocks with structured movements and live preview.",
  },
  {
    title: "Trainer-first timer",
    description:
      "EMOM, AMRAP, and For Time with accessible controls and spoken updates.",
  },
  {
    title: "Units you can trust",
    description:
      "Global lb/kg switch with consistent conversions across the app.",
  },
];

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "marketing" });
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(14,116,144,0.35),transparent_70%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[-10%] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(248,113,113,0.32),transparent_65%)] blur-3xl" />
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              WOD Builder & Timer
            </p>
            <h1>{t("title")}</h1>
            <p className="...">{t("subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/workouts/new">Start a WOD</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/workouts">Browse workouts</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>Accessible keyboard flows</span>
              <span>Live preview</span>
              <span>Units + timer built-in</span>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-linear-to-br from-background via-background to-muted/60 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Warm-up
                </p>
                <p className="mt-2 text-sm font-medium">
                  3 rounds · 8 cal row · 10 air squats · 20 sec plank
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Strength
                </p>
                <p className="mt-2 text-sm font-medium">
                  Back squat 5x5 · Build to heavy triple
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
            <Card key={item.title} className="border-border/70">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" size="sm">
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
