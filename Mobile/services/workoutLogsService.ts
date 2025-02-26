import { eq, inArray, sql, desc } from "drizzle-orm";
import { db } from "../db/database";
import { workoutLogsTable, workoutLogExercisesTable, NewWorkoutLogExercise, workoutLogExerciseSetsTable, WorkoutLog, WorkoutLogWithExercises, WorkoutLogExerciseWithSets, WorkoutLogExerciseSet, exercisesTable, categoriesTable, coloursTable, primaryMeasurementAlias, primaryUnitAlias, secondaryMeasurementAlias, secondaryUnitAlias, NewWorkoutLogExerciseSet, NewWorkoutLog } from "../db/schema";
import { getWorkoutExercisesByWorkoutId } from "./workoutsService";
import { getExerciseById } from "./exercisesService";

async function fetchWorkoutLogExercisesWithSets(filter: { logIds?: string[]; exerciseId?: string }) {
    return await db
        .select({
            logExerciseId: workoutLogExercisesTable.id,
            workoutLogId: workoutLogExercisesTable.workoutLogId,
            exerciseId: workoutLogExercisesTable.exerciseId,
            order: workoutLogExercisesTable.order,

            // Exercise details
            name: exercisesTable.name,
            categoryId: exercisesTable.categoryId,
            categoryName: categoriesTable.name,
            categoryColour: coloursTable.hex,
            rest: exercisesTable.rest,
            weightIncrement: exercisesTable.weightIncrement,
            primaryMeasurementId: exercisesTable.primaryMeasurementId,
            primaryMeasurementUnitId: exercisesTable.primaryMeasurementUnitId,
            secondaryMeasurementId: exercisesTable.secondaryMeasurementId,
            secondaryMeasurementUnitId: exercisesTable.secondaryMeasurementUnitId,

            // Measurement details
            primaryMeasurementName: primaryMeasurementAlias.name,
            primaryMeasurementUnitName: primaryUnitAlias.unit,
            primaryMeasurementUnitDecimalPlaces: primaryUnitAlias.decimalPlaces,
            secondaryMeasurementName: secondaryMeasurementAlias.name,
            secondaryMeasurementUnitName: secondaryUnitAlias.unit,
            secondaryMeasurementUnitDecimalPlaces: secondaryUnitAlias.decimalPlaces,

            // Set details
            setId: workoutLogExerciseSetsTable.id,
            measurement1Id: workoutLogExerciseSetsTable.measurement1Id,
            measurement1Value: workoutLogExerciseSetsTable.measurement1Value,
            measurement2Id: workoutLogExerciseSetsTable.measurement2Id,
            measurement2Value: workoutLogExerciseSetsTable.measurement2Value,
            isComplete: workoutLogExerciseSetsTable.isComplete,
            completedAt: workoutLogExerciseSetsTable.completedAt,
        })
        .from(workoutLogExercisesTable)
        .innerJoin(exercisesTable, eq(workoutLogExercisesTable.exerciseId, exercisesTable.id))
        .innerJoin(categoriesTable, eq(exercisesTable.categoryId, categoriesTable.id))
        .innerJoin(coloursTable, eq(categoriesTable.colourId, coloursTable.id))
        .innerJoin(primaryMeasurementAlias, eq(primaryMeasurementAlias.id, exercisesTable.primaryMeasurementId))
        .leftJoin(primaryUnitAlias, eq(primaryUnitAlias.id, exercisesTable.primaryMeasurementUnitId))
        .leftJoin(secondaryMeasurementAlias, eq(secondaryMeasurementAlias.id, exercisesTable.secondaryMeasurementId))
        .leftJoin(secondaryUnitAlias, eq(secondaryUnitAlias.id, exercisesTable.secondaryMeasurementUnitId))
        .leftJoin(workoutLogExerciseSetsTable, eq(workoutLogExercisesTable.id, workoutLogExerciseSetsTable.workoutLogExerciseId))
        .where(
            filter.exerciseId
                ? eq(workoutLogExercisesTable.id, filter.exerciseId)
                : inArray(workoutLogExercisesTable.workoutLogId, filter.logIds!)
        );
}

