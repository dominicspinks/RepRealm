import { db } from "../db/database";
import { coloursTable, ColourInsertSchema } from "../db/schema";
import { eq } from "drizzle-orm";

// Fetch all colours
export async function getColours() {
    return await db.select().from(coloursTable);
}

// Insert a new colour with validation
export async function addColour(hex: string) {
    // Validate using auto-generated Zod schema
    const result = ColourInsertSchema.safeParse({ hex });

    if (!result.success) {
        throw new Error(result.error.format().hex?._errors.join(", ") || "Invalid data");
    }

    await db.insert(coloursTable).values(result.data);
}

// Get colour by ID with UUID validation
export async function getColourById(id: string) {
    const colour = await db.select().from(coloursTable).where(eq(coloursTable.id, id));

    if (!colour.length) throw new Error("Colour not found");

    return colour[0];
}
