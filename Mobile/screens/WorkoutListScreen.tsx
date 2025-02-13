import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import { RootStackParamList } from "../navigation/types";
import { createWorkout, deleteWorkoutById, getWorkoutById, getWorkouts } from "../services/workoutsService";
import { Workout } from "../db/schema";
import { theme } from "../theme";
import { useCallback, useEffect, useState } from "react";

// **Define navigation type**
type WorkoutListScreenNavigationProp = StackNavigationProp<RootStackParamList, "WorkoutList">;

export default function WorkoutListScreen() {
    const navigation = useNavigation<WorkoutListScreenNavigationProp>();
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useFocusEffect(
        useCallback(() => {
            async function fetchWorkouts() {
                const result = await getWorkouts();
                setWorkouts(result);
            }
            fetchWorkouts();
        }, [])
    );

    async function openSetWorkoutScreen() {
        const workout = await createWorkout("New Workout");
        navigation.navigate("SetWorkout", { workout });
    }

    async function handleDeleteButton(workoutId: string) {
        await deleteWorkoutById(workoutId);
        setWorkouts(workouts.filter(w => w.id !== workoutId));
    }

    async function handleEditButton(workoutId: string) {
        console.log("Edit workout");
        const workout = workouts.find(w => w.id === workoutId);
        if (!workout) {
            return;
        }
        navigation.navigate("SetWorkout", { workout });
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <ScreenHeader
                leftElement={<NavMenuIcon />}
                centreElement={<ScreenHeaderTitle title="Workouts" />}
                rightElement={<PlusIcon action={openSetWorkoutScreen} />}
            />

            {/* Basic Workout List */}
            <FlatList
                data={workouts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.workoutRow}>
                        <Text style={styles.workoutName}>{item.name}</Text>
                        <TouchableOpacity onPress={() => handleEditButton(item.id)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteButton(item.id)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No workouts found.</Text>}
            />
        </View>
    );
}


// **Styles**
const styles = StyleSheet.create({
    workoutRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing.medium,
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
    },
    workoutName: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text,
    },
    deleteButton: {
        backgroundColor: theme.colors.danger,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        marginTop: theme.spacing.large,
        color: theme.colors.mutedText,
    },
});