function processExercisesWithSets(exercisesWithSetsRaw: any[]): WorkoutLogExerciseWithSets[] {
    const exercisesMap = new Map<string, WorkoutLogExerciseWithSets>();

    exercisesWithSetsRaw.forEach(exercise => {
        if (!exercisesMap.has(exercise.logExerciseId)) {
            exercisesMap.set(exercise.logExerciseId, {
                id: exercise.logExerciseId,
                workoutLogId: exercise.workoutLogId,
                exerciseId: exercise.exerciseId,
                order: exercise.order,
                name: exercise.name,
                categoryId: exercise.categoryId,
                categoryName: exercise.categoryName,
                categoryColour: exercise.categoryColour,
                rest: exercise.rest,
                weightIncrement: exercise.weightIncrement,
                primaryMeasurementId: exercise.primaryMeasurementId,
                primaryMeasurementUnitId: exercise.primaryMeasurementUnitId,
                primaryMeasurementName: exercise.primaryMeasurementName,
                primaryMeasurementUnitName: exercise.primaryMeasurementUnitName,
                primaryMeasurementUnitDecimalPlaces: exercise.primaryMeasurementUnitDecimalPlaces,
                secondaryMeasurementId: exercise.secondaryMeasurementId,
                secondaryMeasurementUnitId: exercise.secondaryMeasurementUnitId,
                secondaryMeasurementName: exercise.secondaryMeasurementName,
                secondaryMeasurementUnitName: exercise.secondaryMeasurementUnitName,
                secondaryMeasurementUnitDecimalPlaces: exercise.secondaryMeasurementUnitDecimalPlaces,
                sets: []
            });
        }

        if (exercise.setId) {
            (exercisesMap.get(exercise.logExerciseId)!.sets ??= []).push({
                id: exercise.setId,
                workoutLogExerciseId: exercise.logExerciseId,
                measurement1Id: exercise.measurement1Id!,
                measurement1Value: exercise.measurement1Value,
                measurement2Id: exercise.measurement2Id ?? null,
                measurement2Value: exercise.measurement2Value ?? null,
                isComplete: exercise.isComplete,
                completedAt: exercise.completedAt,
            });
        }
    });

    return Array.from(exercisesMap.values());
}

// **Start a new empty workout log**
export async function createWorkoutLog(workoutId: string | null = null): Promise<WorkoutLogWithExercises> {
    return await db.transaction(async (tx) => {
        const workoutLogInsert = await tx
            .insert(workoutLogsTable)
            .values({ workoutId })
            .returning({
                id: workoutLogsTable.id,
                workoutId: workoutLogsTable.workoutId,
                createdAt: workoutLogsTable.createdAt,
                startedAt: workoutLogsTable.startedAt,
                stoppedAt: workoutLogsTable.stoppedAt
            });

        const newLog = workoutLogInsert[0];

        if (!workoutId) return {
            ...newLog,
            exercises: [],
        };

        // Copy exercises from the saved workout
        const exercises = await getWorkoutExercisesByWorkoutId(workoutId);
        if (!exercises.length) return {
            ...newLog,
            exercises: [],
        };

        // Insert exercises into the log
        const logExercises: WorkoutLogExerciseWithSets[] = [];

        for (const exercise of exercises) {
            const newLogExercise: NewWorkoutLogExercise = {
                workoutLogId: newLog.id,
                exerciseId: exercise.exerciseId,
                order: exercise.order,
            };

            const exerciseInsert = await tx
                .insert(workoutLogExercisesTable)
                .values(newLogExercise)
                .returning({
                    id: workoutLogExercisesTable.id,
                    workoutLogId: workoutLogExercisesTable.workoutLogId,
                    exerciseId: workoutLogExercisesTable.exerciseId,
                    order: workoutLogExercisesTable.order,
                });


            const exerciseDetails = await getExerciseById(exercise.exerciseId);

            if (!exerciseDetails) {
                throw new Error(`Exercise with id ${exercise.exerciseId} not found`);
            }

            const { id, createdAt, updatedAt, isDeleted, ...exerciseData } = exerciseDetails;

            const fullExercise = { ...exerciseInsert[0], ...exerciseData };

            const newLogExerciseId = fullExercise.id;


            // Prepare sets for insertion
            const exerciseSets = (exercise.sets || []).map(set => ({
                workoutLogExerciseId: newLogExerciseId,
                measurement1Id: set.measurement1Id,
                measurement1Value: set.measurement1Value,
                measurement2Id: set.measurement2Id ?? null,
                measurement2Value: set.measurement2Value ?? null,
                isComplete: false,
                completedAt: null,
            }));

            let insertedSets: WorkoutLogExerciseSet[] = [];
            if (exerciseSets.length) {
                insertedSets = await tx
                    .insert(workoutLogExerciseSetsTable)
                    .values(exerciseSets)
                    .returning({
                        id: workoutLogExerciseSetsTable.id,
                        workoutLogExerciseId: workoutLogExerciseSetsTable.workoutLogExerciseId,
                        measurement1Id: workoutLogExerciseSetsTable.measurement1Id,
                        measurement1Value: workoutLogExerciseSetsTable.measurement1Value,
                        measurement2Id: workoutLogExerciseSetsTable.measurement2Id,
                        measurement2Value: workoutLogExerciseSetsTable.measurement2Value,
                        isComplete: workoutLogExerciseSetsTable.isComplete,
                        completedAt: workoutLogExerciseSetsTable.completedAt,
                    });
            }

            // Attach sets to exercise object
            logExercises.push({
                ...fullExercise,
                sets: insertedSets,
            });
        }

        return {
            ...newLog,
            exercises: logExercises,
        };
    });
}

