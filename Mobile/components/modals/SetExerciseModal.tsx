import { useState, useEffect } from "react";
import { View, Modal, Alert, StyleSheet } from "react-native";
import { isExerciseNameUnique, addExercise, updateExercise } from "../../services/exercisesService";
import { getMeasurements, getUnits } from "../../services/measurementsService";
import { Category, Exercise, Measurement, MeasurementUnit } from "../../db/schema";
import Button from "../../components/buttons/Button";
import DropdownFieldInput from "../forms/DropdownFieldInput";
import TextFieldInput from "../forms/TextFieldInput";
import ModalHeader from "../headers/ModalHeader";
import BackIcon from "../icons/BackIcon";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";

interface SetExerciseModalProps {
    visible: boolean;
    onClose: () => void;
    categories: Category[];
    exercise?: Exercise | null;
}

export default function SetExerciseModal({ visible, onClose, categories, exercise }: SetExerciseModalProps) {
    const [name, setName] = useState(exercise?.name || "");
    const [category, setCategory] = useState<string | null>(exercise?.categoryId || null);
    const [type1, setType1] = useState<string | null>(exercise?.primaryMeasurementId || null);
    const [type1Unit, setType1Unit] = useState<string | null>(exercise?.primaryMeasurementUnitId || null);
    const [type2, setType2] = useState<string | null>(exercise?.secondaryMeasurementId || null);
    const [type2Unit, setType2Unit] = useState<string | null>(exercise?.secondaryMeasurementUnitId || null);
    const [rest, setRest] = useState<string>(exercise?.rest ? String(exercise.rest) : "");
    const [weightIncrement, setWeightIncrement] = useState<string>(exercise?.weightIncrement ? String(exercise.weightIncrement / 1000) : "");

    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [units, setUnits] = useState<MeasurementUnit[]>([]);

    // **Fetch Measurements & Units when modal opens**
    useEffect(() => {
        async function fetchData() {
            const measurementList = await getMeasurements();
            const unitList = await getUnits();
            setMeasurements(measurementList);
            setUnits(unitList);
        }
        if (visible) {
            fetchData();
            cleanForm();
        };
    }, [visible]);

    // **Handle Type 1 Selection**
    function handleType1Change(selectedType: string) {
        setType1(selectedType);
        setType1Unit(null);

        if (type2 === selectedType) {
            setType2(null);
            setType2Unit(null);
        }
    }

    // **Handle Type 2 Selection**
    function handleType2Change(selectedType: string) {
        setType2(selectedType);
        setType2Unit(null);
    }

    // **Determine if a measurement type requires a unit**
    function requiresUnit(measurementId: string | null) {
        const measurement = measurements.find(m => m.id === measurementId);
        return measurement ? !["Reps", "Time"].includes(measurement.name) : false;
    }

    // **Handle Save**
    async function handleSave() {
        if (!name.trim()) {
            Alert.alert("Error", "Exercise name is required.");
            return;
        }

        const unique = await isExerciseNameUnique(name, exercise?.id);
        if (!unique) {
            Alert.alert("Error", "Exercise name must be unique.");
            return;
        }

        if (!category) {
            Alert.alert("Error", "Please select a category.");
            return;
        }

        if (!type1) {
            Alert.alert("Error", "Please select a primary measurement.");
            return;
        }

        if (requiresUnit(type1) && !type1Unit) {
            Alert.alert("Error", "Please select a unit for the primary measurement.");
            return;
        }

        if (type2 && requiresUnit(type2) && !type2Unit) {
            Alert.alert("Error", "Please select a unit for the secondary measurement.");
            return;
        }

        const payload = {
            name: name.trim(),
            categoryId: category,
            primaryMeasurementId: type1,
            primaryMeasurementUnitId: type1Unit ?? null,
            secondaryMeasurementId: type2 ?? null,
            secondaryMeasurementUnitId: type2Unit ?? null,
            rest: rest ? parseInt(rest, 10) : null,
            weightIncrement: weightIncrement ? Math.round(parseFloat(weightIncrement) * 1000) : null,
        };

        if (exercise) {
            await updateExercise(exercise.id, payload);
        } else {
            await addExercise(payload);
        }

        cleanForm();
        onClose();
    }

    function cleanForm() {
        setName(exercise?.name || "");
        setCategory(exercise?.categoryId || null);
        setType1(exercise?.primaryMeasurementId || null);
        setType1Unit(exercise?.primaryMeasurementUnitId || null);
        setType2(exercise?.secondaryMeasurementId || null);
        setType2Unit(exercise?.secondaryMeasurementUnitId || null);
        setRest(exercise?.rest ? String(exercise.rest) : "");
        setWeightIncrement(exercise?.weightIncrement ? String(exercise.weightIncrement / 1000) : "");
    }

    function handleClose() {
        cleanForm();
        onClose();
    }

    function getDefaultUnit(measurementNum: 1 | 2) {
        const measurementId = measurementNum === 1 ? type1 : type2;
        console.log(measurementId);

        const defaultUnits: Record<string, string> = {
            Weight: "kg",
            Distance: "km",
        };

        const measurement = measurements.find((m) => m.id === measurementId);
        const defaultUnitLabel = measurement ? defaultUnits[measurement?.name] : null;

        // Find and return the default unit ID if it exists
        const defaultUnit = units.find(u => u.measurementId === measurementId && u.unit === defaultUnitLabel);

        if (!defaultUnit) {
            return "";
        }

        if (measurementNum === 1) {
            setType1Unit(defaultUnit.id);
        } else if (measurementNum === 2) {
            setType2Unit(defaultUnit.id);
        }

        return defaultUnit.id;
    }

    return (
        <Modal visible={visible} transparent animationType="fade" >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <ModalHeader
                        leftElement={<BackIcon action={handleClose} />}
                        centreElement={<ModalHeaderTitle title={exercise ? "Edit Exercise" : "Add Exercise"} />}
                    />

                    {/* Inputs */}
                    <TextFieldInput label="Exercise name" placeholder="Exercise name" value={name} setValue={setName} />

                    {/* Category Dropdown */}
                    <DropdownFieldInput
                        selectedValue={category}
                        setValue={setCategory}
                        items={categories}
                        labelField="name"
                        valueField="id"
                        placeholder="Select a category"
                        label="Category"
                    />

                    {/* Type 1 Measurement & Unit Dropdowns in a row */}
                    <View style={styles.rowContainer}>
                        {/* Type 1 Dropdown */}
                        <DropdownFieldInput
                            selectedValue={type1}
                            setValue={handleType1Change}
                            items={measurements}
                            labelField="name"
                            valueField="id"
                            placeholder="Select a measurement"
                            label="Measurement"
                            style={styles.flexGrow}
                        />

                        {/* Type 1 Unit Dropdown (if required) */}
                        {requiresUnit(type1) && (
                            <DropdownFieldInput
                                selectedValue={type1Unit ?? getDefaultUnit(1)}
                                setValue={setType1Unit}
                                items={units.filter(u => u.measurementId === type1)}
                                labelField="unit"
                                valueField="id"
                                placeholder=""
                                label="Unit"
                                style={styles.fixedWidth}
                            />
                        )}
                    </View>

                    {/* Type 2 Measurement & Unit Dropdowns in a row */}
                    <View style={styles.rowContainer}>
                        {/* Type 2 Dropdown */}
                        <DropdownFieldInput
                            selectedValue={type2}
                            setValue={handleType2Change}
                            items={measurements}
                            labelField="name"
                            valueField="id"
                            placeholder="Optional"
                            label="Secondary Measurement"
                            style={styles.flexGrow}
                        />

                        {/* Type 2 Unit Dropdown (if required) */}
                        {requiresUnit(type2) && (
                            <DropdownFieldInput
                                selectedValue={type2Unit ?? getDefaultUnit(2)}
                                setValue={setType2Unit}
                                items={units.filter(u => u.measurementId === type2)}
                                labelField="unit"
                                valueField="id"
                                placeholder=""
                                label="Unit"
                                style={styles.fixedWidth}
                            />
                        )}
                    </View>


                    <View style={styles.rowContainer}>
                        {/* Rest Input */}
                        <TextFieldInput
                            label="Rest (sec)"
                            placeholder="eg 60"
                            value={rest}
                            setValue={setRest}
                            keyboardType="numeric"
                            style={{ width: "48%" }}
                        />

                        {/* Weight Increment Input */}
                        <TextFieldInput
                            label="Weight Increment"
                            placeholder="eg 2.5"
                            value={weightIncrement}
                            setValue={setWeightIncrement}
                            keyboardType="numeric"
                            style={{ width: "48%" }}
                        />
                    </View>

                    {/* Save/Cancel Buttons */}
                    <View style={styles.buttonRow}>
                        <Button title="Cancel" variant="secondary" onPress={handleClose} style={styles.button} />
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    flexGrow: {
        flex: 1,
    },
    fixedWidth: {
        width: 120,
    },
    button: {
        padding: 10,
        width: "48%",
    },
});
