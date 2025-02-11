import { db } from "./database";
import { coloursTable, measurementsTable, measurementUnitsTable } from "./schema";

const defaultColours = [
    { id: "0194ee8c-5209-721e-8460-49b0ee60fb79", hex: "#FF5733" },
    { id: "0194ee8c-5209-78ed-a662-d07b63463d99", hex: "#FFBD33" },
    { id: "0194ee8c-5209-76d1-8eb9-115700a792a9", hex: "#33FF57" },
    { id: "0194ee8c-5209-7a1f-a857-1ab0a7bb2236", hex: "#3385FF" },
    { id: "0194ee8c-5209-7936-bfef-2278fa60683f", hex: "#8B33FF" },
    { id: "0194ee8c-5209-7964-86c0-eacd8103b703", hex: "#FF33A8" },
    { id: "0194ee8c-5209-7564-a709-bafb1fd1782e", hex: "#A833FF" },
    { id: "0194ee8c-5209-7bfe-afc8-a85ca3bf8bae", hex: "#33FFF0" },
    { id: "0194ee8c-5209-7254-b29b-3e51a460cfdd", hex: "#F033FF" },
    { id: "0194ee8c-5209-7876-b80a-1a7fc5ad6a0a", hex: "#B4B4B4" },
    { id: "0194ee8c-5209-7fd6-bba8-2fa0f7dd022c", hex: "#787878" },
    { id: "0194ee8c-5209-7bea-aca6-cb2bcb42f298", hex: "#5C4033" },
    { id: "0194ee8c-5209-79cd-98ac-2a4f521fc210", hex: "#2F4F4F" },
    { id: "0194ee8c-5209-756a-b36c-5e62d6c8e502", hex: "#708090" },
    { id: "0194ee8c-5209-721b-b5d9-e1d1fcd8fe3c", hex: "#008080" },
    { id: "0194ee8c-5209-7fe7-9a2a-a08ced4cd862", hex: "#808000" },
    { id: "0194ee8c-5209-79e9-9b17-d8e840fe540a", hex: "#800000" },
    { id: "0194ee8c-5209-772e-9365-565cbdaddd89", hex: "#000080" },
];

const defaultMeasurements = [
    { id: "0194ee8c-5209-751d-af6e-f6333c66576e", name: "Reps" },
    { id: "0194ee8c-5209-726c-9236-cc92b9023700", name: "Time" },
    { id: "0194ee8c-5209-7037-be51-192205d4808d", name: "Weight" },
    { id: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", name: "Distance" },
]

const defaultMeasurementUnits = [
    { id: "0194ee8c-5209-7b3e-ad53-79850de04965", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "m" },
    { id: "0194ee8c-5209-7559-8c67-f6cdaf47980b", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "km" },
    { id: "0194ee8c-5209-713f-97e1-75e58efb3613", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "ft" },
    { id: "0194ee8c-5209-7a5f-86ed-b15a82cdacb4", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "yd" },
    { id: "0194ee8c-5209-7f3d-9d2f-e30d97f3faa8", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "mi" },
    { id: "0194ee8c-5209-7952-8ea8-145933247711", measurementId: "0194ee8c-5209-7037-be51-192205d4808d", unit: "kg" },
    { id: "0194ee8c-5209-7e22-a8b8-05fb12b64bf0", measurementId: "0194ee8c-5209-7037-be51-192205d4808d", unit: "lb" },
]

// Function to check and insert initial data
export async function initialiseDatabase() {
    // **Delete all existing records first**
    // await db.delete(coloursTable);
    // await db.delete(measurementsTable);
    // await db.delete(measurementUnitsTable);


    // Insert default colours
    console.log("Populating colours table with default data...");
    await db.insert(coloursTable)
        .values(defaultColours)
        .onConflictDoNothing();

    console.log("Populating measurements table with default data...");
    await db.insert(measurementsTable)
        .values(defaultMeasurements)
        .onConflictDoNothing();
    await db.insert(measurementUnitsTable)
        .values(defaultMeasurementUnits)
        .onConflictDoNothing();

    console.log("Database initialisation complete.");
}
