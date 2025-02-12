import { alias } from "drizzle-orm/sqlite-core";
import { db } from "../db/database";
import { exercisesTable, categoriesTable, measurementsTable, measurementUnitsTable, coloursTable, NewExercise, ExerciseFull, Exercise } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";

// **Fetch all exercises (excluding deleted ones)**
export async function getExercises(): Promise<Exercise[]> {
    return await db.select()
        .from(exercisesTable)
        .where(eq(exercisesTable.isDeleted, false));
}

// Aliases for multiple joins
const primaryMeasurementAlias = alias(measurementsTable, "primary_measurement");
const primaryUnitAlias = alias(measurementUnitsTable, "primary_unit");
const secondaryMeasurementAlias = alias(measurementsTable, "secondary_measurement");
const secondaryUnitAlias = alias(measurementUnitsTable, "secondary_unit");

// **Fetch all exercises with full details (excluding deleted ones)**
export async function getExercisesFull(): Promise<ExerciseFull[]> {
    console.log('Fetching all exercises');
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
            secondaryMeasurementId: exercisesTable.secondaryMeasurementId,
            secondaryMeasurementName: secondaryMeasurementAlias.name,
            secondaryMeasurementUnitId: exercisesTable.secondaryMeasurementUnitId,
            secondaryMeasurementUnitName: secondaryUnitAlias.unit,
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

// **Soft delete an exercise (sets is_deleted = true)**
export async function deleteExercise(id: string) {
    await db.update(exercisesTable).set({ isDeleted: true }).where(eq(exercisesTable.id, id));
}
