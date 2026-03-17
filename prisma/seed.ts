import { BlockType } from '@prisma/client';
import { prisma } from '../src/lib/prisma';

async function resetDatabase() {
  await prisma.logSet.deleteMany();
  await prisma.logExercise.deleteMany();
  await prisma.logSession.deleteMany();
  await prisma.routineExercise.deleteMany();
  await prisma.routineBlock.deleteMany();
  await prisma.routine.deleteMany();
  await prisma.movement.deleteMany();
  await prisma.block.deleteMany();
  await prisma.workout.deleteMany();
}

async function seedWorkouts() {
  await prisma.workout.create({
    data: {
      title: 'Engine Builder 28',
      blocks: {
        create: [
          {
            type: BlockType.WARMUP,
            title: 'Prep',
            position: 0,
            movements: {
              create: [
                { name: 'Bike', reps: '4 min easy', position: 0 },
                {
                  name: "World's Greatest Stretch",
                  reps: '6 / side',
                  position: 1,
                },
                { name: 'PVC pass-through', reps: '15', position: 2 },
              ],
            },
          },
          {
            type: BlockType.STRENGTH,
            title: 'Front squat wave',
            position: 1,
            movements: {
              create: [
                {
                  name: 'Front squat',
                  reps: '5-4-3-2-1',
                  load: 'RPE 7-8',
                  position: 0,
                },
              ],
            },
          },
          {
            type: BlockType.METCON,
            title: 'AMRAP 12',
            position: 2,
            movements: {
              create: [
                { name: 'Row', reps: '12 cal', position: 0 },
                {
                  name: 'Wall balls',
                  reps: '15',
                  load: '20/14 lb',
                  position: 1,
                },
                { name: 'Burpees over rower', reps: '10', position: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.workout.create({
    data: {
      title: 'Saturday Team Session',
      blocks: {
        create: [
          {
            type: BlockType.WARMUP,
            title: 'Movement prep',
            position: 0,
            movements: {
              create: [
                { name: 'Jump rope', reps: '3 min', position: 0 },
                { name: 'Hip opener flow', reps: '8 / side', position: 1 },
              ],
            },
          },
          {
            type: BlockType.METCON,
            title: 'For time in pairs',
            position: 1,
            movements: {
              create: [
                { name: 'Run', reps: '800 m', position: 0 },
                {
                  name: 'Synchro dumbbell snatch',
                  reps: '60',
                  load: '50/35 lb',
                  position: 1,
                },
                { name: 'Synchro box jump', reps: '50', position: 2 },
              ],
            },
          },
        ],
      },
    },
  });
}

async function seedTrainingFlow() {
  const lowerBody = await prisma.routine.create({
    data: {
      title: 'Lower Body Strength Base',
      description:
        'Simple lower-body progression with tracked load on the main lift.',
      focus: 'Strength',
      blocks: {
        create: [
          {
            title: 'Main lift',
            position: 0,
            exercises: {
              create: [
                {
                  name: 'Back squat',
                  targetSets: 5,
                  targetReps: '5',
                  restSeconds: 150,
                  notes: 'Leave 1-2 reps in reserve.',
                  loadTrackingEnabled: true,
                  position: 0,
                },
              ],
            },
          },
          {
            title: 'Accessories',
            position: 1,
            exercises: {
              create: [
                {
                  name: 'Romanian deadlift',
                  targetSets: 4,
                  targetReps: '8',
                  restSeconds: 90,
                  notes: 'Controlled eccentric.',
                  loadTrackingEnabled: true,
                  position: 0,
                },
                {
                  name: 'Walking lunge',
                  targetSets: 3,
                  targetReps: '12 / leg',
                  restSeconds: 60,
                  notes: null,
                  loadTrackingEnabled: false,
                  position: 1,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      blocks: {
        orderBy: { position: 'asc' },
        include: { exercises: { orderBy: { position: 'asc' } } },
      },
    },
  });

  await prisma.routine.create({
    data: {
      title: 'Upper Pull + Capacity',
      description: 'Pulling volume plus short conditioning finisher.',
      focus: 'Hypertrophy',
      blocks: {
        create: [
          {
            title: 'Primary pull',
            position: 0,
            exercises: {
              create: [
                {
                  name: 'Weighted pull-up',
                  targetSets: 5,
                  targetReps: '4-6',
                  restSeconds: 120,
                  notes: 'Use full hang.',
                  loadTrackingEnabled: true,
                  position: 0,
                },
              ],
            },
          },
          {
            title: 'Accessories',
            position: 1,
            exercises: {
              create: [
                {
                  name: 'Chest-supported row',
                  targetSets: 4,
                  targetReps: '10-12',
                  restSeconds: 75,
                  notes: null,
                  loadTrackingEnabled: true,
                  position: 0,
                },
                {
                  name: 'Ski erg',
                  targetSets: 6,
                  targetReps: '45 sec on / 45 sec off',
                  restSeconds: 45,
                  notes: 'Stay smooth.',
                  loadTrackingEnabled: false,
                  position: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const squatExercise = lowerBody.blocks[0]?.exercises[0];
  const hingeExercise = lowerBody.blocks[1]?.exercises[0];

  await prisma.logSession.create({
    data: {
      title: lowerBody.title,
      performedAt: new Date('2026-03-14T18:30:00.000Z'),
      notes: 'Felt strong after the second set. Last set was near max effort.',
      durationMinutes: 62,
      routineId: lowerBody.id,
      exercises: {
        create: [
          {
            name: 'Back squat',
            notes: 'Used belt only on the top 2 sets.',
            loadTrackingEnabled: true,
            position: 0,
            routineExerciseId: squatExercise?.id,
            sets: {
              create: [
                { setNumber: 1, reps: '5', load: '205 lb', completed: true },
                { setNumber: 2, reps: '5', load: '215 lb', completed: true },
                { setNumber: 3, reps: '5', load: '225 lb', completed: true },
                { setNumber: 4, reps: '5', load: '235 lb', completed: true },
                { setNumber: 5, reps: '5', load: '245 lb', completed: true },
              ],
            },
          },
          {
            name: 'Romanian deadlift',
            notes: 'Grip was the limiter.',
            loadTrackingEnabled: true,
            position: 1,
            routineExerciseId: hingeExercise?.id,
            sets: {
              create: [
                { setNumber: 1, reps: '8', load: '155 lb', completed: true },
                { setNumber: 2, reps: '8', load: '165 lb', completed: true },
                { setNumber: 3, reps: '8', load: '165 lb', completed: true },
                { setNumber: 4, reps: '8', load: '175 lb', completed: true },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.logSession.create({
    data: {
      title: 'Hotel Gym Express',
      performedAt: new Date('2026-03-16T07:00:00.000Z'),
      notes: 'Free-form session during travel.',
      durationMinutes: 35,
      routineId: null,
      exercises: {
        create: [
          {
            name: 'Goblet squat',
            notes: null,
            loadTrackingEnabled: true,
            position: 0,
            sets: {
              create: [
                { setNumber: 1, reps: '12', load: '24 kg', completed: true },
                { setNumber: 2, reps: '12', load: '24 kg', completed: true },
                { setNumber: 3, reps: '15', load: '24 kg', completed: true },
              ],
            },
          },
          {
            name: 'Treadmill run',
            notes: 'Negative split.',
            loadTrackingEnabled: false,
            position: 1,
            sets: {
              create: [{ setNumber: 1, reps: '20 min', completed: true }],
            },
          },
        ],
      },
    },
  });
}

async function main() {
  await resetDatabase();
  await seedWorkouts();
  await seedTrainingFlow();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Failed to seed demo data.', error);
    await prisma.$disconnect();
    process.exit(1);
  });
