import { WorkoutExerciseSet, WorkoutExerciseWithSets, WorkoutLogExerciseSet, WorkoutLogExerciseWithSets } from "../db/schema";

/**
 * Formats a workout set into a human-readable string.
 */
export function formatSet(set: WorkoutExerciseSet | WorkoutLogExerciseSet, exercise: WorkoutExerciseWithSets | WorkoutLogExerciseWithSets) {
    // Format primary value
    const primaryValue = formatSetValue(set.measurement1Value, exercise.primaryMeasurementName, exercise.primaryMeasurementUnitName, exercise.primaryMeasurementUnitDecimalPlaces);

    // Format secondary value
    let secondaryValue = null;
    if (set.measurement2Id) {
        secondaryValue = formatSetValue(set.measurement2Value, exercise.secondaryMeasurementName, exercise.secondaryMeasurementUnitName, exercise.secondaryMeasurementUnitDecimalPlaces);
    }

    return secondaryValue ? `${primaryValue} x ${secondaryValue}` : primaryValue;
}

export function formatSetValue(value: number | null, measurement: string | null, unit: string | null, decimalPlaces: number | null) {
    let output = "--";
    if (value !== null) {
        output = measurement === "Time"
            ? formatTime(value)
            : `${scaleMeasurementReal(value, decimalPlaces).toFixed(decimalPlaces ?? 0)} ${measurement === "Reps" ? "reps" : (unit || "")}`;
    } else {
        output += measurement === "Reps" ? " reps" : unit ? ` ${unit}` : "";
    }
    return output;
}

/**
 * Converts a measurement value to its actual value
 * Used for reading a measurement from the database
 * @param value Number to be converted from integer to actual value
 * @param decimalPlaces
 */
export function scaleMeasurementReal(value: number, decimalPlaces: number | null): number {
    if (decimalPlaces === null) return value;
    const scaleFactor = Math.pow(10, decimalPlaces);
    const output = Math.round((value / scaleFactor) * 1000) / 1000;
    return output;
}


/**
 * Converts a measurement value to an integer
 * Used for writing a measurement to the database
 * @param value Number to be converted from actual value to integer
 * @param decimalPlaces
 */
export function scaleMeasurementInt(value: number, decimalPlaces: number | null): number {
    if (decimalPlaces === null) return Math.round(value);
    const scaleFactor = Math.pow(10, decimalPlaces);
    return Math.round(value * scaleFactor);
}

/**
 * Formats time into HH:MM:SS
 * @param milliseconds - Length of time in milliseconds
 */
export function formatTime(milliseconds: number | null): string {
    if (!milliseconds) return "--:--";

    const elapsed = Math.floor(milliseconds / 1000); // Convert ms to seconds
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    return `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Format duration into HH:MM:SS
 * @param timestamp - Timestamp in milliseconds
 * @returns the time elapsed between now and the timestamp, in HH:MM:SS
 */
export function formatElapsedTime(timestamp: number | null): string {
    if (!timestamp) return "--:--";
    return formatTime(Date.now() - timestamp);
}

/**
 * Formats a date to a human-readable string.
 * Uses the format: Monday, 21st Jan 2023
 */
export function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};