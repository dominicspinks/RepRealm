import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme";
import { WorkoutLogWithExercises } from "../../db/schema";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import { formatDate } from "../../utilities/formatHelpers";
import WorkoutLogExercise from "../WorkoutLogExercise";

interface WorkoutLogCardProps {
    workoutLog: WorkoutLogWithExercises;
    onEdit: (workoutId: string) => void;
    onDelete: (workoutId: string) => void;
}

export default function WorkoutLogCard({
    workoutLog,
    onEdit,
    onDelete,
}: WorkoutLogCardProps) {
    const [expanded, setExpanded] = useState(false);

    function handlePress() {
        setExpanded(prev => !prev);
    }

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}>
            {/* Workout Header */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Text style={styles.workoutName}>{
                        workoutLog?.startedAt
                            ? formatDate(workoutLog.startedAt)
                            : workoutLog?.createdAt
                                ? formatDate(workoutLog.createdAt)
                                : ""
                    }</Text>

                    {/* Categories (Collapsed State) */}
                    <View style={styles.categoryContainer}>
                        {[...new Map(workoutLog.exercises.map(exercise => [exercise.categoryId, {
                            id: exercise.categoryId,
                            name: exercise.categoryName,
                            colour: exercise.categoryColour
                        }])).values()].map((category) => (
                            <View key={category.id} style={[styles.categoryBadge, { backgroundColor: category.colour }]}>
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Expand/Collapse Icon (Hidden if collapsible is false) */}
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color={theme.colors.text} />
            </View>

            {/* Expanded View: Exercises */}
            {expanded && (
                <View style={styles.exerciseContainer}>
                    {workoutLog.exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.exerciseCard}>
                            {/* Category Colour Bar */}
                            <View style={[styles.categoryBar, { backgroundColor: exercise.categoryColour }]} />

                            <WorkoutLogExercise exercise={exercise} />
                        </View>
                    ))}
                </View>
            )}

            {/* Action Buttons (Visible only when expanded) */}
            {expanded && (
                <View style={styles.buttonRow}>
                    <EditIcon action={() => onEdit(workoutLog.id)} />
                    <DeleteIcon action={() => onDelete(workoutLog.id)} />
                </View>
            )}
        </TouchableOpacity>
    );
}



// **Styles**
const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 15,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: "90%",
        alignSelf: "center",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        flex: 1
    },
    workoutName: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 10,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        height: 24,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    categoryText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
    exerciseContainer: {
        marginTop: 10,
    },
    exerciseCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: theme.spacing.small,
    },
    categoryBar: {
        width: 5,
        height: "100%",
        marginRight: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 15,
        marginTop: 10,
    },
});
