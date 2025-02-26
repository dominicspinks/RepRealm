import { alias, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { UUIDv7Schema } from "../utilities/commonValidators";
import { sql } from "drizzle-orm";

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
    measurementId: text("measurement_id").notNull().references(() => measurementsTable.id, { onDelete: "no action" }),
    unit: text("unit").notNull(),
    decimalPlaces: integer("decimal_places").notNull().default(0),
});

// **Categories Table**
export const categoriesTable = sqliteTable("categories", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    name: text("name").notNull(),
    colourId: text("colour_id").notNull().references(() => coloursTable.id, { onDelete: "no action" }),
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: 'timestamp' }),
});

// **Exercises Table**
export const exercisesTable = sqliteTable("exercises", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    categoryId: text("category_id").notNull().references(() => categoriesTable.id, { onDelete: "no action" }),
    name: text().notNull(),
    rest: integer("rest"),
    weightIncrement: integer("weight_increment"),
    primaryMeasurementId: text("primary_measurement_id").notNull().references(() => measurementsTable.id, { onDelete: "no action" }),
    primaryMeasurementUnitId: text("primary_measurement_unit_id").references(() => measurementUnitsTable.id),
    secondaryMeasurementId: text("secondary_measurement_id").references(() => measurementsTable.id, { onDelete: "set null" }),
    secondaryMeasurementUnitId: text("secondary_measurement_unit_id").references(() => measurementUnitsTable.id),
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: 'timestamp' }),
});

// **Routines Table**
export const routinesTable = sqliteTable("routines", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: 'timestamp' }),
});

// **Routine Workouts Table**
export const routineWorkoutsTable = sqliteTable("routine_workouts", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    routineId: text("routine_id").notNull().references(() => routinesTable.id, { onDelete: "cascade" }),
    workoutId: text("workout_id").notNull().references(() => workoutsTable.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
}, (table) => [
    unique("unique_routine_workout").on(table.routineId, table.workoutId)
]);

// **Workouts Table**
export const workoutsTable = sqliteTable("workouts", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: 'timestamp' }),
});

