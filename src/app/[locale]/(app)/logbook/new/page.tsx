import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getRoutineById } from '@/data/routines';
import type { LogbookBuilderState } from '@/lib/logbook-builder';
import { LogSessionBuilderClient } from './log-session-builder-client';

export const dynamic = 'force-dynamic';

function toInitialState(
  routine: Awaited<ReturnType<typeof getRoutineById>>,
  fallbackTitle: string,
): LogbookBuilderState | undefined {
  if (!routine) return undefined;

  return {
    title: routine.title || fallbackTitle,
    performedAt: new Date().toISOString().slice(0, 10),
    notes: '',
    durationMinutes: '',
    routineId: routine.id,
    exercises: routine.blocks.flatMap(
      (block: (typeof routine.blocks)[number]) =>
        block.exercises.map((exercise: (typeof block.exercises)[number]) => ({
          id: exercise.id,
          name: exercise.name,
          notes: exercise.notes ?? '',
          loadTrackingEnabled: exercise.loadTrackingEnabled,
          helperLoad: '',
          sets: Array.from(
            { length: exercise.targetSets ?? 1 },
            (_, index) => ({
              id: `${exercise.id}-set-${index + 1}`,
              setNumber: index + 1,
              reps: exercise.targetReps ?? '',
              load: '',
              completed: true,
              notes: '',
            }),
          ),
        })),
    ),
  };
}

export default async function NewLogSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ routineId?: string }>;
}) {
  const { locale } = await params;
  const { routineId } = await searchParams;
  setRequestLocale(locale);

  const [t, routine] = await Promise.all([
    getTranslations({ locale, namespace: 'logbookBuilder' }),
    routineId ? getRoutineById(routineId) : Promise.resolve(null),
  ]);

  return (
    <LogSessionBuilderClient
      copy={{
        title: t('title'),
        subtitle: t('subtitle'),
        modeTag: t('modeTag'),
        lead: t('lead'),
        overviewLabel: t('overviewLabel'),
        exercisesCountLabel: t('exercisesCountLabel'),
        titleLabel: t('titleLabel'),
        titlePlaceholder: t('titlePlaceholder'),
        performedAtLabel: t('performedAtLabel'),
        durationLabel: t('durationLabel'),
        notesLabel: t('notesLabel'),
        notesPlaceholder: t('notesPlaceholder'),
        exerciseName: t('exerciseName'),
        exerciseNotesLabel: t('exerciseNotesLabel'),
        setLabel: t('setLabel'),
        repsLabel: t('repsLabel'),
        loadLabel: t('loadLabel'),
        completedLabel: t('completedLabel'),
        setNotesLabel: t('setNotesLabel'),
        addExercise: t('addExercise'),
        addSet: t('addSet'),
        remove: t('remove'),
        applyHelperLoad: t('applyHelperLoad'),
        helperLoadReady: t('helperLoadReady'),
        previewLabel: t('previewLabel'),
        previewTitle: t('previewTitle'),
        previewEmpty: t('previewEmpty'),
        previewUpdated: t('previewUpdated'),
        emptyExercises: t('emptyExercises'),
        save: t('save'),
        saving: t('saving'),
        saveSuccess: t('saveSuccess'),
        saveError: t('saveError'),
        clearDraft: t('clearDraft'),
        clearConfirm: t('clearConfirm'),
        newExercise: t('newExercise'),
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
      }}
      initialState={toInitialState(routine, t('titlePlaceholder'))}
      storageKey={
        routine ? `wod-builder:logbook-new:${routine.id}:v1` : undefined
      }
    />
  );
}
