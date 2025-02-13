import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import { WorkoutExerciseSet, WorkoutExerciseWithSets } from "../../db/schema";

interface WorkoutExerciseCardProps {
    item: WorkoutExerciseWithSets;
    onEdit: (exercise: WorkoutExerciseWithSets) => void;
    onDelete: (exercise: WorkoutExerciseWithSets) => void;
}

export default function WorkoutExerciseCard({ item, onEdit, onDelete }: WorkoutExerciseCardProps) {
    function formatSet(set: WorkoutExerciseSet, exercise: WorkoutExerciseWithSets) {
        // Handle Time formatting separately
        if (exercise.primaryMeasurementName === "Time") {
            const timeValue = formatTime(set.measurement1Value);
            const secondaryValue = set.measurement2Value ? `${set.measurement2Value} ${exercise.secondaryMeasurementName === "Reps" ? "reps" : exercise.secondaryMeasurementUnitName || ""}` : null;
            return secondaryValue ? `${timeValue} x ${secondaryValue}` : timeValue;
        }

        // Check for Reps (since it doesn't have a unit)
        const primaryUnit = exercise.primaryMeasurementName === "Reps" ? "reps" : exercise.primaryMeasurementUnitName || "";
        const secondaryUnit = exercise.secondaryMeasurementName === "Reps" ? "reps" : exercise.secondaryMeasurementUnitName || "";

        // General formatting for primary & secondary values
        const primaryValue = set.measurement1Value ? `${set.measurement1Value} ${primaryUnit}` : `-- ${primaryUnit}`;
        const secondaryValue = set.measurement2Value ? `${set.measurement2Value} ${secondaryUnit}` : null;

        return secondaryValue ? `${primaryValue} x ${secondaryValue}` : primaryValue;
    }

    function formatTime(value: string | null) {
        if (!value) return "--:--:--";
        const totalMilliseconds = parseInt(value, 10);
        const hours = Math.floor(totalMilliseconds / 3600000);
        const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
        const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return (
        <View style={styles.card}>
            {/* Category Colour Indicator */}
            <View style={[styles.colourEdge, { backgroundColor: item.categoryColour }]} />

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flexDirection: "column" }}>
                    {/* Exercise Name */}
                    <Text style={styles.exerciseName}>{item.name}</Text>

                    {/* List of Sets */}
                    <View style={styles.setsContainer}>
                        {item.sets?.map((set, index) => (
                            <Text key={index} style={styles.setText}>
                                {formatSet(set, item)}
                            </Text>
                        ))}
                    </View>
                </View>

                <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                    {/* Delete Button (Top Right) */}
                    <DeleteIcon action={() => onDelete(item)} />

                    {/* Spacer to push edit icon to bottom */}
                    <View style={{ flex: 1 }} />

                    {/* Edit Button (Bottom Right) */}
                    <EditIcon action={() => onEdit(item)} />
                </View>
            </View>
        </View>
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
    setsContainer: {
        flexDirection: "column",
    },
    setText: {
        fontSize: 14,
        color: theme.colors.mutedText,
    },
    deleteButton: {
        position: "absolute",
        top: theme.spacing.small,
        right: theme.spacing.small,
    },
    editButton: {
        position: "absolute",
        bottom: theme.spacing.small,
        right: theme.spacing.small,
    },
});
