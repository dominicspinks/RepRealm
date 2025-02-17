import { db } from "../db/database";
import { exercisesTable, categoriesTable, coloursTable, NewExercise, ExerciseFull, Exercise, primaryMeasurementAlias, primaryUnitAlias, secondaryMeasurementAlias, secondaryUnitAlias, workoutExercisesTable } from "../db/schema";
import { eq, and, ne, inArray } from "drizzle-orm";

// **Fetch all exercises (excluding deleted ones)**
export async function getExercises(): Promise<Exercise[]> {
    return await db.select()
        .from(exercisesTable)
        .where(eq(exercisesTable.isDeleted, false));
}

// **Fetch all exercises with full details (excluding deleted ones)**
export async function getExercisesFull(): Promise<ExerciseFull[]> {
    return await db
        .select({
            id: exercisesTable.id,
            name: exercisesTable.name,
            categoryId: exercisesTable.categoryId,
            categoryName: categoriesTable.name,
            categoryColour: coloursTable.hex,
            primaryMeasurementId: exercisesTable.primaryMeasurementId,
            primaryMeasurementName: primaryMeasurementAlias.name,
            primaryMeasurementUnitId: exercisesTable.primaryMeasurementUnitId,
            primaryMeasurementUnitName: primaryUnitAlias.unit,
            primaryMeasurementUnitDecimalPlaces: primaryUnitAlias.decimalPlaces,
            secondaryMeasurementId: exercisesTable.secondaryMeasurementId,
            secondaryMeasurementName: secondaryMeasurementAlias.name,
            secondaryMeasurementUnitId: exercisesTable.secondaryMeasurementUnitId,
            secondaryMeasurementUnitName: secondaryUnitAlias.unit,
            secondaryMeasurementUnitDecimalPlaces: secondaryUnitAlias.decimalPlaces,
            rest: exercisesTable.rest,
            weightIncrement: exercisesTable.weightIncrement,
            createdAt: exercisesTable.createdAt,
            updatedAt: exercisesTable.updatedAt,
            isDeleted: exercisesTable.isDeleted,
        })
        .from(exercisesTable)
        .innerJoin(categoriesTable, eq(categoriesTable.id, exercisesTable.categoryId))
        .innerJoin(coloursTable, eq(coloursTable.id, categoriesTable.colourId))
        .innerJoin(primaryMeasurementAlias, eq(primaryMeasurementAlias.id, exercisesTable.primaryMeasurementId))
        .leftJoin(primaryUnitAlias, eq(primaryUnitAlias.id, exercisesTable.primaryMeasurementUnitId))
        .leftJoin(secondaryMeasurementAlias, eq(secondaryMeasurementAlias.id, exercisesTable.secondaryMeasurementId))
        .leftJoin(secondaryUnitAlias, eq(secondaryUnitAlias.id, exercisesTable.secondaryMeasurementUnitId))
        .where(eq(exercisesTable.isDeleted, false));
}

// **Check if exercise name is unique (excluding soft-deleted)**
export async function isExerciseNameUnique(name: string, excludeId?: string) {
    const existing = await db
        .select({ id: exercisesTable.id })
        .from(exercisesTable)
        .where(
            and(
                eq(exercisesTable.name, name.trim()),
                eq(exercisesTable.isDeleted, false),
                excludeId ? ne(exercisesTable.id, excludeId) : ne(exercisesTable.id, "")
            )
        );

    return existing.length === 0;
}

// **Insert a new exercise**
export async function addExercise({
    name,
    categoryId,
    primaryMeasurementId,
    primaryMeasurementUnitId,
    secondaryMeasurementId,
    secondaryMeasurementUnitId,
    rest,
    weightIncrement,
}: NewExercise) {
    await db.insert(exercisesTable).values({
        name: name.trim(),
        categoryId,
        primaryMeasurementId,
        primaryMeasurementUnitId: primaryMeasurementUnitId || null,
        secondaryMeasurementId: secondaryMeasurementId || null,
        secondaryMeasurementUnitId: secondaryMeasurementUnitId || null,
        rest: rest || null,
        weightIncrement: weightIncrement || null,
    });
}

