import { View, TextInput, StyleSheet } from "react-native";
import MinusIcon from "../icons/MinusIcon";
import PlusIcon from "../icons/PlusIcon";
import { theme, ThemeColors } from "../../theme";
import { useEffect, useState } from "react";
import { scaleMeasurementInt, scaleMeasurementReal } from "../../utilities/formatHelpers";
import { useColourTheme } from "../../contexts/ThemeContext";

interface SetMeasurementRowProps {
    value: number | null;
    decrementMeasurement: () => void;
    setMeasurement: (value: number | null) => void;
    incrementMeasurement: () => void;
    decimalPlaces?: number;
}

export default function SetMeasurementRow({
    value,
    decrementMeasurement,
    setMeasurement,
    incrementMeasurement,
    decimalPlaces = 0,
}: SetMeasurementRowProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [inputValue, setInputValue] = useState<string>(value !== null ? scaleMeasurementReal(value, decimalPlaces).toFixed(decimalPlaces) : "");

    useEffect(() => {
        if (value === null) {
            setInputValue("");
        } else {
            setInputValue(scaleMeasurementReal(value, decimalPlaces).toFixed(decimalPlaces));
        }
    }, [value]);

    // Handle raw input (unformatted)
    function handleChange(text: string) {
        if (text === "") {
            setInputValue("");
            setMeasurement(null);
            return;
        }

        // Allow valid numbers (including decimal input)
        if (/^\d*\.?\d*$/.test(text)) {
            setInputValue(text);
        }
    }

    // Format value when user exits the field or presses Enter
    function formatValue() {
        if (inputValue === "") {
            setMeasurement(null);
        } else {
            const numericValue = parseFloat(inputValue);
            if (!isNaN(numericValue)) {
                const formattedValue = numericValue.toFixed(decimalPlaces);
                setMeasurement(scaleMeasurementInt(numericValue, decimalPlaces));
                setInputValue(formattedValue);
            }
        }
    }

    return (
        <View style={styles.measurementRow}>
            <MinusIcon action={decrementMeasurement} style={styles.adjustButton} />
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={inputValue}
                onChangeText={handleChange}
                onBlur={formatValue}
                onSubmitEditing={formatValue}
            />
            <PlusIcon action={incrementMeasurement} style={styles.adjustButton} />
        </View>
    );
}


// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    measurementRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        gap: 10,
    },
    adjustButton: {
        fontSize: 40,
        color: colors.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        width: 100,
        height: 60,
        textAlign: "center",
        fontSize: 24,
        backgroundColor: "white",
    },
})