import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import NavMenuIcon from "../components/icons/NavMenuIcon";
import PlusIcon from "../components/icons/PlusIcon";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import { RootStackParamList } from "../navigation/types";
import { createWorkout, deleteWorkoutById, getWorkoutsWithExercises } from "../services/workoutsService";
import { WorkoutWithExercises } from "../db/schema";
import { theme, ThemeColors } from "../theme";
import { useCallback, useState } from "react";
import WorkoutCard from "../components/cards/WorkoutCard";
import EmptyListNotice from "../components/EmptyListNotice";
import { useColourTheme } from "../contexts/ThemeContext";

// **Define navigation type**
type WorkoutListScreenNavigationProp = StackNavigationProp<RootStackParamList, "WorkoutList">;

export default function WorkoutListScreen() {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const navigation = useNavigation<WorkoutListScreenNavigationProp>();
    const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);

    useFocusEffect(
        useCallback(() => {
            async function fetchWorkouts() {
                const result = await getWorkoutsWithExercises();
                result.sort((a, b) => {
                    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
                    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });
                setWorkouts(result);
            }
            fetchWorkouts();
        }, [])
    );

    async function openSetWorkoutScreen() {
        const workout = await createWorkout("New Workout");
        navigation.navigate("SetWorkout", { workout });
    }

    async function handleDeleteWorkout(workoutId: string) {
        await deleteWorkoutById(workoutId);
        setWorkouts(workouts.filter(w => w.id !== workoutId));
    }

    async function handleEditWorkout(workoutId: string) {
        const workout = workouts.find(w => w.id === workoutId);
        if (!workout) return;
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

            {/* Workout List */}
            <FlatList
                data={workouts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <WorkoutCard
                        workout={item}
                        onDelete={handleDeleteWorkout}
                        onEdit={handleEditWorkout}
                    />
                )}
                ListEmptyComponent={<EmptyListNotice text="No workouts found" />}
            />
        </View>
    );
}


// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    emptyText: {
        textAlign: "center",
        marginTop: theme.spacing.large,
        color: colors.mutedText,
    },
});