// **Delete workout log by id**
export async function deleteWorkoutLogById(id: string) {
    await db.delete(workoutLogsTable).where(eq(workoutLogsTable.id, id))
}

// **Get workout log by id**
export async function getWorkoutLogById(id: string): Promise<WorkoutLog | null> {
    const rows = await db
        .select()
        .from(workoutLogsTable)
        .where(eq(workoutLogsTable.id, id));

    return rows[0] ?? null;
}

// **Get full workout log by id**
export async function getWorkoutLogsWithExercises(id?: string | string[]): Promise<WorkoutLogWithExercises[]> {
    const workoutLogs = await db
        .select()
        .from(workoutLogsTable)
        .where(
            typeof id === "string"
                ? eq(workoutLogsTable.id, id)
                : Array.isArray(id)
                    ? inArray(workoutLogsTable.id, id)
                    : undefined
        )
        .orderBy(desc(sql`COALESCE(${workoutLogsTable.startedAt}, ${workoutLogsTable.createdAt})`));

    if (!workoutLogs.length) return [];

    const exercisesWithSets = await fetchWorkoutLogExercisesWithSets({ logIds: workoutLogs.map(log => log.id) });

    const workoutsMap = new Map<string, WorkoutLogWithExercises>();

    workoutLogs.forEach(log => {
        workoutsMap.set(log.id, { ...log, exercises: [] });
    });

    const processedExercises = processExercisesWithSets(exercisesWithSets);

    processedExercises.forEach(exercise => {
        workoutsMap.get(exercise.workoutLogId)?.exercises.push(exercise);
    });

    return Array.from(workoutsMap.values());
}

// **Get workout log exercise by id**
export async function getWorkoutLogExerciseById(id: string): Promise<WorkoutLogExerciseWithSets | null> {
    const exercisesWithSetsRaw = await fetchWorkoutLogExercisesWithSets({ exerciseId: id });

    if (!exercisesWithSetsRaw.length) return null;

    return processExercisesWithSets(exercisesWithSetsRaw)[0] ?? null;
}

// **Add exercise to workout log**
export async function addWorkoutLogExercise(workoutLogExercise: NewWorkoutLogExercise): Promise<string> {
    const rows = await db
        .insert(workoutLogExercisesTable)
        .values(workoutLogExercise)
        .returning({ id: workoutLogExercisesTable.id });

    return rows[0].id;
}

// **Add or update workout log set**
export async function saveWorkoutLogSet(set: NewWorkoutLogExerciseSet) {
    await db
        .insert(workoutLogExerciseSetsTable)
        .values(set)
        .onConflictDoUpdate({
            target: workoutLogExerciseSetsTable.id,
            set: {
                workoutLogExerciseId: set.workoutLogExerciseId,
                measurement1Id: set.measurement1Id,
                measurement1Value: set.measurement1Value,
                measurement2Id: set.measurement2Id ?? null,
                measurement2Value: set.measurement2Value ?? null,
                isComplete: set.isComplete,
                completedAt: set.completedAt,
            },
        })
}

// **Delete workout log exercise by id**
export async function deleteWorkoutLogExerciseById(id: string) {
    await db
        .delete(workoutLogExercisesTable)
        .where(eq(workoutLogExercisesTable.id, id));
}

// **Delete workout log set by id**
export async function deleteWorkoutLogSet(setId: string) {
    await db
        .delete(workoutLogExerciseSetsTable)
        .where(eq(workoutLogExerciseSetsTable.id, setId));
}

// **Update workout log by id**
export async function updateWorkoutLogById(id: string, updates: Partial<WorkoutLog>) {
    await db
        .update(workoutLogsTable)
        .set(updates)
        .where(eq(workoutLogsTable.id, id));
}