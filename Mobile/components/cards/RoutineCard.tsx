import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../theme";
import { RoutineWithFullWorkouts, RoutineWithWorkouts, WorkoutWithExercises } from "../../db/schema";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import ExerciseWithSets from "../ExerciseWithSets";
import { FlatList } from "react-native-gesture-handler";
import WorkoutCard from "./WorkoutCard";

interface RoutineCardProps {
    routine: RoutineWithFullWorkouts;
    onEdit: (routineId: string) => void;
    onDelete: (routineId: string) => void;
}

export default function RoutineCard({ routine, onEdit, onDelete }: RoutineCardProps) {
    const [expanded, setExpanded] = useState(false);

    function toggleExpand() {
        setExpanded(prev => !prev);
    }

    return (
        <View style={styles.card}>
            {/* Routine Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.routineName}>{routine.name}</Text>
                <View style={styles.buttonRow}>
                    <EditIcon action={() => onEdit(routine.id)} />
                    <DeleteIcon action={() => onDelete(routine.id)} />
                </View>
            </View>

            <FlatList
                data={routine.workouts.map(w => w.workout)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <WorkoutCard workout={item} collapsible={true} editable={false} deletable={false} variant="embedded" />
                )}
            />
        </View>
    );
}



// **Styles**
const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        paddingVertical: 15,
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
        paddingHorizontal: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: theme.colors.borderStrong,
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        flex: 1
    },
    routineName: {
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
