import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { ExerciseFull, NewWorkoutExerciseSet, NewWorkoutExerciseWithSets, Workout, WorkoutExerciseWithSets } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";
import PlusIcon from "../icons/PlusIcon";
import DeleteIcon from "../icons/DeleteIcon";
import Button from "../buttons/Button";
import SetMeasurementContainer from "../forms/SetMeasurementContainer";
import ModalContainer from "./ModalContainer";
import React from "react";
import { useColourTheme } from "../../contexts/ThemeContext";

interface SetWorkoutExerciseModalProps {
    visible: boolean;
    workout: Workout;
    exercise: ExerciseFull;
    workoutExercise: WorkoutExerciseWithSets | null;
    onClose: (closeAll: boolean) => void;
    onSave: (workoutExercise: NewWorkoutExerciseWithSets) => void;
}

export default function SetWorkoutExerciseModal({ visible, workout, exercise, workoutExercise, onClose, onSave }: SetWorkoutExerciseModalProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [error, setError] = useState("");

    const [sets, setSets] = useState<NewWorkoutExerciseSet[]>(workoutExercise?.sets?.length ? workoutExercise.sets : [
        {
            id: undefined,
            workoutExerciseId: "",
            measurement1Id: exercise.primaryMeasurementId ?? "",
            measurement1Value: null,
            measurement2Id: exercise.secondaryMeasurementId ?? null,
            measurement2Value: null,
        },
    ]);

    // Add a new set (copies the previous set's values)
    function addSet() {
        const lastSet = sets[sets.length - 1];

        setSets([
            ...sets,
            {
                id: undefined,
                workoutExerciseId: lastSet?.workoutExerciseId || "",
                measurement1Id: lastSet?.measurement1Id || exercise?.primaryMeasurementId,
                measurement1Value: lastSet?.measurement1Value || null,
                measurement2Id: lastSet?.measurement2Id || exercise?.secondaryMeasurementId || null,
                measurement2Value: lastSet?.measurement2Value || null,
            },
        ]);
    }

    // Delete a set
    function deleteSet(index: number) {
        const newSets = [...sets];
        if (sets.length === 1) {
            newSets[0].measurement1Value = null;
            newSets[0].measurement2Value = null;
        } else {
            newSets.splice(index, 1);
        }
        setSets(newSets);
    }

    // Update measurement value
    function updateMeasurement(index: number, field: "measurement1Value" | "measurement2Value", value: number | null) {
        const newSets = [...sets];
        if (value === null) {
            newSets[index][field] = null;
        } else {
            newSets[index][field] = Math.max(0, value);
        }
        setSets(newSets);
    }

    // Validate and save
    async function handleSave() {
        if (sets.length === 0) {
            setError("At least one set is required.");
            return;
        }
        setError("");

        // If editing an existing workoutExercise, update it
        if (workoutExercise) {
            const updatedWorkoutExercise: NewWorkoutExerciseWithSets = {
                ...workoutExercise,
                sets,
            };
            onSave(updatedWorkoutExercise);
        }
        else if (exercise) {
            const newWorkoutExercise: NewWorkoutExerciseWithSets = {
                workoutId: workout.id,
                exerciseId: exercise.id,
                order: 1,
                sets: sets || [],
            };
            onSave(newWorkoutExercise);
        }
        else {
            setError("Something went wrong.");
            return;
        }

        onClose(true);
    }

    return (
        <ModalContainer
            visible={visible}
            header={
                <ModalHeader
                    leftElement={<BackIcon action={() => onClose(false)} />}
                    centreElement={<ModalHeaderTitle title={exercise?.name || "Exercise"} />}
                    rightElement={<PlusIcon action={addSet} />}
                />
            }
            onClose={() => onClose(false)}
            content={
                <>
                    {sets.map((item, index) => (
                        <View key={item.id || `temp-${index}`} style={styles.setContainer}>
                            {/* Set Number & Delete Icon */}
                            <View style={styles.setRow}>
                                <Text style={styles.setLabel}>Set {index + 1}</Text>
                                <DeleteIcon action={() => deleteSet(index)} />
                            </View>

                            {/* Measurement 1 */}
                            <SetMeasurementContainer
                                index={index}
                                measurementType="primary"
                                measurementName={exercise.primaryMeasurementName}
                                measurementUnitName={exercise.primaryMeasurementUnitName}
                                measurementUnitDecimalPlaces={exercise.primaryMeasurementUnitDecimalPlaces}
                                value={item.measurement1Value ?? null}
                                updateMeasurement={updateMeasurement}
                                weightIncrement={exercise.weightIncrement}
                            />

                            {/* Measurement 2 (If Exists) */}
                            {exercise?.secondaryMeasurementId && (
                                <SetMeasurementContainer
                                    index={index}
                                    measurementType="secondary"
                                    measurementName={exercise.secondaryMeasurementName}
                                    measurementUnitName={exercise.secondaryMeasurementUnitName}
                                    measurementUnitDecimalPlaces={exercise.secondaryMeasurementUnitDecimalPlaces}
                                    value={item.measurement2Value ?? null}
                                    updateMeasurement={updateMeasurement}
                                    weightIncrement={exercise.weightIncrement}
                                />
                            )}
                        </View>
                    ))}
                    {/* Error Message */}
                    {error ? <Text style={styles.error}>{error}</Text> : null}

                </>
            }
            buttons={[
                <Button title="Cancel" variant="secondary" onPress={() => onClose(true)} style={styles.button} />,
                <Button title="Save" onPress={handleSave} style={styles.button} />
            ]}
        />
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    setContainer: {
        marginBottom: 15,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderColor: colors.border.input,
        alignItems: "center",
    },
    setRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.input,
    },
    setLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text.primary,
    },
    error: {
        color: colors.text.error,
        textAlign: "center",
        marginTop: 10,
    },
    button: {
        width: "48%",
    },
});
