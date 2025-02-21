import { WorkoutExerciseSet, WorkoutExerciseWithSets, WorkoutLogExerciseSet, WorkoutLogExerciseWithSets } from "../db/schema";

/**
 * Formats a workout set into a human-readable string.
 */
export function formatSet(set: WorkoutExerciseSet | WorkoutLogExerciseSet, exercise: WorkoutExerciseWithSets | WorkoutLogExerciseWithSets) {
    // Format primary value
    const primaryValue = formatSetValue(set.measurement1Value, exercise.primaryMeasurementName, exercise.primaryMeasurementUnitName);

    // Format secondary value
    let secondaryValue = null;
    if (set.measurement2Id) {
        secondaryValue = formatSetValue(set.measurement2Value, exercise.secondaryMeasurementName, exercise.secondaryMeasurementUnitName);
    }

    return secondaryValue ? `${primaryValue} x ${secondaryValue}` : primaryValue;
}

export function formatSetValue(value: string | null, measurement: string | null, unit: string | null) {
    let output = "--";
    if (value) {
        output = measurement === "Time"
            ? formatTimeString(value)
            : `${value} ${measurement === "Reps" ? "reps" : (unit || "")}`;
    } else {
        output += measurement === "Reps" ? " reps" : unit ? ` ${unit}` : "";
    }
    return output;
}

/**
 * Formats time stored in milliseconds to hh:mm:ss format.
 */
export function formatTimeString(value: string | null) {
    if (!value) return "--:--:--";
    const totalMilliseconds = parseInt(value, 10);
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/** Formats elapsed time into HH:MM:SS */
export function formatTimeNumber(timestamp: number | null): string {
    if (!timestamp) return "--:--";
    const elapsed = Math.floor((Date.now() - timestamp) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    return `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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