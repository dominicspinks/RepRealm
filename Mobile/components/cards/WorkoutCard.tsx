import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme, ThemeColors } from "../../theme";
import { WorkoutWithExercises } from "../../db/schema";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import ExerciseWithSets from "../ExerciseWithSets";
import { useColourTheme } from "../../contexts/ThemeContext";

interface WorkoutCardProps {
    workout: WorkoutWithExercises;
    onEdit?: (workoutId: string) => void; // Action when edit button is pressed, editable prop must be true
    onDelete?: (workoutId: string) => void; // Action when delete button is pressed, deletable prop must be true
    onSelect?: (workoutId: string) => void; // Action when card is selected, selectable prop must be true
    collapsible?: boolean;
    selectable?: boolean;
    editable?: boolean;
    deletable?: boolean;
    variant?: "default" | "embedded";
}

export default function WorkoutCard({
    workout,
    onEdit = () => { },
    onDelete = () => { },
    onSelect = () => { },
    collapsible = true,
    selectable = false,
    editable = true,
    deletable = true,
    variant = "default"
}: WorkoutCardProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);
    const [expanded, setExpanded] = useState(!collapsible);

    function handlePress() {
        if (selectable) {
            onSelect(workout.id);
        } else if (collapsible) {
            setExpanded(prev => !prev);
        }
    }

    return (
        <TouchableOpacity
            style={[styles.card, variant === "embedded" && styles.modalCard]}
            onPress={handlePress}
            activeOpacity={selectable ? 0.7 : 1}>
            {/* Workout Header */}
            <View style={styles.headerContainer}>
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

                {/* Expand/Collapse Icon (Hidden if collapsible is false) */}
                {collapsible && (
                    <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color={colors.text} />
                )}
            </View>

            {/* Expanded View: Exercises */}
            {expanded && (
                <View style={styles.exerciseContainer}>
                    {workout.exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.exerciseCard}>
                            {/* Category Colour Bar */}
                            <View style={[styles.categoryBar, { backgroundColor: exercise.categoryColour }]} />

                            <ExerciseWithSets exercise={exercise} />
                        </View>
                    ))}
                </View>
            )}

            {/* Action Buttons (Visible only when expanded) */}
            {expanded && (
                <View style={styles.buttonRow}>
                    {editable &&
                        <EditIcon action={() => onEdit(workout.id)} />}
                    {deletable &&
                        <DeleteIcon action={() => onDelete(workout.id)} />}
                </View>
            )}
        </TouchableOpacity>
    );
}



// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
    modalCard: {
        width: "100%",
        marginHorizontal: 0,
        borderRadius: 0,
        elevation: 0,
        shadowOpacity: 0,
        marginVertical: 0,
        paddingBottom: 0,
        borderBottomColor: colors.borderStrong,
        borderBottomWidth: 1
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
        color: colors.text,
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
