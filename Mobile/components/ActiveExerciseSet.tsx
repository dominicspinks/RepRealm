import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import Checkbox from "./forms/Checkbox";
import { theme } from "../theme";
import { formatSetValue } from "../utilities/formatHelpers";

interface ActiveExerciseSetProps {
    setNumber: number;
    measurement1: {
        value: number | null;
        type: string;
        unit: string | null;
        unitDecimalPlaces: number | null;
    }
    measurement2?: {
        value: number | null;
        type: string | null;
        unit: string | null;
        unitDecimalPlaces: number | null;
    } | undefined;
    completed: boolean;
    active: boolean;
    onComplete: () => void;
    onSelect: (setNumber: number) => void;
}

export default function ActiveExerciseSet({
    setNumber,
    measurement1,
    measurement2,
    completed,
    active,
    onComplete,
    onSelect,
}: ActiveExerciseSetProps) {
    return (
        <TouchableOpacity
            onPress={() => onSelect(setNumber)}
            style={[styles.container, active && styles.active]}
        >
            <Text style={styles.setNumber}>{setNumber}</Text>

            <View style={styles.measurementsContainer}>
                <View style={styles.measurementWrapper}>
                    <Text style={styles.measurementValue}>
                        {formatSetValue(measurement1.value, measurement1.type, measurement1.unit, measurement1.unitDecimalPlaces)}
                    </Text>
                </View>

                {measurement2 && (
                    <View style={styles.measurementWrapper}>
                        <Text style={styles.measurementValue}>
                            {formatSetValue(measurement2.value, measurement2.type, measurement2.unit, measurement2.unitDecimalPlaces)}
                        </Text>
                    </View>
                )}
            </View>

            <Checkbox checked={completed} onPress={onComplete} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: "#fff",
        marginBottom: 8,
        elevation: 2,
    },
    active: {
        backgroundColor: theme.colors.highlight,
    },
    completed: {
        opacity: 0.5,
    },
    setNumber: {
        fontSize: 16,
        fontWeight: "bold",
    },
    measurementsContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
    },
    measurementWrapper: {
        flexDirection: "row",
        alignItems: "center",
        minWidth: 80,
        justifyContent: "flex-end",
    },
    measurementValue: {
        fontSize: 14,
        textAlign: "right",
    },
    measurementUnit: {
        fontSize: 14,
        marginLeft: 4,
        textAlign: "right",
    },
});
