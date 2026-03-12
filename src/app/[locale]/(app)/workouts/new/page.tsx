import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BuilderClient } from './builder-client';

export const dynamic = 'force-dynamic';

export default async function NewWorkoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'builder' });

  const copy = {
    modeTag: t('modeTag'),
    lead: t('lead'),
    buildFlowLabel: t('buildFlowLabel'),
    blocksCountLabel: t('blocksCountLabel'),
    previewLabel: t('previewLabel'),
    currentTitleLabel: t('currentTitleLabel'),
    blockLabel: t('blockLabel'),
    subtitle: t('subtitle'),
    workoutTitleLabel: t('workoutTitleLabel'),
    workoutTitlePlaceholder: t('workoutTitlePlaceholder'),
    workoutBuilderTitle: t('workoutBuilderTitle'),
    addBlock: t('addBlock'),
    addMovement: t('addMovement'),
    remove: t('remove'),
    moveUp: t('moveUp'),
    moveDown: t('moveDown'),
    movementName: t('movementName'),
    load: t('load'),
    reps: t('reps'),
    emptyBlocks: t('emptyBlocks'),
    emptyMovements: t('emptyMovements'),
    previewTitle: t('previewTitle'),
    previewEmpty: t('previewEmpty'),
    previewEmptyMovements: t('previewEmptyMovements'),
    previewUpdated: t('previewUpdated'),
    newMovement: t('newMovement'),
    blockWarmup: t('blockWarmup'),
    blockStrength: t('blockStrength'),
    blockMetcon: t('blockMetcon'),
    blockTitleLabel: t('blockTitleLabel'),
    moveMovementUp: t('moveMovementUp'),
    moveMovementDown: t('moveMovementDown'),
    exportJson: t('exportJson'),
    clearDraft: t('clearDraft'),
    clearConfirm: t('clearConfirm'),
    importJson: t('importJson'),
    importSuccess: t('importSuccess'),
    importError: t('importError'),
    save: t('save'),
    saving: t('saving'),
    saveSuccess: t('saveSuccess'),
    saveError: t('saveError'),
  };

  return <BuilderClient copy={copy} />;
}
