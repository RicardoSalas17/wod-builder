import { prisma } from '@/lib/prisma';
import { BlockType } from '@prisma/client';

export type WorkoutCreateInput = {
  title: string;
  blocks: {
    type: BlockType;
    title: string;
    movements: {
      name: string;
      load?: string | null;
      reps?: string | null;
      notes?: string | null;
    }[];
  }[];
};

export async function createWorkout(input: WorkoutCreateInput) {
  return prisma.workout.create({
    data: {
      title: input.title,
      blocks: {
        create: input.blocks.map((block, blockIndex) => ({
          type: block.type,
          title: block.title,
          position: blockIndex,
          movements: {
            create: block.movements.map((movement, movementIndex) => ({
              name: movement.name,
              load: movement.load ?? null,
              reps: movement.reps ?? null,
              notes: movement.notes ?? null,
              position: movementIndex,
            })),
          },
        })),
      },
    },
    include: {
      blocks: {
        orderBy: { position: 'asc' },
        include: {
          movements: { orderBy: { position: 'asc' } },
        },
      },
    },
  });
}

export async function updateWorkout(id: string, input: WorkoutCreateInput) {
  return prisma.$transaction(async (tx) => {
    const existingWorkout = await tx.workout.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingWorkout) {
      return null;
    }

    await tx.block.deleteMany({
      where: { workoutId: id },
    });

    return tx.workout.update({
      where: { id },
      data: {
        title: input.title,
        blocks: {
          create: input.blocks.map((block, blockIndex) => ({
            type: block.type,
            title: block.title,
            position: blockIndex,
            movements: {
              create: block.movements.map((movement, movementIndex) => ({
                name: movement.name,
                load: movement.load ?? null,
                reps: movement.reps ?? null,
                notes: movement.notes ?? null,
                position: movementIndex,
              })),
            },
          })),
        },
      },
      include: {
        blocks: {
          orderBy: { position: 'asc' },
          include: {
            movements: { orderBy: { position: 'asc' } },
          },
        },
      },
    });
  });
}

export async function getWorkoutById(id: string) {
  return prisma.workout.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: { position: 'asc' },
        include: { movements: { orderBy: { position: 'asc' } } },
      },
    },
  });
}

export async function listWorkouts() {
  return prisma.workout.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, updatedAt: true },
  });
}
