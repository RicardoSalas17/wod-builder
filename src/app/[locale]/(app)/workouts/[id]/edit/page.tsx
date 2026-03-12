import { BlockType } from '@prisma/client';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getWorkoutById } from '@/data/workouts';
import type { BlockType as BuilderBlockType } from '@/domain/workouts';
import type { BuilderState } from '@/lib/workout-builder';
import { BuilderClient } from '../../new/builder-client';

export const dynamic = 'force-dynamic';

const blockTypeMap: Record<BlockType, BuilderBlockType> = {
  WARMUP: 'warmup',
  STRENGTH: 'strength',
  METCON: 'metcon',
};

function toBuilderState(
  workout: NonNullable<Awaited<ReturnType<typeof getWorkoutById>>>,
): BuilderState {
  return {
    title: workout.title,
    blocks: workout.blocks.map((block) => ({
      id: block.id,
      type: blockTypeMap[block.type],
      title: block.title,
      movements: block.movements.map((movement) => ({
        id: movement.id,
        name: movement.name,
        load: movement.load ?? '',
        reps: movement.reps ?? '',
        notes: movement.notes ?? '',
      })),
    })),
  };
}

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [t, workout] = await Promise.all([
    getTranslations({ locale, namespace: 'builder' }),
    getWorkoutById(id),
  ]);

  if (!workout) {
    notFound();
  }

  const copy = {
    modeTag: t('modeTag'),
    lead: t('lead'),
    buildFlowLabel: t('buildFlowLabel'),
    blocksCountLabel: t('blocksCountLabel'),
    previewLabel: t('previewLabel'),
    currentTitleLabel: t('currentTitleLabel'),
    blockLabel: t('blockLabel'),
    subtitle: t('editSubtitle'),
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
    save: t('update'),
    saving: t('updating'),
    saveSuccess: t('updateSuccess'),
    saveError: t('updateError'),
  };

  return (
    <BuilderClient
      copy={copy}
      initialState={toBuilderState(workout)}
      saveEndpoint={`/api/workouts/${workout.id}`}
      saveMethod="PATCH"
      saveRedirectHref={`/workouts/${workout.id}`}
      storageKey={`wod-builder:edit:${workout.id}:v1`}
    />
  );
}
