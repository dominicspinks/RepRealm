import { sql } from "drizzle-orm";
import { db } from "./database";
import { categoriesTable, coloursTable, exercisesTable, measurementsTable, measurementUnitsTable } from "./schema";

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
    { id: "0194ee8c-5209-7b3e-ad53-79850de04965", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "m", decimalPlaces: 0 },
    { id: "0194ee8c-5209-7559-8c67-f6cdaf47980b", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "km", decimalPlaces: 2 },
    { id: "0194ee8c-5209-713f-97e1-75e58efb3613", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "ft", decimalPlaces: 0 },
    { id: "0194ee8c-5209-7a5f-86ed-b15a82cdacb4", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "yd", decimalPlaces: 0 },
    { id: "0194ee8c-5209-7f3d-9d2f-e30d97f3faa8", measurementId: "0194ee8c-5209-79c6-b749-e7184d2a4ed6", unit: "mi", decimalPlaces: 2 },
    { id: "0194ee8c-5209-7952-8ea8-145933247711", measurementId: "0194ee8c-5209-7037-be51-192205d4808d", unit: "kg", decimalPlaces: 1 },
    { id: "0194ee8c-5209-7e22-a8b8-05fb12b64bf0", measurementId: "0194ee8c-5209-7037-be51-192205d4808d", unit: "lb", decimalPlaces: 1 },
]

const defaultCategories = [
    { id: "019512aa-3c39-7c9c-b7e4-ade0ff92f94a", name: "Abs", colourId: "0194ee8c-5209-721e-8460-49b0ee60fb79" },
    { id: "019512aa-3c39-7277-940c-b3264f803e46", name: "Back", colourId: "0194ee8c-5209-78ed-a662-d07b63463d99" },
    { id: "019512aa-3c39-743d-9fb8-6898cbc8d962", name: "Biceps", colourId: "0194ee8c-5209-76d1-8eb9-115700a792a9" },
    { id: "019512aa-3c39-728e-bf44-82bca760822a", name: "Cardio", colourId: "0194ee8c-5209-7a1f-a857-1ab0a7bb2236" },
    { id: "019512aa-3c39-7cdd-aa15-669d22780896", name: "Chest", colourId: "0194ee8c-5209-7936-bfef-2278fa60683f" },
    { id: "019512aa-3c39-7a66-90ba-c8853c1aefb2", name: "Forearms", colourId: "0194ee8c-5209-7964-86c0-eacd8103b703" },
    { id: "019512aa-3c39-72b3-8b67-6c2e1e0c6ac9", name: "Legs", colourId: "0194ee8c-5209-7564-a709-bafb1fd1782e" },
    { id: "019512aa-3c39-796a-891f-bf49e3463168", name: "Shoulders", colourId: "0194ee8c-5209-7bfe-afc8-a85ca3bf8bae" },
    { id: "019512aa-3c39-76ca-85bf-807715b5851d", name: "Triceps", colourId: "0194ee8c-5209-7254-b29b-3e51a460cfdd" },
]

