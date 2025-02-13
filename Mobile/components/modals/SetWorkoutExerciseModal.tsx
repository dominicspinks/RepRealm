import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, TextInput } from "react-native";
import { theme } from "../../theme";
import { ExerciseFull, NewWorkoutExerciseSet, NewWorkoutExerciseWithSets, Workout, WorkoutExerciseInsertSchema, WorkoutExerciseSet, WorkoutExerciseWithSets, WorkoutWithExercises } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";
import PlusIcon from "../icons/PlusIcon";
import DeleteIcon from "../icons/DeleteIcon";
import Button from "../buttons/Button";
import SetMeasurementRow from "../forms/SetMeasurementRow";
import MeasurementContainer from "../forms/SetMeasurementContainer";
import SetMeasurementContainer from "../forms/SetMeasurementContainer";

interface SetWorkoutExerciseModalProps {
    visible: boolean;
    workout: Workout;
    exercise: ExerciseFull;
    workoutExercise: WorkoutExerciseWithSets | null;
    onClose: (closeAll: boolean) => void;
    onSave: (workoutExercise: NewWorkoutExerciseWithSets) => void;
}

export default function SetWorkoutExerciseModal({ visible, workout, exercise, workoutExercise, onClose, onSave }: SetWorkoutExerciseModalProps) {
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
                measurement1Id: lastSet?.measurement1Id || exercise?.primaryMeasurementId || "",
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
    function updateMeasurement(index: number, field: "measurement1Value" | "measurement2Value", value: string | null) {
        const newSets = [...sets];
        if (value === null) {
            newSets[index][field] = null;
        } else {
            const parsedValue = parseFloat(value) || 0;
            newSets[index][field] = Math.max(0, parsedValue).toString();
        }
        setSets(newSets);
    }

    // Update time values
    function updateTime(index: number, hours: string, minutes: string, seconds: string) {
        const totalMilliseconds =
            (parseInt(hours || "0", 10) * 3600000) +
            (parseInt(minutes || "0", 10) * 60000) +
            (parseInt(seconds || "0", 10) * 1000);

        const newSets = [...sets];
        newSets[index].measurement1Value = totalMilliseconds.toString();
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
        console.log("workout exercise", workoutExercise, "exercise", exercise, "sets", sets);
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
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <ModalHeader
                        leftElement={<BackIcon action={() => onClose(false)} />}
                        centreElement={<ModalHeaderTitle title={exercise?.name || "Exercise"} />}
                        rightElement={<PlusIcon action={addSet} />}
                    />

                    {/* Sets List */}
                    <FlatList
                        data={sets}
                        keyExtractor={(item, index) => item.id || `temp-${index}`}
                        renderItem={({ item, index }) => (
                            <View style={styles.setContainer}>
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
                        )}
                    />

                    {/* Error Message */}
                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <Button title="Cancel" variant="secondary" onPress={() => onClose(true)} style={styles.button} />
                        <Button title="Save" onPress={handleSave} style={styles.button} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// **Styles**
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        width: "85%",
        borderRadius: 10,
        elevation: 5,
    },
    setContainer: {
        marginBottom: 15,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderColor: theme.colors.inputBorder,
        alignItems: "center",
    },
    setRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingVertical: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.inputBorder,
    },
    setLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text,
    },
    measurementContainer: {
        marginTop: 10,
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
    },
    measurementRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        gap: 10,
    },
    measurementLabel: {
        fontSize: 14,
        fontWeight: "bold",
    },
    adjustButton: {
        fontSize: 40,
        color: theme.colors.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
        width: 100,
        height: 60,
        textAlign: "center",
        fontSize: 16,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        width: "48%",
    },
});
