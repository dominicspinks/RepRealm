import { StyleSheet, Text, View } from "react-native";
import { ExerciseFull, WorkoutLogExerciseSet } from "../db/schema";
import { formatSetValue } from "../utilities/formatHelpers";

interface ActiveWorkoutExerciseProps {
    set: WorkoutLogExerciseSet;
    exercise: {
        primaryMeasurementName: string;
        primaryMeasurementUnitName: string | null;
        primaryMeasurementUnitDecimalPlaces: number | null;
        secondaryMeasurementName: string | null;
        secondaryMeasurementUnitName: string | null;
        secondaryMeasurementUnitDecimalPlaces: number | null;
    };
}

export default function ActiveWorkoutExercise({ set, exercise }: ActiveWorkoutExerciseProps) {
    return (
        <View style={styles.row}>
            <View style={{ flex: 1 }} />
            <Text>{formatSetValue(set.measurement1Value, exercise.primaryMeasurementName, exercise.primaryMeasurementUnitName, exercise.primaryMeasurementUnitDecimalPlaces)}</Text>
            <Text>{set.measurement2Id && formatSetValue(set.measurement2Value, exercise.secondaryMeasurementName, exercise.secondaryMeasurementUnitName, exercise.secondaryMeasurementUnitDecimalPlaces)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
    }
})