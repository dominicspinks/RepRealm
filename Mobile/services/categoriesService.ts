import { db } from "../db/database";
import { categoriesTable, CategoryWithColour, coloursTable, exercisesTable } from "../db/schema";
import { eq, is } from "drizzle-orm";
import { deleteExercises } from "./exercisesService";

// **Fetch all categories (excluding deleted ones)**
export async function getCategories(): Promise<CategoryWithColour[]> {
    return await db
        .select({
            id: categoriesTable.id,
            name: categoriesTable.name,
            colourId: categoriesTable.colourId,
            colourHex: coloursTable.hex,
            isDeleted: categoriesTable.isDeleted,
            createdAt: categoriesTable.createdAt,
            updatedAt: categoriesTable.updatedAt,
        })
        .from(categoriesTable)
        .innerJoin(coloursTable, eq(coloursTable.id, categoriesTable.colourId))
        .where(eq(categoriesTable.isDeleted, false));
}

// **Fetch a category by ID**
export async function getCategoryById(id: string) {
    return await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
}

// **Check if a category name is unique**
export async function isCategoryNameUnique(name: string, existingId?: string) {
    const existing = await db.select().from(categoriesTable).where(eq(categoriesTable.name, name));

    return existing.length === 0 || (existing.length === 1 && existing[0].id === existingId);
}

// **Insert a new category**
export async function addCategory(name: string, colourId: string) {
    await db.insert(categoriesTable).values({
        name,
        colourId,
    });
}

// **Update an existing category**
export async function updateCategory(id: string, name: string, colourId: string) {
    await db.update(categoriesTable).set({ name, colourId, updatedAt: new Date() }).where(eq(categoriesTable.id, id));
}

// **Delete a category by ID**
export async function deleteCategory(id: string) {
    await db.transaction(async (tx) => {
        await tx.update(categoriesTable).set({ isDeleted: true }).where(eq(categoriesTable.id, id));

        const exerciseIds = await tx
            .select({ id: exercisesTable.id })
            .from(exercisesTable)
            .where(eq(exercisesTable.categoryId, id));

        await deleteExercises(exerciseIds.map((e) => e.id));
    });
}