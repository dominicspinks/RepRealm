import { db } from "../db/database";
import { Measurement, measurementsTable, measurementUnitsTable } from "../db/schema";
import { eq } from "drizzle-orm";

// **Fetch all measurements**
export async function getMeasurements() {
    return await db.select().from(measurementsTable);
}

// **Fetch a measurement by ID**
export async function getMeasurementById(id: string) {
    const result = await db
        .select()
        .from(measurementsTable)
        .where(eq(measurementsTable.id, id))
        .limit(1);

    return result.length > 0 ? result[0] : null;
}

// **Fetch all measurement units**
export async function getUnits() {
    return await db.select().from(measurementUnitsTable);
}
