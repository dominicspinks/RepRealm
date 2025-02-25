import React, { useCallback, useEffect, useState } from "react";
import { View, Alert, StyleSheet, Text, FlatList } from "react-native";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import BackIcon from "../components/icons/BackIcon";
import PlusIcon from "../components/icons/PlusIcon";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { CategoryWithColour, ExerciseFull, WorkoutLogExerciseWithSets, WorkoutLogWithExercises } from "../db/schema";
import { addWorkoutLogExercise, deleteWorkoutLogById, getWorkoutLogsWithExercises, saveWorkoutLogSet } from "../services/workoutLogsService";
import { formatDate } from "../utilities/formatHelpers";
import WorkoutTimer from "../components/WorkoutTimer";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import WorkoutLogExerciseCard from "../components/cards/WorkoutLogExerciseCard";
import EmptyListNotice from "../components/EmptyListNotice";
import SelectCategoryModal from "../components/modals/SelectCategoryModal";
import SelectExerciseModal from "../components/modals/SelectExerciseModal";

type ActiveWorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList, "ActiveWorkout">;
type ActiveWorkoutScreenRouteProp = RouteProp<RootStackParamList, "ActiveWorkout">;

export default function ActiveWorkoutScreen() {
    const navigation = useNavigation<ActiveWorkoutScreenNavigationProp>();
    const route = useRoute<ActiveWorkoutScreenRouteProp>();
    const workoutLogId = route.params.workoutLogId;

    const [selectCategoryModalOpen, setSelectCategoryModalOpen] = useState(false);
    const [selectExerciseModalOpen, setSelectExerciseModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithColour | null>(null);
    const [workoutLog, setWorkoutLog] = useState<WorkoutLogWithExercises | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkoutLog();
    }, [workoutLogId])

    useFocusEffect(
        useCallback(() => {
            fetchWorkoutLog();
        }, [])
    );

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

    function handleTapExercise(exercise: WorkoutLogExerciseWithSets) {
        navigation.navigate("ActiveExercise", { workoutLogExerciseId: exercise.id });
    }

    function handleSelectCategory(category: CategoryWithColour) {
        setSelectedCategory(category);
        setSelectCategoryModalOpen(false);
        setSelectExerciseModalOpen(true);
    }

    async function handleSelectExercise(exercise: ExerciseFull) {
        setSelectedCategory(null);
        setSelectExerciseModalOpen(false);
        const workoutLogExerciseId = await addWorkoutLogExercise({
            workoutLogId: workoutLogId,
            exerciseId: exercise.id,
            order: (workoutLog?.exercises.length ?? 0) + 1
        })

        navigation.navigate("ActiveExercise", { workoutLogExerciseId });
    }

    function handleCloseSelectExercise() {
        setSelectedCategory(null);
        setSelectExerciseModalOpen(false);
        setSelectCategoryModalOpen(true);
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
                                <WorkoutLogExerciseCard exercise={item} onSelect={() => handleTapExercise(item)} />
                            )}
                            ListEmptyComponent={<EmptyListNotice text="No exercises found." />}
                        />
                    )
                )}
            </View>

            {/* Timer Bar - Always Visible */}
            <WorkoutTimer />

            {/* Select Category Modal */}
            <SelectCategoryModal
                visible={selectCategoryModalOpen}
                onClose={() => setSelectCategoryModalOpen(false)}
                onSelectCategory={handleSelectCategory}
            />

            {/* Select Exercise Modal */}
            <SelectExerciseModal
                visible={selectExerciseModalOpen}
                onClose={handleCloseSelectExercise}
                category={selectedCategory}
                onSelectExercise={handleSelectExercise}
            />
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