// **Update an existing exercise**
export async function updateExercise(
    id: string,
    {
        name,
        categoryId,
        primaryMeasurementId,
        primaryMeasurementUnitId,
        secondaryMeasurementId,
        secondaryMeasurementUnitId,
        rest,
        weightIncrement,
    }: NewExercise
) {
    await db
        .update(exercisesTable)
        .set({
            name: name.trim(),
            categoryId,
            primaryMeasurementId,
            primaryMeasurementUnitId: primaryMeasurementUnitId || null,
            secondaryMeasurementId: secondaryMeasurementId || null,
            secondaryMeasurementUnitId: secondaryMeasurementUnitId || null,
            rest: rest || null,
            weightIncrement: weightIncrement || null,
            updatedAt: new Date(),
        })
        .where(eq(exercisesTable.id, id));
}

// **Delete an exercise (sets is_deleted = true)**
export async function deleteExercise(id: string) {
    await db.transaction(async (tx) => {
        await tx.update(exercisesTable).set({ isDeleted: true }).where(eq(exercisesTable.id, id));
        await tx.delete(workoutExercisesTable).where(eq(workoutExercisesTable.exerciseId, id));
    });
}

// **Delete multiple exercises**
export async function deleteExercises(ids: string[]) {
    await db.transaction(async (tx) => {
        await tx.update(exercisesTable).set({ isDeleted: true }).where(inArray(exercisesTable.id, ids));
        await tx.delete(workoutExercisesTable).where(inArray(workoutExercisesTable.exerciseId, ids));
    });
}

// **Get an exercise by ID**
export async function getExerciseById(id: string): Promise<ExerciseFull | null> {
    const rows = await db
        .select({
            id: exercisesTable.id,
            name: exercisesTable.name,
            categoryId: exercisesTable.categoryId,
            categoryName: categoriesTable.name,
            categoryColour: coloursTable.hex,
            primaryMeasurementId: exercisesTable.primaryMeasurementId,
            primaryMeasurementName: primaryMeasurementAlias.name,
            primaryMeasurementUnitId: exercisesTable.primaryMeasurementUnitId,
            primaryMeasurementUnitName: primaryUnitAlias.unit,
            primaryMeasurementUnitDecimalPlaces: primaryUnitAlias.decimalPlaces,
            secondaryMeasurementId: exercisesTable.secondaryMeasurementId,
            secondaryMeasurementName: secondaryMeasurementAlias.name,
            secondaryMeasurementUnitId: exercisesTable.secondaryMeasurementUnitId,
            secondaryMeasurementUnitName: secondaryUnitAlias.unit,
            secondaryMeasurementUnitDecimalPlaces: secondaryUnitAlias.decimalPlaces,
            rest: exercisesTable.rest,
            weightIncrement: exercisesTable.weightIncrement,
            createdAt: exercisesTable.createdAt,
            updatedAt: exercisesTable.updatedAt,
            isDeleted: exercisesTable.isDeleted,
        })
        .from(exercisesTable)
        .innerJoin(categoriesTable, eq(categoriesTable.id, exercisesTable.categoryId))
        .innerJoin(coloursTable, eq(coloursTable.id, categoriesTable.colourId))
        .innerJoin(primaryMeasurementAlias, eq(primaryMeasurementAlias.id, exercisesTable.primaryMeasurementId))
        .leftJoin(primaryUnitAlias, eq(primaryUnitAlias.id, exercisesTable.primaryMeasurementUnitId))
        .leftJoin(secondaryMeasurementAlias, eq(secondaryMeasurementAlias.id, exercisesTable.secondaryMeasurementId))
        .leftJoin(secondaryUnitAlias, eq(secondaryUnitAlias.id, exercisesTable.secondaryMeasurementUnitId))
        .where(eq(exercisesTable.id, id));

    return rows.length > 0 ? rows[0] : null;
}