// **Workout Exercises Table**
export const workoutExercisesTable = sqliteTable("workout_exercises", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    workoutId: text("workout_id").notNull().references(() => workoutsTable.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id").notNull().references(() => exercisesTable.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

// **Workout Exercise Sets Table**
export const workoutExerciseSetsTable = sqliteTable("workout_exercise_sets", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    workoutExerciseId: text("workout_exercise_id").notNull().references(() => workoutExercisesTable.id, { onDelete: "cascade" }),
    measurement1Id: text("measurement_1_id").notNull().references(() => measurementsTable.id, { onDelete: "no action" }),
    measurement1Value: integer("measurement_1_value"),
    measurement2Id: text("measurement_2_id").references(() => measurementsTable.id, { onDelete: "set null" }),
    measurement2Value: integer("measurement_2_value"),
});

// **Workout Logs Table**
export const workoutLogsTable = sqliteTable("workout_logs", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    workoutId: text("workout_id").references(() => workoutsTable.id, { onDelete: "set null" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    startedAt: integer("started_at", { mode: "timestamp" }),
    stoppedAt: integer("stopped_at", { mode: "timestamp" }),
});

// **Workout Log Exercises Table**
export const workoutLogExercisesTable = sqliteTable("workout_log_exercises", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    workoutLogId: text("workout_log_id").notNull().references(() => workoutLogsTable.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id").notNull().references(() => exercisesTable.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
});

// **Workout Log Exercise Sets Table**
export const workoutLogExerciseSetsTable = sqliteTable("workout_log_exercise_sets", {
    id: text("id").primaryKey().$default(() => UUIDv7Schema.parse(undefined)),
    workoutLogExerciseId: text("workout_log_exercise_id").notNull().references(() => workoutLogExercisesTable.id, { onDelete: "cascade" }),
    measurement1Id: text("measurement_1_type_id").notNull().references(() => measurementsTable.id, { onDelete: "no action" }),
    measurement1Value: integer("measurement_1_value"),
    measurement2Id: text("measurement_2_type_id").references(() => measurementsTable.id, { onDelete: "set null" }),
    measurement2Value: integer("measurement_2_value"),
    isComplete: integer("is_complete", { mode: "boolean" }).default(false),
    completedAt: integer("completed_at", { mode: "timestamp" }),
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

export const WorkoutLogSelectSchema = createSelectSchema(workoutLogsTable);
export const WorkoutLogInsertSchema = createInsertSchema(workoutLogsTable);

export const WorkoutLogExerciseSelectSchema = createSelectSchema(workoutLogExercisesTable);
export const WorkoutLogExerciseInsertSchema = createInsertSchema(workoutLogExercisesTable);

export const WorkoutLogExerciseSetSelectSchema = createSelectSchema(workoutLogExerciseSetsTable);
export const WorkoutLogExerciseSetInsertSchema = createInsertSchema(workoutLogExerciseSetsTable);

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
export type ExerciseFull = Exercise & {
    primaryMeasurementName: string;
    primaryMeasurementUnitName: string | null;
    primaryMeasurementUnitDecimalPlaces: number | null;
    secondaryMeasurementName: string | null;
    secondaryMeasurementUnitName: string | null;
    secondaryMeasurementUnitDecimalPlaces: number | null;
    categoryName: string;
    categoryColour: string;
};
export type ExerciseWithCategory = Exercise & { category: Category };
export type NewExercise = typeof exercisesTable.$inferInsert;

export type Routine = typeof routinesTable.$inferSelect;
export type RoutineWithWorkouts = Routine & { workouts: RoutineWorkout[] };
export type RoutineWithFullWorkouts = Routine & { workouts: RoutineWorkoutWithWorkout[] };
export type NewRoutine = typeof routinesTable.$inferInsert;

export type RoutineWorkout = typeof routineWorkoutsTable.$inferSelect;
export type RoutineWorkoutWithWorkout = RoutineWorkout & { workout: WorkoutWithExercises };
export type NewRoutineWorkout = typeof routineWorkoutsTable.$inferInsert;

export type Workout = typeof workoutsTable.$inferSelect;
export type WorkoutWithExercises = Workout & { exercises: WorkoutExerciseWithSets[] };
export type NewWorkout = typeof workoutsTable.$inferInsert;

export type WorkoutExercise = typeof workoutExercisesTable.$inferSelect;
export type WorkoutExerciseWithSets = WorkoutExercise & Omit<ExerciseFull, "id" | "createdAt" | "updatedAt" | "isDeleted"> & { sets?: WorkoutExerciseSet[] };
export type NewWorkoutExercise = typeof workoutExercisesTable.$inferInsert;
export type NewWorkoutExerciseWithSets = NewWorkoutExercise & { sets: NewWorkoutExerciseSet[] };

export type WorkoutExerciseSet = typeof workoutExerciseSetsTable.$inferSelect;
export type NewWorkoutExerciseSet = typeof workoutExerciseSetsTable.$inferInsert;

export type WorkoutLog = typeof workoutLogsTable.$inferSelect;
export type WorkoutLogWithExercises = WorkoutLog & { exercises: WorkoutLogExerciseWithSets[] };
export type NewWorkoutLog = typeof workoutLogsTable.$inferInsert;

export type WorkoutLogExercise = typeof workoutLogExercisesTable.$inferSelect;
export type WorkoutLogExerciseFull = WorkoutLogExercise & Omit<ExerciseFull, "id" | "createdAt" | "updatedAt" | "isDeleted">;
export type WorkoutLogExerciseWithSets = WorkoutLogExerciseFull & { sets?: WorkoutLogExerciseSet[] };
export type NewWorkoutLogExercise = typeof workoutLogExercisesTable.$inferInsert;

export type WorkoutLogExerciseSet = typeof workoutLogExerciseSetsTable.$inferSelect;
export type NewWorkoutLogExerciseSet = typeof workoutLogExerciseSetsTable.$inferInsert;

// **Aliases**
export const primaryMeasurementAlias = alias(measurementsTable, "primary_measurement");
export const primaryUnitAlias = alias(measurementUnitsTable, "primary_unit");
export const secondaryMeasurementAlias = alias(measurementsTable, "secondary_measurement");
export const secondaryUnitAlias = alias(measurementUnitsTable, "secondary_unit");