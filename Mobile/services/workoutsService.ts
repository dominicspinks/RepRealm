import { SQLiteRunResult } from "expo-sqlite";
import { db } from "../db/database";
import { workoutsTable, workoutExercisesTable, exercisesTable, categoriesTable, coloursTable, WorkoutWithExercises, Workout, workoutExerciseSetsTable, WorkoutExerciseWithSets, WorkoutExercise, NewWorkoutExerciseSet, NewWorkoutExerciseWithSets, primaryMeasurementAlias, primaryUnitAlias, secondaryMeasurementAlias, secondaryUnitAlias } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

// **Create a new workout**
export async function createWorkout(name: string): Promise<WorkoutWithExercises> {
    const result = await db
        .insert(workoutsTable)
        .values({ name })
        .returning({
            id: workoutsTable.id,
            name: workoutsTable.name,
            createdAt: workoutsTable.createdAt,
            updatedAt: workoutsTable.updatedAt,
        });

    if (!result[0]) {
        throw new Error("Failed to create workout");
    }

    return {
        ...result[0],
        exercises: [],
    };
}

// **Get all workouts**
export async function getWorkouts(): Promise<Workout[]> {
    return await db
        .select()
        .from(workoutsTable);
}

// **Get all workouts with exercises**
export async function getWorkoutsWithExercises(id?: string | string[]): Promise<WorkoutWithExercises[]> {
    let workouts: Workout[];

    if (typeof id === "string") {
        workouts = await db
            .select()
            .from(workoutsTable)
            .where(eq(workoutsTable.id, id));
    }
    else if (Array.isArray(id)) {
        workouts = await db
            .select()
            .from(workoutsTable)
            .where(inArray(workoutsTable.id, id));
    }
    else {
        workouts = await db
            .select()
            .from(workoutsTable);
    }

    const workoutsWithExercises: WorkoutWithExercises[] = await Promise.all(
        workouts.map(async (workout) => {
            const exercises = await getWorkoutExercisesByWorkoutId(workout.id);
            return { ...workout, exercises };
        })
    );

    return workoutsWithExercises;
}

// **Get exercises for a workout**
export async function getWorkoutExercisesByWorkoutId(workoutId: string): Promise<WorkoutExerciseWithSets[]> {
    // **1. Fetch workout exercises (without sets)**
    const exercises = await db
        .select({
            id: workoutExercisesTable.id,
            createdAt: workoutExercisesTable.createdAt,
            workoutId: workoutExercisesTable.workoutId,
            exerciseId: workoutExercisesTable.exerciseId,
            order: workoutExercisesTable.order,

            // Exercise details
            name: exercisesTable.name,
            categoryId: exercisesTable.categoryId,
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

            // Category details
            categoryName: categoriesTable.name,
            categoryColour: coloursTable.hex,
        })
        .from(workoutExercisesTable)
        .innerJoin(exercisesTable, eq(workoutExercisesTable.exerciseId, exercisesTable.id))
        .innerJoin(categoriesTable, eq(exercisesTable.categoryId, categoriesTable.id))
        .innerJoin(coloursTable, eq(categoriesTable.colourId, coloursTable.id))
        .innerJoin(primaryMeasurementAlias, eq(primaryMeasurementAlias.id, exercisesTable.primaryMeasurementId))
        .leftJoin(primaryUnitAlias, eq(primaryUnitAlias.id, exercisesTable.primaryMeasurementUnitId))
        .leftJoin(secondaryMeasurementAlias, eq(secondaryMeasurementAlias.id, exercisesTable.secondaryMeasurementId))
        .leftJoin(secondaryUnitAlias, eq(secondaryUnitAlias.id, exercisesTable.secondaryMeasurementUnitId))
        .where(eq(workoutExercisesTable.workoutId, workoutId));

    if (exercises.length === 0) return [];

    // Extract workout exercise IDs
    const workoutExerciseIds = exercises.map((ex) => ex.id);

    // **2. Fetch sets separately**
    const sets = await db
        .select({
            id: workoutExerciseSetsTable.id,
            workoutExerciseId: workoutExerciseSetsTable.workoutExerciseId,
            measurement1Id: workoutExerciseSetsTable.measurement1Id,
            measurement1Value: workoutExerciseSetsTable.measurement1Value,
            measurement2Id: workoutExerciseSetsTable.measurement2Id,
            measurement2Value: workoutExerciseSetsTable.measurement2Value,
        })
        .from(workoutExerciseSetsTable)
        .where(inArray(workoutExerciseSetsTable.workoutExerciseId, workoutExerciseIds));

    // **3. Map sets to exercises**
    const exerciseMap = new Map<string, WorkoutExerciseWithSets>();

    exercises.forEach((exercise) => {
        exerciseMap.set(exercise.id, { ...exercise, sets: [] });
    });

    sets.forEach((set) => {
        const workoutExercise = exerciseMap.get(set.workoutExerciseId);
        if (workoutExercise?.sets) {
            workoutExercise.sets.push(set);
        }
    });

    return Array.from(exerciseMap.values());
}

