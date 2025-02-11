import { db } from "../db/database";
import { exercisesTable, categoriesTable, measurementsTable, measurementUnitsTable, coloursTable, NewExercise } from "../db/schema";
import { eq, and } from "drizzle-orm";

// **Fetch all exercises (excluding deleted ones)**
export async function getExercises() {
    return await db
        .select({
            id: exercisesTable.id,
            name: exercisesTable.name,
            categoryId: exercisesTable.categoryId,
            categoryName: categoriesTable.name,
            categoryColour: coloursTable.hex,
            primaryMeasurementId: exercisesTable.primaryMeasurementId,
            primaryMeasurementName: measurementsTable.name,
            primaryMeasurementUnitId: exercisesTable.primaryMeasurementUnitId,
            primaryMeasurementUnitName: measurementUnitsTable.unit,
            secondaryMeasurementId: exercisesTable.secondaryMeasurementId,
            secondaryMeasurementName: measurementsTable.name,
            secondaryMeasurementUnitId: exercisesTable.secondaryMeasurementUnitId,
            secondaryMeasurementUnitName: measurementUnitsTable.unit,
            rest: exercisesTable.rest,
            weightIncrement: exercisesTable.weightIncrement,
        })
        .from(exercisesTable)
        .innerJoin(categoriesTable, eq(categoriesTable.id, exercisesTable.categoryId))
        .innerJoin(measurementsTable, eq(measurementsTable.id, exercisesTable.primaryMeasurementId))
        .innerJoin(coloursTable, eq(coloursTable.id, categoriesTable.colourId))
        .leftJoin(measurementUnitsTable, eq(measurementUnitsTable.id, exercisesTable.primaryMeasurementUnitId))
        .leftJoin(measurementsTable, eq(measurementsTable.id, exercisesTable.secondaryMeasurementId))
        .leftJoin(measurementUnitsTable, eq(measurementUnitsTable.id, exercisesTable.secondaryMeasurementUnitId))
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
                excludeId ? eq(exercisesTable.id, excludeId) : eq(exercisesTable.id, "")
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
