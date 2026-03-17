import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getRoutineById } from '@/data/routines';
import type { RoutineBuilderState } from '@/lib/routine-builder';
import { RoutineBuilderClient } from '../../new/routine-builder-client';

export const dynamic = 'force-dynamic';

function toBuilderState(
  routine: NonNullable<Awaited<ReturnType<typeof getRoutineById>>>,
): RoutineBuilderState {
  return {
    title: routine.title,
    description: routine.description ?? '',
    focus: routine.focus ?? '',
    blocks: routine.blocks.map((block: (typeof routine.blocks)[number]) => ({
      id: block.id,
      title: block.title,
      exercises: block.exercises.map(
        (exercise: (typeof block.exercises)[number]) => ({
          id: exercise.id,
          name: exercise.name,
          targetSets: exercise.targetSets?.toString() ?? '',
          targetReps: exercise.targetReps ?? '',
          restSeconds: exercise.restSeconds?.toString() ?? '',
          notes: exercise.notes ?? '',
          loadTrackingEnabled: exercise.loadTrackingEnabled,
        }),
      ),
    })),
  };
}

export default async function EditRoutinePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [t, routine] = await Promise.all([
    getTranslations({ locale, namespace: 'routinesBuilder' }),
    getRoutineById(id),
  ]);

  if (!routine) {
    notFound();
  }

  return (
    <RoutineBuilderClient
      copy={{
        title: t('title'),
        subtitle: t('editSubtitle'),
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
        save: t('update'),
        saving: t('updating'),
        saveSuccess: t('updateSuccess'),
        saveError: t('updateError'),
        clearDraft: t('clearDraft'),
        clearConfirm: t('clearConfirm'),
        remove: t('remove'),
        moveUp: t('moveUp'),
        moveDown: t('moveDown'),
        moveExerciseUp: t('moveExerciseUp'),
        moveExerciseDown: t('moveExerciseDown'),
        newExercise: t('newExercise'),
      }}
      initialState={toBuilderState(routine)}
      saveEndpoint={`/api/routines/${routine.id}`}
      saveMethod="PATCH"
      saveRedirectHref={`/routines/${routine.id}`}
      storageKey={`wod-builder:routine-edit:${routine.id}:v1`}
    />
  );
}
