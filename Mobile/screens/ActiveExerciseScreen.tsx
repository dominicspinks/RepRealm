import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import ScreenHeader from "../components/headers/ScreenHeader";
import ScreenHeaderTitle from "../components/headers/ScreenHeaderTitle";
import BackIcon from "../components/icons/BackIcon";
import { WorkoutLogExerciseWithSets, WorkoutLogExerciseSet } from "../db/schema";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getWorkoutLogExerciseById, saveWorkoutLogSet, deleteWorkoutLogSet } from "../services/workoutLogsService";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import WorkoutTimer from "../components/WorkoutTimer";
import SetMeasurementContainer from "../components/forms/SetMeasurementContainer";
import ActiveExerciseSet from "../components/ActiveExerciseSet";
import Button from "../components/buttons/Button";
import React from "react";

type ActiveExerciseScreenNavigationProp = StackNavigationProp<RootStackParamList, "ActiveExercise">;
type ActiveExerciseScreenRouteProp = RouteProp<RootStackParamList, "ActiveExercise">;

export default function ActiveExerciseScreen() {
    const navigation = useNavigation<ActiveExerciseScreenNavigationProp>();
    const route = useRoute<ActiveExerciseScreenRouteProp>();
    const workoutLogExerciseId = route.params.workoutLogExerciseId;

    const [workoutLogExercise, setWorkoutLogExercise] = useState<WorkoutLogExerciseWithSets | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSet, setSelectedSet] = useState<WorkoutLogExerciseSet | null>(null);
    const [measurement1Value, setMeasurement1Value] = useState<string>("");
    const [measurement2Value, setMeasurement2Value] = useState<string>("");
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        fetchWorkoutLogExercise();
    }, [workoutLogExerciseId]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    async function fetchWorkoutLogExercise() {
        setLoading(true);
        const exercise = await getWorkoutLogExerciseById(workoutLogExerciseId);
        setWorkoutLogExercise(exercise);
        setLoading(false);
    }

    function handleBackButton() {
        navigation.goBack();
    }

    function handleSetPress(set: WorkoutLogExerciseSet) {
        if (selectedSet?.id === set.id) {
            setSelectedSet(null);
            return;
        }
        setSelectedSet(set);
        setMeasurement1Value(set.measurement1Value ?? "");
        setMeasurement2Value(set.measurement2Value ?? "");
    }

    async function handleDeleteSet() {
        if (selectedSet) {
            await deleteWorkoutLogSet(selectedSet.id);
            setSelectedSet(null);
            fetchWorkoutLogExercise();
        }
    }

    async function handleSaveSet() {
        if (!workoutLogExercise) return;

        const isPrimaryRepsInvalid = workoutLogExercise.primaryMeasurementName === "Reps" && (!measurement1Value || measurement1Value === "0");
        const isSecondaryRepsInvalid = workoutLogExercise.secondaryMeasurementName === "Reps" && (!measurement2Value || measurement2Value === "0");

        if (isPrimaryRepsInvalid || isSecondaryRepsInvalid) {
            return;
        }

        await saveWorkoutLogSet({
            id: selectedSet?.id ?? undefined,
            workoutLogExerciseId,
            measurement1Id: workoutLogExercise.primaryMeasurementId,
            measurement1Value: measurement1Value?.trim() ? measurement1Value : "0",
            measurement2Id: workoutLogExercise.secondaryMeasurementId ?? null,
            measurement2Value: workoutLogExercise.secondaryMeasurementId ? measurement2Value?.trim() ? measurement2Value : "0" : null,
            isComplete: selectedSet?.isComplete ?? false,
            completedAt: selectedSet?.completedAt ?? null,
        });
        setSelectedSet(null);
        fetchWorkoutLogExercise();
    }

    async function handleCompleteSet(set: WorkoutLogExerciseSet) {
        await saveWorkoutLogSet({
            ...set,
            isComplete: !set.isComplete,
            completedAt: new Date(),
        });

        fetchWorkoutLogExercise();
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
            {/* Header */}
            <ScreenHeader
                leftElement={<BackIcon action={handleBackButton} />}
                centreElement={<ScreenHeaderTitle title={workoutLogExercise?.name ?? ""} />}
            />
            <View style={styles.content}>
                {loading && <LoadingIndicator />}

                {!loading && (
                    !workoutLogExercise ? (
                        <ErrorMessage message="Exercise not found." />
                    ) : (
                        <>
                            {/* Measurement Inputs */}
                            <View style={styles.measurementsContainer}>
                                <SetMeasurementContainer
                                    index={0}
                                    measurementType="primary"
                                    measurementName={workoutLogExercise.primaryMeasurementName}
                                    measurementUnitName={workoutLogExercise.primaryMeasurementUnitName}
                                    measurementUnitDecimalPlaces={workoutLogExercise.primaryMeasurementUnitDecimalPlaces}
                                    value={measurement1Value}
                                    updateMeasurement={(index, field, value) => setMeasurement1Value(value)}
                                />
                                {workoutLogExercise.secondaryMeasurementId && (
                                    <SetMeasurementContainer
                                        index={1}
                                        measurementType="secondary"
                                        measurementName={workoutLogExercise.secondaryMeasurementName}
                                        measurementUnitName={workoutLogExercise.secondaryMeasurementUnitName}
                                        measurementUnitDecimalPlaces={workoutLogExercise.secondaryMeasurementUnitDecimalPlaces}
                                        value={measurement2Value}
                                        updateMeasurement={(index, field, value) => setMeasurement2Value(value)}
                                    />
                                )}
                            </View>

                            {/* Set Actions */}
                            <View style={styles.buttonsContainer}>
                                <Button title="Delete" onPress={handleDeleteSet} disabled={!selectedSet} />
                                <Button title="Set" onPress={handleSaveSet} />
                            </View>

                            {/* Set List */}
                            <FlatList
                                data={workoutLogExercise.sets}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <ActiveExerciseSet
                                        setNumber={index + 1}
                                        measurement1Value={item.measurement1Value}
                                        measurement2Value={item.measurement2Value}
                                        completed={item.isComplete ?? false}
                                        onComplete={() => handleCompleteSet(item)}
                                        active={item.id === selectedSet?.id}
                                        onSelect={() => handleSetPress(item)}
                                    />
                                )}
                            />
                        </>
                    )
                )}
            </View>

            {/* Timer Bar */}
            {!keyboardVisible && <WorkoutTimer />}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    measurementsContainer: {
        marginBottom: 16,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
});
