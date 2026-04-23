-- AlterTable: add bodyPart to RoutineExercise
ALTER TABLE "RoutineExercise" ADD COLUMN "bodyPart" TEXT;

-- AlterTable: add bodyPart and increaseWeight to LogExercise
ALTER TABLE "LogExercise" ADD COLUMN "bodyPart" TEXT;
ALTER TABLE "LogExercise" ADD COLUMN "increaseWeight" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: add rpe to LogSet
ALTER TABLE "LogSet" ADD COLUMN "rpe" INTEGER;
