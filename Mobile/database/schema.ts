import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'colours',
            columns: [
                { name: 'hex', type: 'string' },
            ],
        }),
        tableSchema({
            name: 'measurements',
            columns: [
                { name: 'name', type: 'string' },
            ],
        }),
        tableSchema({
            name: 'measurement_units',
            columns: [
                { name: 'measurement_id', type: 'string', isIndexed: true },
                { name: 'unit', type: 'string' },
            ],
        }),
        tableSchema({
            name: 'categories',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'colour_id', type: 'string', isIndexed: true },
                { name: 'is_deleted', type: 'boolean', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'exercises',
            columns: [
                { name: 'category_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' },
                { name: 'rest', type: 'number', isOptional: true },
                { name: 'weight_increment', type: 'number', isOptional: true },
                { name: 'is_deleted', type: 'boolean', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'exercise_measurements',
            columns: [
                { name: 'exercise_id', type: 'string', isIndexed: true },
                { name: 'measurement_id', type: 'string', isIndexed: true },
                { name: 'is_primary', type: 'boolean', isOptional: true },
                { name: 'units', type: 'string', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'routines',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'routine_workouts',
            columns: [
                { name: 'routine_id', type: 'string', isIndexed: true },
                { name: 'workout_id', type: 'string', isIndexed: true },
                { name: 'order', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'workouts',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'workout_exercises',
            columns: [
                { name: 'workout_id', type: 'string', isIndexed: true },
                { name: 'exercise_id', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'workout_exercise_sets',
            columns: [
                { name: 'workout_exercise_id', type: 'string', isIndexed: true },
                { name: 'reps', type: 'number' },
                { name: 'measurement_1_id', type: 'string', isIndexed: true },
                { name: 'measurement_1_value', type: 'string', isOptional: true },
                { name: 'measurement_2_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'measurement_2_value', type: 'string', isOptional: true },
            ]
        }),
        tableSchema({
            name: 'workout_log_exercises',
            columns: [
                { name: 'workout_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'duration', type: 'number', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'workout_log_exercises',
            columns: [
                { name: 'workout_log_id', type: 'string', isIndexed: true },
                { name: 'exercise_id', type: 'string', isIndexed: true },
                { name: 'order', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'workout_log_exercise_sets',
            columns: [
                { name: 'workout_log_exercise_id', type: 'string', isIndexed: true },
                { name: 'order', type: 'number' },
                { name: 'measurement_1_id', type: 'string', isIndexed: true },
                { name: 'measurement_1_value', type: 'string', isOptional: true },
                { name: 'measurement_2_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'measurement_2_value', type: 'string', isOptional: true },
                { name: 'is_complete', type: 'boolean' }
            ]
        })
    ],
});
