import { getTranslations } from 'next-intl/server';

import { AppHeader } from '@/components/site/app-header';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('nav');

  return (
    <div className="bg-background text-foreground min-h-screen">
      <a
        href="#app-main-content"
        className="focus:bg-background sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        {t('skipToContent')}
      </a>
      <AppHeader />
      <main
        id="app-main-content"
        className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
      >
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
