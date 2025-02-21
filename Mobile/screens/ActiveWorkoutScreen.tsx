import React, { useEffect, useState } from "react";
import { View, Alert, StyleSheet, Text, FlatList } from "react-native";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import BackIcon from "../components/icons/BackIcon";
import PlusIcon from "../components/icons/PlusIcon";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { WorkoutLogExerciseWithSets, WorkoutLogWithExercises } from "../db/schema";
import { deleteWorkoutLogById, getWorkoutLogsWithExercises } from "../services/workoutLogsService";
import { formatDate } from "../utilities/formatHelpers";
import WorkoutTimer from "../components/WorkoutTimer";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import WorkoutLogExerciseCard from "../components/cards/WorkoutLogExerciseCard";
import EmptyListNotice from "../components/EmptyListNotice";

type ActiveWorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList, "ActiveWorkout">;
type ActiveWorkoutScreenRouteProp = RouteProp<RootStackParamList, "ActiveWorkout">;

export default function ActiveWorkoutScreen() {
    const navigation = useNavigation<ActiveWorkoutScreenNavigationProp>();
    const route = useRoute<ActiveWorkoutScreenRouteProp>();
    const workoutLogId = route.params.workoutLogId;

    const [selectCategoryModalOpen, setSelectCategoryModalOpen] = useState(false);
    const [workoutLog, setWorkoutLog] = useState<WorkoutLogWithExercises | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkoutLog();
    }, [workoutLogId])

    async function fetchWorkoutLog() {
        setLoading(true);
        const workouts = await getWorkoutLogsWithExercises(workoutLogId);

        setWorkoutLog(workouts[0] ?? null);
        setLoading(false);
    }

    function handleBackButton() {
        if (workoutLog?.exercises.length === 0) {
            Alert.alert(
                "Delete Workout?",
                "This workout has no exercises and will be deleted if you go back. Do you want to continue?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete", style: "destructive", onPress: async () => {
                            await deleteWorkoutLogById(workoutLog.id);
                            navigation.goBack();
                        }
                    },
                ]
            );
            return;
        }
        navigation.goBack();
    }

    function handleSelectExercise(exercise: WorkoutLogExerciseWithSets) {
        navigation.navigate("ActiveExercise", { workoutLogExerciseId: exercise.id });
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <ScreenHeader
                leftElement={<BackIcon action={handleBackButton} />}
                centreElement={
                    <ScreenHeaderTitle
                        title={
                            workoutLog?.startedAt
                                ? formatDate(workoutLog.startedAt)
                                : workoutLog?.createdAt
                                    ? formatDate(workoutLog.createdAt)
                                    : ""
                        }
                    />
                }
                rightElement={<PlusIcon action={() => { setSelectCategoryModalOpen(true) }} />}
            />
            <View style={styles.content}>

                {loading && <LoadingIndicator />}
                {!loading && (
                    !workoutLog ? (
                        <ErrorMessage message="Workout not found." />
                    ) : (
                        <FlatList
                            data={workoutLog.exercises}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <WorkoutLogExerciseCard exercise={item} onSelect={() => handleSelectExercise(item)} />
                            )}
                            ListEmptyComponent={<EmptyListNotice text="No exercises found." />}
                        />


                    )
                )}

            </View>

            {/* Timer Bar - Always Visible */}
            <WorkoutTimer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1
    }
})