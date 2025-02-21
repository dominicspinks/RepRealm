import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Checkbox from "./forms/Checkbox";
import { theme } from "../theme";

interface ActiveExerciseSetProps {
    setNumber: number;
    measurement1Value: string | null;
    measurement2Value: string | null;
    completed: boolean;
    active: boolean;
    onComplete: () => void;
    onSelect: (setNumber: number) => void;
}

export default function ActiveExerciseSet({
    setNumber,
    measurement1Value,
    measurement2Value,
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
                <Text style={styles.measurement}>
                    {measurement1Value ?? "-"}
                </Text>
                {measurement2Value && (
                    <Text style={styles.measurement}>
                        {measurement2Value}
                    </Text>
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
    measurement: {
        fontSize: 14,
        marginHorizontal: 8,
    },
});
