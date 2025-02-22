import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import { WorkoutLogExerciseSet, WorkoutLogExerciseWithSets } from "../../db/schema";
import ActiveWorkoutExerciseSet from "../ActiveWorkoutExerciseSet";

interface ActiveWorkoutExerciseCardProps {
    exercise: WorkoutLogExerciseWithSets;
    onSelect: (exercise: WorkoutLogExerciseWithSets) => void;
}

export default function ActiveWorkoutExerciseCard({ exercise, onSelect }: ActiveWorkoutExerciseCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onSelect(exercise)}>
            {/* Category Colour Indicator */}
            <View style={[styles.colourEdge, { backgroundColor: exercise.categoryColour }]} />

            {/* Exercise Name */}
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>

                {/* List of Sets */}
                <FlatList
                    data={exercise.sets}
                    keyExtractor={(set: WorkoutLogExerciseSet) => set.id}
                    renderItem={({ item }) => (
                        <ActiveWorkoutExerciseSet set={item} exercise={{
                            primaryMeasurementName: exercise.primaryMeasurementName,
                            primaryMeasurementUnitName: exercise.primaryMeasurementUnitName,
                            primaryMeasurementUnitDecimalPlaces: exercise.primaryMeasurementUnitDecimalPlaces,
                            secondaryMeasurementName: exercise.secondaryMeasurementName,
                            secondaryMeasurementUnitName: exercise.secondaryMeasurementUnitName,
                            secondaryMeasurementUnitDecimalPlaces: exercise.secondaryMeasurementUnitDecimalPlaces
                        }} />
                    )}
                    style={{ flex: 1 }}
                />

            </View>
        </TouchableOpacity>
    );
}

// **Styles**
const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.cards.borderRadius,
        marginVertical: theme.spacing.small,
        marginHorizontal: theme.spacing.medium,
        padding: theme.spacing.medium,
        elevation: 2,
    },
    colourEdge: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 10,
        borderTopLeftRadius: theme.cards.borderRadius,
        borderBottomLeftRadius: theme.cards.borderRadius,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
    },
    setText: {
        fontSize: 14,
        color: theme.colors.mutedText,
    },
});
