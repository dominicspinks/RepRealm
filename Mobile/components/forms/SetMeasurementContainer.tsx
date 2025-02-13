import { View, Text, StyleSheet } from "react-native";
import SetMeasurementRow from "./SetMeasurementRow";
import SetTimeRow from "./SetTimeRow";
import { theme } from "../../theme";

interface SetMeasurementContainerProps {
    index: number;
    measurementType: "primary" | "secondary";
    measurementName: string | null;
    measurementUnitName: string | null;
    measurementUnitDecimalPlaces: number | null;
    value: string | null;
    updateMeasurement: (index: number, field: "measurement1Value" | "measurement2Value", value: string) => void;
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
    if (!measurementName) return null;

    const isTimeMeasurement = measurementName.toLowerCase() === "time";
    const fieldKey = measurementType === "primary" ? "measurement1Value" : "measurement2Value";

    function decrement() {
        let decrementValue = 1;
        if (measurementName?.toLowerCase() === "weight" && weightIncrement) {
            decrementValue = weightIncrement / 1000;
        }
        updateMeasurement(index, fieldKey, (Number(value) - decrementValue).toString());
    }

    function increment() {
        let incrementValue = 1;
        if (measurementName?.toLowerCase() === "weight" && weightIncrement) {
            incrementValue = weightIncrement / 1000;
        }
        updateMeasurement(index, fieldKey, (Number(value) + incrementValue).toString());
    }

    return (
        <View style={styles.measurementContainer}>
            <Text style={styles.measurementLabel}>
                {measurementName} {measurementUnitName ? `(${measurementUnitName})` : ""}
            </Text>
            {isTimeMeasurement ? (
                <SetTimeRow
                    value={value || "0"}
                    setTime={(val) => updateMeasurement(index, fieldKey, val)} />
            ) : (
                <SetMeasurementRow
                    value={value || ""}
                    decrementMeasurement={decrement}
                    setMeasurement={(val) => updateMeasurement(index, fieldKey, val ?? "")}
                    incrementMeasurement={increment}
                    decimalPlaces={measurementUnitDecimalPlaces ?? 0}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
});