const defaultExercises = [
    {
        "categoryId": "019512aa-3c39-7c9c-b7e4-ade0ff92f94a",
        "id": "019512af-6a0f-754c-ad28-bdfeabb03060",
        "name": "Cable Crunch",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7c9c-b7e4-ade0ff92f94a",
        "id": "019512af-dbfe-799d-82bd-40ed9bb59ca2",
        "name": "Crunch",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7c9c-b7e4-ade0ff92f94a",
        "id": "019512b1-2677-7ecf-a36f-78bd24e8011d",
        "name": "Hanging Knee Raise",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7c9c-b7e4-ade0ff92f94a",
        "id": "019512b1-72a0-7cfa-8b66-5dccc48c1144",
        "name": "Hanging Leg Raise",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7c9c-b7e4-ade0ff92f94a",
        "id": "019512b1-c641-7aac-8c54-bef378a74003",
        "name": "Plank",
        "primaryMeasurementId": "0194ee8c-5209-726c-9236-cc92b9023700",
        "primaryMeasurementUnitId": null,
        "rest": null,
        "secondaryMeasurementId": null,
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7277-940c-b3264f803e46",
        "id": "019512be-26a8-743f-9a24-c86b2a9b8612",
        "name": "Barbell Row",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7277-940c-b3264f803e46",
        "id": "019512be-83df-7bc8-9e03-27d3ece33c80",
        "name": "Barbell Shrug",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7277-940c-b3264f803e46",
        "id": "019512be-e0d9-7d15-8679-746faf256f59",
        "name": "Chin Up",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7277-940c-b3264f803e46",
        "id": "019512bf-1263-72d1-9d12-08dfdcb2345d",
        "name": "Pull Ups",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7277-940c-b3264f803e46",
        "id": "019512bf-5775-7704-9a13-dfa6252158ba",
        "name": "Deadlift",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7277-940c-b3264f803e46",
        "id": "019512bf-93ad-7853-a4a8-1493ccd9ea0a",
        "name": "Dumbbell Row",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-743d-9fb8-6898cbc8d962",
        "id": "019512c0-2213-7d9c-a0a4-cddb56f156c4",
        "name": "Barbell Curl",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-743d-9fb8-6898cbc8d962",
        "id": "019512c0-6f9a-7dab-bb3d-e367b1d8c499",
        "name": "Dumbbell Curl",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-743d-9fb8-6898cbc8d962",
        "id": "019512c0-c411-78c8-9f58-e4739929bd12",
        "name": "Dumbbell Hammer Curl",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-728e-bf44-82bca760822a",
        "id": "019512c1-1303-7063-b8b6-f527b969f276",
        "name": "Boxing",
        "primaryMeasurementId": "0194ee8c-5209-726c-9236-cc92b9023700",
        "primaryMeasurementUnitId": null,
        "rest": null,
        "secondaryMeasurementId": null,
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-728e-bf44-82bca760822a",
        "id": "019512c1-4e31-71e2-9a8a-fb68af24d548",
        "name": "Cycling",
        "primaryMeasurementId": "0194ee8c-5209-726c-9236-cc92b9023700",
        "primaryMeasurementUnitId": null,
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-79c6-b749-e7184d2a4ed6",
        "secondaryMeasurementUnitId": "0194ee8c-5209-7559-8c67-f6cdaf47980b",
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-728e-bf44-82bca760822a",
        "id": "019512c1-c239-746e-b523-46101f198fad",
        "name": "Running (outdoor)",
        "primaryMeasurementId": "0194ee8c-5209-79c6-b749-e7184d2a4ed6",
        "primaryMeasurementUnitId": "0194ee8c-5209-7559-8c67-f6cdaf47980b",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-726c-9236-cc92b9023700",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-728e-bf44-82bca760822a",
        "id": "019512c2-0073-7653-8289-bcf092176a4f",
        "name": "Running (treadmill)",
        "primaryMeasurementId": "0194ee8c-5209-79c6-b749-e7184d2a4ed6",
        "primaryMeasurementUnitId": "0194ee8c-5209-7559-8c67-f6cdaf47980b",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-726c-9236-cc92b9023700",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-728e-bf44-82bca760822a",
        "id": "019512c2-4272-758c-a60f-fd07d69e0712",
        "name": "Stationary Bike",
        "primaryMeasurementId": "0194ee8c-5209-79c6-b749-e7184d2a4ed6",
        "primaryMeasurementUnitId": "0194ee8c-5209-7559-8c67-f6cdaf47980b",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-726c-9236-cc92b9023700",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7cdd-aa15-669d22780896",
        "id": "019512c3-5419-74f2-a878-9a407698e99c",
        "name": "Cable Crossovers",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7cdd-aa15-669d22780896",
        "id": "019512c3-be7c-71d1-8c5f-4d6e5751d5c6",
        "name": "Include Dumbbell Bench Press",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7cdd-aa15-669d22780896",
        "id": "019512c3-edcf-7014-96e1-379ef73dce3f",
        "name": "Dips",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7cdd-aa15-669d22780896",
        "id": "019512c4-35a9-70a7-a76d-661f7947de05",
        "name": "Bench Press",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7cdd-aa15-669d22780896",
        "id": "019512c5-9e7e-74d3-85bd-67da64cf99aa",
        "name": "Pushups",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7a66-90ba-c8853c1aefb2",
        "id": "019512c6-2b4e-7330-bc54-d9b815528c87",
        "name": "Dead Hang",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-726c-9236-cc92b9023700",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7a66-90ba-c8853c1aefb2",
        "id": "019512c6-6415-7264-865e-3007cc8888f4",
        "name": "Forearm Curl",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-7a66-90ba-c8853c1aefb2",
        "id": "019512c6-b44d-76fc-8a6f-c711fed81e38",
        "name": "Forearm Reverse Curl",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-72b3-8b67-6c2e1e0c6ac9",
        "id": "019512c7-03a7-78ac-8184-12d480291f49",
        "name": "Barbell Lunge",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-72b3-8b67-6c2e1e0c6ac9",
        "id": "019512c7-4282-7204-a75b-341f7860c304",
        "name": "Barbell Squat",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-72b3-8b67-6c2e1e0c6ac9",
        "id": "019512c7-b4db-75aa-bde1-2caa0fbba912",
        "name": "Calf Raise",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-72b3-8b67-6c2e1e0c6ac9",
        "id": "019512c8-1943-7670-b689-daaf4ecd9710",
        "name": "Front Squats",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-72b3-8b67-6c2e1e0c6ac9",
        "id": "019512c8-5141-7a58-91d5-66eda49b6283",
        "name": "Goblet Squat",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-796a-891f-bf49e3463168",
        "id": "019512c8-ce4f-7a09-b209-01f9423c12e9",
        "name": "Dumbbell Shoulder Press",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-796a-891f-bf49e3463168",
        "id": "019512c9-0d2c-7fb5-a5c4-5fe99da37a86",
        "name": "Cable Face Pull",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-796a-891f-bf49e3463168",
        "id": "019512c9-866b-799f-ab28-04c2d5fe816d",
        "name": "Barbell Overhead Press",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-796a-891f-bf49e3463168",
        "id": "019512ca-14a1-7b9d-9c82-d31785a942d6",
        "name": "Dumbbell Upright Row",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-796a-891f-bf49e3463168",
        "id": "019512ca-7617-76ab-8fa9-3da11f2656e8",
        "name": "Lateral Dumbbell Raise",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-76ca-85bf-807715b5851d",
        "id": "019512ca-d3d4-780f-9738-6f7d503b5fbc",
        "name": "Cable Pushdown",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-76ca-85bf-807715b5851d",
        "id": "019512cb-40a1-7d93-9c3a-1afd24227b55",
        "name": "Lying Triceps Extension",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    },
    {
        "categoryId": "019512aa-3c39-76ca-85bf-807715b5851d",
        "id": "019512cb-b231-7a31-bd03-fa732719855f",
        "name": "Close Grip Barbell Bench Press",
        "primaryMeasurementId": "0194ee8c-5209-7037-be51-192205d4808d",
        "primaryMeasurementUnitId": "0194ee8c-5209-7952-8ea8-145933247711",
        "rest": null,
        "secondaryMeasurementId": "0194ee8c-5209-751d-af6e-f6333c66576e",
        "secondaryMeasurementUnitId": null,
        "weightIncrement": null
    }
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
        .onConflictDoUpdate({
            target: [coloursTable.id],
            set: { hex: coloursTable.hex },
        });

    console.log("Populating measurements table with default data...");
    await db.insert(measurementsTable)
        .values(defaultMeasurements)
        .onConflictDoUpdate({
            target: [measurementsTable.id],
            set: { name: measurementsTable.name },
        });

    await db.insert(measurementUnitsTable)
        .values(defaultMeasurementUnits)
        .onConflictDoUpdate({
            target: [measurementUnitsTable.id],
            set: { measurementId: measurementUnitsTable.measurementId, unit: measurementUnitsTable.unit, decimalPlaces: measurementUnitsTable.decimalPlaces },
        });

    console.log("Populating categories table with default data...");
    await db.insert(categoriesTable)
        .values(defaultCategories)
        .onConflictDoUpdate({
            target: [categoriesTable.id],
            set: { name: categoriesTable.name },
        });


    console.log("Populating exercises table with default data...");
    await db.insert(exercisesTable)
        .values(defaultExercises)
        .onConflictDoUpdate({
            target: [exercisesTable.id],
            set: {
                name: exercisesTable.name,
                categoryId: exercisesTable.categoryId,
                primaryMeasurementId: exercisesTable.primaryMeasurementId,
                primaryMeasurementUnitId: exercisesTable.primaryMeasurementUnitId,
                secondaryMeasurementId: exercisesTable.secondaryMeasurementId,
                secondaryMeasurementUnitId: exercisesTable.secondaryMeasurementUnitId,
                weightIncrement: exercisesTable.weightIncrement,
                rest: exercisesTable.rest,
            },
        });

    console.log('exercises: ', await db.select().from(exercisesTable));

    console.log("Database initialisation complete...");
}
