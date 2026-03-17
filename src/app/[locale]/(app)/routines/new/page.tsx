import { getTranslations, setRequestLocale } from 'next-intl/server';

import { RoutineBuilderClient } from './routine-builder-client';

export const dynamic = 'force-dynamic';

export default async function NewRoutinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'routinesBuilder' });

  return (
    <RoutineBuilderClient
      copy={{
        title: t('title'),
        subtitle: t('subtitle'),
        modeTag: t('modeTag'),
        lead: t('lead'),
        overviewLabel: t('overviewLabel'),
        blocksCountLabel: t('blocksCountLabel'),
        currentTitleLabel: t('currentTitleLabel'),
        titleLabel: t('titleLabel'),
        titlePlaceholder: t('titlePlaceholder'),
        descriptionLabel: t('descriptionLabel'),
        descriptionPlaceholder: t('descriptionPlaceholder'),
        focusLabel: t('focusLabel'),
        focusPlaceholder: t('focusPlaceholder'),
        builderTitle: t('builderTitle'),
        blockLabel: t('blockLabel'),
        blockTitleLabel: t('blockTitleLabel'),
        blockTitlePlaceholder: t('blockTitlePlaceholder'),
        addBlock: t('addBlock'),
        addExercise: t('addExercise'),
        exerciseName: t('exerciseName'),
        sets: t('sets'),
        reps: t('reps'),
        restSeconds: t('restSeconds'),
        notes: t('notes'),
        notesPlaceholder: t('notesPlaceholder'),
        trackLoad: t('trackLoad'),
        previewLabel: t('previewLabel'),
        previewTitle: t('previewTitle'),
        previewEmpty: t('previewEmpty'),
        previewUpdated: t('previewUpdated'),
        emptyBlocks: t('emptyBlocks'),
        emptyExercises: t('emptyExercises'),
        save: t('save'),
        saving: t('saving'),
        saveSuccess: t('saveSuccess'),
        saveError: t('saveError'),
        clearDraft: t('clearDraft'),
        clearConfirm: t('clearConfirm'),
        remove: t('remove'),
        moveUp: t('moveUp'),
        moveDown: t('moveDown'),
        moveExerciseUp: t('moveExerciseUp'),
        moveExerciseDown: t('moveExerciseDown'),
        newExercise: t('newExercise'),
      }}
    />
  );
}
