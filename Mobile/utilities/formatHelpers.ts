import { WorkoutExerciseSet, WorkoutExerciseWithSets } from "../db/schema";

/**
 * Formats a workout set into a human-readable string.
 */
export function formatSet(set: WorkoutExerciseSet, exercise: WorkoutExerciseWithSets) {
    // Format primary value
    let primaryValue = "--";
    if (set.measurement1Value) {
        primaryValue =
            exercise.primaryMeasurementName === "Time"
                ? formatTime(set.measurement1Value)
                : `${set.measurement1Value} ${exercise.primaryMeasurementName === "Reps" ? "reps" : exercise.primaryMeasurementUnitName || ""}`;
    } else {
        primaryValue += exercise.primaryMeasurementName === "Reps" ? " reps" : exercise.primaryMeasurementUnitName ? ` ${exercise.primaryMeasurementUnitName}` : "";
    }

    // Format secondary value
    let secondaryValue = null;
    if (set.measurement2Value) {
        secondaryValue =
            exercise.secondaryMeasurementName === "Time"
                ? formatTime(set.measurement2Value)
                : `${set.measurement2Value} ${exercise.secondaryMeasurementName === "Reps" ? "reps" : exercise.secondaryMeasurementUnitName || ""}`;
    }

    return secondaryValue ? `${primaryValue} x ${secondaryValue}` : primaryValue;
}

/**
 * Formats time stored in milliseconds to hh:mm:ss format.
 */
export function formatTime(value: string | null) {
    if (!value) return "--:--:--";
    const totalMilliseconds = parseInt(value, 10);
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
