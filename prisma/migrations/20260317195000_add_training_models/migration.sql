-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "focus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RoutineBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "routineId" TEXT NOT NULL,
    CONSTRAINT "RoutineBlock_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoutineExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "targetSets" INTEGER,
    "targetReps" TEXT,
    "restSeconds" INTEGER,
    "notes" TEXT,
    "loadTrackingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "routineBlockId" TEXT NOT NULL,
    CONSTRAINT "RoutineExercise_routineBlockId_fkey" FOREIGN KEY ("routineBlockId") REFERENCES "RoutineBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "performedAt" DATETIME NOT NULL,
    "notes" TEXT,
    "durationMinutes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "routineId" TEXT,
    CONSTRAINT "LogSession_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "loadTrackingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "logSessionId" TEXT NOT NULL,
    "routineExerciseId" TEXT,
    CONSTRAINT "LogExercise_logSessionId_fkey" FOREIGN KEY ("logSessionId") REFERENCES "LogSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LogExercise_routineExerciseId_fkey" FOREIGN KEY ("routineExerciseId") REFERENCES "RoutineExercise" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "setNumber" INTEGER NOT NULL,
    "reps" TEXT,
    "load" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "logExerciseId" TEXT NOT NULL,
    CONSTRAINT "LogSet_logExerciseId_fkey" FOREIGN KEY ("logExerciseId") REFERENCES "LogExercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RoutineBlock_routineId_position_idx" ON "RoutineBlock"("routineId", "position");

-- CreateIndex
CREATE INDEX "RoutineExercise_routineBlockId_position_idx" ON "RoutineExercise"("routineBlockId", "position");

-- CreateIndex
CREATE INDEX "LogSession_performedAt_idx" ON "LogSession"("performedAt");

-- CreateIndex
CREATE INDEX "LogSession_routineId_performedAt_idx" ON "LogSession"("routineId", "performedAt");

-- CreateIndex
CREATE INDEX "LogExercise_logSessionId_position_idx" ON "LogExercise"("logSessionId", "position");

-- CreateIndex
CREATE INDEX "LogSet_logExerciseId_setNumber_idx" ON "LogSet"("logExerciseId", "setNumber");
