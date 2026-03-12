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
    notes: t('notes'),
    notesPlaceholder: t('notesPlaceholder'),
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
    weightPicker: {
      title: t('weightPicker.title'),
      demoTitle: t('weightPicker.demoTitle'),
      demoBody: t('weightPicker.demoBody'),
      movementLabel: t('weightPicker.movementLabel'),
      unitPreferenceLabel: t('weightPicker.unitPreferenceLabel'),
      showBothUnits: t('weightPicker.showBothUnits'),
      unitKg: t('weightPicker.unitKg'),
      unitLb: t('weightPicker.unitLb'),
      resetLoad: t('weightPicker.resetLoad'),
      barSelectorLabel: t('weightPicker.barSelectorLabel'),
      barWeightLabel: t('weightPicker.barWeightLabel'),
      quickModeLabel: t('weightPicker.quickModeLabel'),
      quickModeHint: t('weightPicker.quickModeHint'),
      targetWeightLabel: t('weightPicker.targetWeightLabel'),
      suggestPlates: t('weightPicker.suggestPlates'),
      platesLabel: t('weightPicker.platesLabel'),
      perSideLabel: t('weightPicker.perSideLabel'),
      decrementPlate: t('weightPicker.decrementPlate'),
      incrementPlate: t('weightPicker.incrementPlate'),
      selectedCount: t('weightPicker.selectedCount'),
      previewLabel: t('weightPicker.previewLabel'),
      totalLabel: t('weightPicker.totalLabel'),
      barLabel: t('weightPicker.barLabel'),
      noPlates: t('weightPicker.noPlates'),
      perSideBreakdown: t('weightPicker.perSideBreakdown'),
      trackingLabel: t('weightPicker.trackingLabel'),
      lastUsedLabel: t('weightPicker.lastUsedLabel'),
      personalRecordLabel: t('weightPicker.personalRecordLabel'),
      trackingHint: t('weightPicker.trackingHint'),
      configuredLabel: t('weightPicker.configuredLabel'),
    },
  };

  return <BuilderClient copy={copy} />;
}
