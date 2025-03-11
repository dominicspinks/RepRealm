import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { isExerciseNameUnique, addExercise, updateExercise } from "../../services/exercisesService";
import { getMeasurements, getUnits } from "../../services/measurementsService";
import { Category, Exercise, ExerciseFull, Measurement, MeasurementUnit } from "../../db/schema";
import Button from "../../components/buttons/Button";
import DropdownFieldInput from "../forms/DropdownFieldInput";
import TextFieldInput from "../forms/TextFieldInput";
import ModalHeader from "../headers/ModalHeader";
import BackIcon from "../icons/BackIcon";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import ModalContainer from "./ModalContainer";
import { getCategories } from "../../services/categoriesService";
import { scaleMeasurementReal } from "../../utilities/formatHelpers";
import { useColourTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../theme";

interface SetExerciseModalProps {
    visible: boolean;
    onClose: () => void;
    exercise?: ExerciseFull | null;
    activeCategoryId?: string | null;
}

export default function SetExerciseModal({ visible, onClose, exercise, activeCategoryId }: SetExerciseModalProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    // Determine decimal places from the weight measurement (if any)
    const primaryIsWeight = exercise?.primaryMeasurementName?.toLowerCase() === "weight";
    const secondaryIsWeight = exercise?.secondaryMeasurementName?.toLowerCase() === "weight";

    const weightDecimalPlaces = (primaryIsWeight
        ? exercise?.primaryMeasurementUnitDecimalPlaces
        : secondaryIsWeight
            ? exercise?.secondaryMeasurementUnitDecimalPlaces
            : 0) ?? 0;


    const [name, setName] = useState(exercise?.name || "");
    const [category, setCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [type1, setType1] = useState<string | null>(exercise?.primaryMeasurementId || null);
    const [type1Unit, setType1Unit] = useState<string | null>(exercise?.primaryMeasurementUnitId || null);
    const [type2, setType2] = useState<string | null>(exercise?.secondaryMeasurementId || null);
    const [type2Unit, setType2Unit] = useState<string | null>(exercise?.secondaryMeasurementUnitId || null);
    const [rest, setRest] = useState<string>(exercise?.rest ? String(exercise.rest) : "");
    const [weightIncrement, setWeightIncrement] = useState<string>(
        exercise?.weightIncrement
            ? scaleMeasurementReal(exercise.weightIncrement, weightDecimalPlaces).toFixed(weightDecimalPlaces)
            : ""
    );

    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [units, setUnits] = useState<MeasurementUnit[]>([]);

    // **Fetch Measurements & Units when modal opens**
    useEffect(() => {
        if (visible) {
            fetchData();
            cleanForm();
        };
    }, [visible]);

    useEffect(() => {
        setCategory(exercise?.categoryId ?? activeCategoryId ?? null);
    }, [visible, exercise?.categoryId, activeCategoryId]);

    async function fetchData() {
        const measurementList = await getMeasurements();
        const unitList = await getUnits();
        const categoryList = await getCategories();
        setCategories(categoryList);
        setMeasurements(measurementList);
        setUnits(unitList);
    }

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
        <ModalContainer
            visible={visible}
            header={<ModalHeader
                leftElement={<BackIcon action={handleClose} />}
                centreElement={<ModalHeaderTitle title={exercise ? "Edit Exercise" : "Add Exercise"} />}
            />}
            onClose={onClose}
            content={
                <>
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
                            containerStyle={{ width: "48%" }}
                        />

                        {/* Weight Increment Input */}
                        <TextFieldInput
                            label="Weight Increment"
                            placeholder="default 2.5"
                            value={weightIncrement}
                            setValue={setWeightIncrement}
                            keyboardType="numeric"
                            containerStyle={{ width: "48%" }}
                            disabled={!primaryIsWeight && !secondaryIsWeight}
                        />
                    </View>
                </>
            }
            buttons={[
                <Button title="Cancel" variant="secondary" onPress={handleClose} style={styles.button} />,
                <Button title="Save" onPress={handleSave} style={styles.button} />
            ]}
        />
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
