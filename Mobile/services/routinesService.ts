import { db } from "../db/database";
import { NewRoutineWorkout, Routine, routinesTable, RoutineWithFullWorkouts, RoutineWithWorkouts, RoutineWorkout, routineWorkoutsTable, RoutineWorkoutWithWorkout, workoutsTable } from "../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getWorkoutsWithExercises } from "./workoutsService";

// **Create a new routine**
export async function createRoutine(name: string): Promise<RoutineWithWorkouts> {
    const result = await db
        .insert(routinesTable)
        .values({ name })
        .returning({
            id: routinesTable.id,
            name: routinesTable.name,
            createdAt: routinesTable.createdAt,
            updatedAt: routinesTable.updatedAt,
        });

    if (!result[0]) {
        throw new Error("Failed to create routine");
    }

    return {
        ...result[0],
        workouts: [],
    };
}

// **Add workout to routine**
export async function addWorkoutToRoutine({ routineId, workoutId, order }: NewRoutineWorkout): Promise<RoutineWorkout> {
    console.log("Adding workout to routine", { routineId, workoutId, order });
    const result = await db
        .insert(routineWorkoutsTable)
        .values({ routineId, workoutId, order })
        .onConflictDoUpdate({
            target: [routineWorkoutsTable.routineId, routineWorkoutsTable.workoutId],
            set: { order },
        })
        .returning({
            id: routineWorkoutsTable.id,
            routineId: routineWorkoutsTable.routineId,
            workoutId: routineWorkoutsTable.workoutId,
            order: routineWorkoutsTable.order,
        });

    console.log("Workout added", result);
    return result[0];
}

// **Get workouts by routine ID**
export async function getRoutineWorkoutsByRoutineId(routineId: string): Promise<RoutineWorkoutWithWorkout[]> {
    const routineWorkouts = await db
        .select({
            id: routineWorkoutsTable.id,
            routineId: routineWorkoutsTable.routineId,
            workoutId: routineWorkoutsTable.workoutId,
            order: routineWorkoutsTable.order,
        })
        .from(routineWorkoutsTable)
        .where(eq(routineWorkoutsTable.routineId, routineId));

    if (routineWorkouts.length === 0) return [];

    const workouts = await getWorkoutsWithExercises(routineWorkouts.map(routineWorkout => routineWorkout.workoutId));

    return routineWorkouts.reduce<RoutineWorkoutWithWorkout[]>((acc, routineWorkout) => {
        const workout = workouts.find(w => w.id === routineWorkout.workoutId);
        if (workout) acc.push({ ...routineWorkout, workout });
        return acc;
    }, []);
}

// **Get routines with workouts**
export async function getRoutinesWithWorkouts(): Promise<RoutineWithFullWorkouts[]> {
    const routines = await db
        .select()
        .from(routinesTable);

    if (routines.length === 0) return [];

    const routineWorkouts = await db
        .select()
        .from(routineWorkoutsTable)
        .where(inArray(routineWorkoutsTable.routineId, routines.map(r => r.id)));

    if (routineWorkouts.length === 0) {
        return routines.map(routine => ({ ...routine, workouts: [] }));
    }

    const workouts = await getWorkoutsWithExercises(routineWorkouts.map(rw => rw.workoutId));

    const routineWorkoutMap = routineWorkouts.reduce<Record<string, RoutineWorkoutWithWorkout[]>>((acc, routineWorkout) => {
        const workout = workouts.find(w => w.id === routineWorkout.workoutId);
        if (!workout) return acc;

        if (!acc[routineWorkout.routineId]) {
            acc[routineWorkout.routineId] = [];
        }

        acc[routineWorkout.routineId].push({ ...routineWorkout, workout });
        return acc;
    }, {});

    // Merge workouts into routines
    return routines.map(routine => ({
        ...routine,
        workouts: routineWorkoutMap[routine.id] ?? [],
    }));
}

// **Delete routine by ID**
export async function deleteRoutineById(id: string) {
    await db
        .delete(routinesTable)
        .where(eq(routinesTable.id, id));
}

// **Update routine name by ID**
export async function updateRoutineNameById(id: string, name: string) {
    return await db
        .update(routinesTable)
        .set({ name })
        .where(eq(routinesTable.id, id));
}

// **Delete workout from routine**
export async function deleteWorkoutFromRoutine(routineId: string, workoutId: string) {
    await db
        .delete(routineWorkoutsTable)
        .where(and(
            eq(routineWorkoutsTable.routineId, routineId),
            eq(routineWorkoutsTable.workoutId, workoutId))
        );
}