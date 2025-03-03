import { View, Text, StyleSheet } from "react-native";
import SetMeasurementRow from "./SetMeasurementRow";
import SetTimeRow from "./SetTimeRow";
import { scaleMeasurementInt, scaleMeasurementReal } from "../../utilities/formatHelpers";
import { useColourTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../theme";

interface SetMeasurementContainerProps {
    index: number;
    measurementType: "primary" | "secondary";
    measurementName: string | null;
    measurementUnitName: string | null;
    measurementUnitDecimalPlaces: number | null;
    value: number | null;
    updateMeasurement: (index: number, field: "measurement1Value" | "measurement2Value", value: number | null) => void;
    weightIncrement?: number | null;
}

export default function SetMeasurementContainer({
    index,
    measurementType,
    measurementName,
    measurementUnitName,
    measurementUnitDecimalPlaces,
    value,
    updateMeasurement,
    weightIncrement,
}: SetMeasurementContainerProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    if (!measurementName) return null;

    const isTimeMeasurement = measurementName.toLowerCase() === "time";
    const isWeightMeasurement = measurementName.toLowerCase() === "weight";
    const fieldKey = measurementType === "primary" ? "measurement1Value" : "measurement2Value";

    function decrement() {
        let decrementValue = scaleMeasurementInt(weightIncrement ?? (isWeightMeasurement ? 2.5 : 1), measurementUnitDecimalPlaces);
        updateMeasurement(index, fieldKey, (Number(value) - decrementValue));
    }

    function increment() {
        let incrementValue = scaleMeasurementInt(weightIncrement ?? (isWeightMeasurement ? 2.5 : 1), measurementUnitDecimalPlaces);
        updateMeasurement(index, fieldKey, (Number(value) + incrementValue));
    }

    return (
        <View style={styles.measurementContainer}>
            <Text style={styles.measurementLabel}>
                {measurementName} {measurementUnitName ? `(${measurementUnitName})` : ""}
            </Text>
            {isTimeMeasurement ? (
                <SetTimeRow
                    value={value || 0}
                    setTime={(val) => updateMeasurement(index, fieldKey, val)} />
            ) : (
                <SetMeasurementRow
                    value={value}
                    decrementMeasurement={decrement}
                    setMeasurement={(val) => updateMeasurement(index, fieldKey, val)}
                    incrementMeasurement={increment}
                    decimalPlaces={measurementUnitDecimalPlaces ?? 0}
                />
            )}
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    measurementContainer: {
        marginTop: 10,
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
    },
    measurementLabel: {
        fontSize: 14,
        fontWeight: "bold",
    },
});