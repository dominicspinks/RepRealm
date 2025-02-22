import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWorkoutTimerStore } from "../store/timerStore";
import { theme } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "../utilities/formatHelpers";


export default function WorkoutTimer() {
    const {
        workoutStartTime, restStartTime, setStartTime,
        isWorkoutActive, isRestActive, isSetActive,
        startWorkout, endWorkout, startSet, endSet, startRest, endRest
    } = useWorkoutTimerStore();

    const [_, setUpdate] = useState(0); // Forces re-render every second

    /** Re-render the component every second */
    useEffect(() => {
        const interval = setInterval(() => setUpdate((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            {/* Workout Timer */}
            <View style={styles.timerRow}>
                <Text style={styles.timerLabel}>Workout</Text>
                <Text style={styles.timerValue}>{formatTime(workoutStartTime)}</Text>
                {isWorkoutActive && (
                    <TouchableOpacity onPress={endWorkout}>
                        <Ionicons name="stop-circle-outline" size={24} color={theme.colors.danger} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Set Timer */}
            <View style={styles.timerRow}>
                <Text style={styles.timerLabel}>Set</Text>
                <Text style={styles.timerValue}>{formatTime(setStartTime)}</Text>
                {isSetActive && (
                    <TouchableOpacity onPress={endSet}>
                        <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.success} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Rest Timer */}
            <View style={styles.timerRow}>
                <Text style={styles.timerLabel}>Rest</Text>
                <Text style={styles.timerValue}>{formatTime(restStartTime)}</Text>
                <TouchableOpacity onPress={isRestActive ? endRest : startRest}>
                    <Ionicons
                        name={isRestActive ? "pause-circle-outline" : "play-circle-outline"}
                        size={24}
                        color={isRestActive ? theme.colors.warning : theme.colors.primary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        padding: 10,
        borderRadius: 10,
        width: "100%",
        alignSelf: "center",
    },
    timerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    timerLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text,
    },
    timerValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.primary,
    },
});
