import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, ThemeColors } from "../../theme";
import { WorkoutLogWithExercises } from "../../db/schema";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import { formatDate } from "../../utilities/formatHelpers";
import WorkoutLogExercise from "../WorkoutLogExercise";
import { useColourTheme } from "../../contexts/ThemeContext";
import CategoryBubble from "../CategoryBubble";
import CategoryBubbleList from "../CategoryBubbleList";

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
    const { colors } = useColourTheme();
    const styles = createStyles(colors);
    const [expanded, setExpanded] = useState(false);

    function handlePress() {
        setExpanded(prev => !prev);
    }

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <View style={styles.dateDurationRow}>
                        <Text style={styles.workoutName}>
                            {workoutLog?.startedAt
                                ? formatDate(workoutLog.startedAt)
                                : workoutLog?.createdAt
                                    ? formatDate(workoutLog.createdAt)
                                    : ""}
                        </Text>

                        {workoutLog?.startedAt && workoutLog?.stoppedAt && (
                            <Text style={styles.workoutDuration}>
                                {Math.round((Number(workoutLog.stoppedAt) - Number(workoutLog.startedAt)) / 60000)} min
                            </Text>
                        )}
                    </View>

                    <CategoryBubbleList categories={[...new Map(workoutLog.exercises.map(exercise => [exercise.categoryId, {
                        id: exercise.categoryId,
                        name: exercise.categoryName,
                        colour: exercise.categoryColour
                    }])).values()]} />
                </View>

                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color={colors.text.primary} />
            </View>

            {expanded && (
                <View style={styles.exerciseContainer}>
                    {workoutLog.exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.exerciseCard}>
                            <View style={[styles.categoryBar, { backgroundColor: exercise.categoryColour }]} />

                            <WorkoutLogExercise exercise={exercise} />
                        </View>
                    ))}
                </View>
            )}

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
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    card: {
        backgroundColor: colors.background.card,
        padding: 15,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 3,
        shadowColor: colors.cardShadow,
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
    dateDurationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    workoutName: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text.primary,
    },
    workoutDuration: {
        fontSize: 14,
        fontWeight: "normal",
        color: colors.text.muted,
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
