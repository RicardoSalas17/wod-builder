import { getTranslations } from 'next-intl/server';

export async function SiteFooter() {
  const t = await getTranslations('marketing');

  return (
    <footer className="bg-background/50 border-t border-white/8 backdrop-blur-xl">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm sm:px-6">
        <p>{t('footerLine1')}</p>
        <p>{t('footerLine2')}</p>
      </div>
    </footer>
  );
}
