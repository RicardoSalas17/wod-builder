import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getLogSessionById } from '@/data/logbook';
import type { LogbookBuilderState } from '@/lib/logbook-builder';
import { LogSessionBuilderClient } from '../../new/log-session-builder-client';

export const dynamic = 'force-dynamic';

function toBuilderState(
  session: NonNullable<Awaited<ReturnType<typeof getLogSessionById>>>,
): LogbookBuilderState {
  return {
    title: session.title,
    performedAt: session.performedAt.toISOString().slice(0, 10),
    notes: session.notes ?? '',
    durationMinutes: session.durationMinutes?.toString() ?? '',
    routineId: session.routineId ?? '',
    exercises: session.exercises.map(
      (exercise: (typeof session.exercises)[number]) => ({
        id: exercise.id,
        name: exercise.name,
        notes: exercise.notes ?? '',
        loadTrackingEnabled: exercise.loadTrackingEnabled,
        helperLoad: '',
        sets: exercise.sets.map((set: (typeof exercise.sets)[number]) => ({
          id: set.id,
          setNumber: set.setNumber,
          reps: set.reps ?? '',
          load: set.load ?? '',
          completed: set.completed,
          notes: set.notes ?? '',
        })),
      }),
    ),
  };
}

export default async function EditLogSessionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [t, session] = await Promise.all([
    getTranslations({ locale, namespace: 'logbookBuilder' }),
    getLogSessionById(id),
  ]);

  if (!session) {
    notFound();
  }

  return (
    <LogSessionBuilderClient
      copy={{
        title: t('title'),
        subtitle: t('editSubtitle'),
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
        save: t('update'),
        saving: t('updating'),
        saveSuccess: t('updateSuccess'),
        saveError: t('updateError'),
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
      initialState={toBuilderState(session)}
      saveEndpoint={`/api/logbook/${session.id}`}
      saveMethod="PATCH"
      saveRedirectHref={`/logbook/${session.id}`}
      storageKey={`wod-builder:logbook-edit:${session.id}:v1`}
    />
  );
}
