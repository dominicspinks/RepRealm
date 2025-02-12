import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { UUIDv7Schema } from "../validators/commonValidators";

// **Colours Table**
export const coloursTable = sqliteTable("colours", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    hex: text("hex").notNull(),
});

// **Measurements Table**
export const measurementsTable = sqliteTable("measurements", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    name: text("name").notNull(),
});

// **Measurement Units Table**
export const measurementUnitsTable = sqliteTable("measurement_units", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    measurementId: text("measurement_id").notNull().references(() => measurementsTable.id),
    unit: text("unit").notNull(),
});

// **Categories Table**
export const categoriesTable = sqliteTable("categories", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    name: text("name").notNull(),
    colourId: text("colour_id").notNull().references(() => coloursTable.id),
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }),
});

// **Exercises Table**
export const exercisesTable = sqliteTable("exercises", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    categoryId: text("category_id").notNull().references(() => categoriesTable.id),
    name: text().notNull(),
    rest: integer("rest"),
    weightIncrement: integer("weight_increment"),
    primaryMeasurementId: text("primary_measurement_id").notNull().references(() => measurementsTable.id),
    primaryMeasurementUnitId: text("primary_measurement_unit_id").references(() => measurementUnitsTable.id),
    secondaryMeasurementId: text("secondary_measurement_id").references(() => measurementsTable.id),
    secondaryMeasurementUnitId: text("secondary_measurement_unit_id").references(() => measurementUnitsTable.id),
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }),
});

// **Routines Table**
export const routinesTable = sqliteTable("routines", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }),
});

// **Routine Workouts Table**
export const routineWorkoutsTable = sqliteTable("routine_workouts", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    routineId: text("routine_id").notNull().references(() => routinesTable.id),
    workoutId: text("workout_id").notNull().references(() => workoutsTable.id),
    order: integer("order").notNull(),
});

// **Workouts Table**
export const workoutsTable = sqliteTable("workouts", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }),
});

// **Workout Exercises Table**
export const workoutExercisesTable = sqliteTable("workout_exercises", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    workoutId: text("workout_id").notNull().references(() => workoutsTable.id),
    exerciseId: text("exercise_id").notNull().references(() => exercisesTable.id),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(new Date()),
});

export const workoutExerciseSetsTable = sqliteTable("workout_exercise_sets", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    workoutExerciseId: text("workout_exercise_id").notNull().references(() => workoutExercisesTable.id),
    reps: integer("reps").notNull(),
    measurement1Id: text("measurement_1_id").notNull().references(() => measurementsTable.id),
    measurement1Value: text("measurement_1_value"),
    measurement2Id: text("measurement_2_id").references(() => measurementsTable.id),
    measurement2Value: text("measurement_2_value"),
});


// **Auto-generate Zod validation schemas**
export const ColourSelectSchema = createSelectSchema(coloursTable);
export const ColourInsertSchema = createInsertSchema(coloursTable);

export const MeasurementSelectSchema = createSelectSchema(measurementsTable);
export const MeasurementInsertSchema = createInsertSchema(measurementsTable);

export const MeasurementUnitSelectSchema = createSelectSchema(measurementUnitsTable);
export const MeasurementUnitInsertSchema = createInsertSchema(measurementUnitsTable);

export const CategorySelectSchema = createSelectSchema(categoriesTable);
export const CategoryInsertSchema = createInsertSchema(categoriesTable);

export const ExerciseSelectSchema = createSelectSchema(exercisesTable);
export const ExerciseInsertSchema = createInsertSchema(exercisesTable);

export const RoutineSelectSchema = createSelectSchema(routinesTable);
export const RoutineInsertSchema = createInsertSchema(routinesTable);

export const RoutineWorkoutSelectSchema = createSelectSchema(routineWorkoutsTable);
export const RoutineWorkoutInsertSchema = createInsertSchema(routineWorkoutsTable);

export const WorkoutSelectSchema = createSelectSchema(workoutsTable);
export const WorkoutInsertSchema = createInsertSchema(workoutsTable);

export const WorkoutExerciseSelectSchema = createSelectSchema(workoutExercisesTable);
export const WorkoutExerciseInsertSchema = createInsertSchema(workoutExercisesTable);

export const WorkoutExerciseSetSelectSchema = createSelectSchema(workoutExerciseSetsTable);
export const WorkoutExerciseSetInsertSchema = createInsertSchema(workoutExerciseSetsTable);


// **Infer TypeScript types**
export type Colour = typeof coloursTable.$inferSelect;
export type NewColour = typeof coloursTable.$inferInsert;

export type Measurement = typeof measurementsTable.$inferSelect;
export type NewMeasurement = typeof measurementsTable.$inferInsert;

export type MeasurementUnit = typeof measurementUnitsTable.$inferSelect;
export type NewMeasurementUnit = typeof measurementUnitsTable.$inferInsert;

export type Category = typeof categoriesTable.$inferSelect;
export type CategoryWithColour = Category & { colourHex: string };
export type NewCategory = typeof categoriesTable.$inferInsert;

export type Exercise = typeof exercisesTable.$inferSelect;
export type ExerciseFull = typeof exercisesTable.$inferSelect & { primaryMeasurementName: string; primaryMeasurementUnitName: string | null; secondaryMeasurementName: string | null; secondaryMeasurementUnitName: string | null; categoryName: string; categoryColour: string; };
export type ExerciseWithCategory = Exercise & { category: Category };
export type NewExercise = typeof exercisesTable.$inferInsert;

export type Routine = typeof routinesTable.$inferSelect;
export type NewRoutine = typeof routinesTable.$inferInsert;

export type RoutineWorkout = typeof routineWorkoutsTable.$inferSelect;
export type NewRoutineWorkout = typeof routineWorkoutsTable.$inferInsert;

export type Workout = typeof workoutsTable.$inferSelect;
export type NewWorkout = typeof workoutsTable.$inferInsert;

export type WorkoutExercise = typeof workoutExercisesTable.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercisesTable.$inferInsert;

export type WorkoutExerciseSet = typeof workoutExerciseSetsTable.$inferSelect;
export type NewWorkoutExerciseSet = typeof workoutExerciseSetsTable.$inferInsert;