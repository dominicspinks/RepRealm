import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../theme";
import { WorkoutWithExercises } from "../../db/schema";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import ExerciseWithSets from "../ExerciseWithSets";

interface WorkoutCardProps {
    workout: WorkoutWithExercises;
    onEdit: (workoutId: string) => void;
    onDelete: (workoutId: string) => void;
}

export default function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
    const [expanded, setExpanded] = useState(false);

    function toggleExpand() {
        setExpanded(prev => !prev);
    }

    return (
        <View style={styles.card}>
            {/* Workout Header */}
            <TouchableOpacity style={styles.headerContainer} onPress={toggleExpand}>
                <View style={styles.header}>
                    <Text style={styles.workoutName}>{workout.name}</Text>

                    {/* Categories (Collapsed State) */}

                    <View style={styles.categoryContainer}>
                        {[...new Map(workout.exercises.map(exercise => [exercise.categoryId, {
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

                {/* Expand/Collapse Icon */}
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Expanded View: Exercises */}
            {expanded && (
                <View style={styles.exerciseContainer}>
                    {workout.exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.exerciseCard}>
                            {/* Category Colour Bar */}
                            <View style={[styles.categoryBar, { backgroundColor: exercise.categoryColour }]} />

                            <ExerciseWithSets
                                exercise={exercise}
                            />
                        </View>
                    ))}
                </View>
            )}

            {/* Action Buttons */}
            {expanded && (
                <View style={styles.buttonRow}>
                    <EditIcon action={() => onEdit(workout.id)} />
                    <DeleteIcon action={() => onDelete(workout.id)} />
                </View>
            )}
        </View>
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
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
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