// **Get workout by ID**
export async function getWorkoutById(id: string): Promise<Workout | null> {
    const rows = await db
        .select()
        .from(workoutsTable)
        .where(eq(workoutsTable.id, id));

    return rows.length > 0 ? rows[0] : null;
}

// **Delete a workout by ID**
export async function deleteWorkoutById(id: string): Promise<SQLiteRunResult> {
    return await db
        .delete(workoutsTable)
        .where(eq(workoutsTable.id, id));
}

// **Update workout name by ID**
export async function updateWorkoutNameById(id: string, name: string): Promise<SQLiteRunResult> {
    return await db
        .update(workoutsTable)
        .set({ name })
        .where(eq(workoutsTable.id, id));
}

// **Get workout exercise by IDs**
export async function getWorkoutExerciseById(id: string): Promise<WorkoutExercise> {
    const rows = await db
        .select()
        .from(workoutExercisesTable)
        .where(eq(workoutExercisesTable.id, id));

    return rows[0];
}

// **Add Exercise to workout**
export async function addWorkoutExercise(workoutId: string, exerciseId: string, order: number, sets: NewWorkoutExerciseSet[]): Promise<WorkoutExercise> {
    // Add new exercise entry to workout
    const insertedWorkoutExercise = await db
        .insert(workoutExercisesTable)
        .values({ workoutId, exerciseId, order })
        .returning({ id: workoutExercisesTable.id });

    const workoutExerciseId = insertedWorkoutExercise[0].id;

    // Add sets if provided
    if (sets.length > 0) {
        const setsWithWorkoutExerciseId = sets.map(set => ({
            ...set,
            workoutExerciseId,
        }));

        await db.insert(workoutExerciseSetsTable).values(setsWithWorkoutExerciseId);
    }

    return await getWorkoutExerciseById(workoutExerciseId);
}

// **Update a workout exercise**
export async function updateWorkoutExercise(workoutExercise: NewWorkoutExerciseWithSets) {
    if (!workoutExercise.id) {
        throw new Error("Cannot update workout exercise without an ID.");
    }

    // Remove existing sets
    await db
        .delete(workoutExerciseSetsTable)
        .where(eq(workoutExerciseSetsTable.workoutExerciseId, workoutExercise.id));

    // Insert new sets (if any)
    if (workoutExercise.sets.length > 0) {
        await db.insert(workoutExerciseSetsTable).values(workoutExercise.sets);
    }

    return await getWorkoutExerciseById(workoutExercise.id);
}

// **Delete workout exercise by Id**
export async function deleteWorkoutExerciseById(id: string): Promise<SQLiteRunResult> {
    return await db
        .delete(workoutExercisesTable)
        .where(eq(workoutExercisesTable.id, id));
}