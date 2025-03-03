import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWorkoutTimerStore } from "../store/timerStore";
import { theme, ThemeColors } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { formatElapsedTime, formatTime } from "../utilities/formatHelpers";
import { WorkoutLog } from "../db/schema";
import { useColourTheme } from "../contexts/ThemeContext";

interface WorkoutTimerProps {
    workoutLog: {
        id: string;
        startedAt: Date | null;
        stoppedAt: Date | null;
    };
}

export default function WorkoutTimer({ workoutLog }: WorkoutTimerProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const {
        workoutStartTime, workoutEndTime, startWorkout, endWorkout,
        restTimeRemaining, initialiseTimerStore: initialiseTimerStore,
        stopwatchTime, isStopwatchRunning, startStopwatch, pauseStopwatch, resetStopwatch
    } = useWorkoutTimerStore();

    const [_, setUpdate] = useState(0);

    /** Re-render the component every second */
    useEffect(() => {
        const interval = setInterval(() => setUpdate(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        initialiseTimerStore(
            workoutLog.id,
            workoutLog.startedAt ? new Date(workoutLog.startedAt).getTime() : null,
            workoutLog.stoppedAt ? new Date(workoutLog.stoppedAt).getTime() : null
        );
    }, [workoutLog]);

    return (
        <View style={styles.timerContainer}>
            {/* Workout Timer */}
            <View style={styles.timerBoxContainer}>
                <TouchableOpacity style={styles.timerBox} onPress={() => console.log("Open Workout Timer Modal")}>
                    <Text style={styles.timerLabel}>WORKOUT</Text>
                    <Text style={styles.timerValue}>{workoutEndTime && workoutStartTime ? formatTime(workoutEndTime - workoutStartTime) : formatElapsedTime(workoutStartTime)}</Text>
                </TouchableOpacity>
                <View style={styles.timerButtonContainer}>
                    <TouchableOpacity style={styles.timerButton} onPress={workoutStartTime && !workoutEndTime ? () => endWorkout(workoutLog.id) : () => startWorkout(workoutLog.id)}>
                        <Ionicons
                            name={workoutStartTime && !workoutEndTime ? "stop" : "play"}
                            size={30}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Vertical Border */}
            <View style={styles.verticalBorder} />

            {/* Rest Timer (Centered) */}
            <View style={styles.restTimerContainer}>
                <TouchableOpacity style={styles.timerBox} onPress={() => console.log("Open Rest Timer Modal")}>
                    <Text style={styles.timerLabel}>REST</Text>
                    <Text style={styles.timerValue}>{restTimeRemaining}</Text>
                </TouchableOpacity>
            </View>

            {/* Vertical Border */}
            <View style={styles.verticalBorder} />

            {/* Stopwatch Timer */}
            <View style={styles.timerBoxContainer}>
                <TouchableOpacity style={styles.timerBox} onPress={() => console.log("Open Stopwatch Modal")}>
                    <Text style={styles.timerLabel}>STOPWATCH</Text>
                    <Text style={styles.timerValue}>
                        {formatTime(stopwatchTime ?? 0)}
                    </Text>
                </TouchableOpacity>
                <View style={styles.timerButtonContainer}>
                    <TouchableOpacity style={styles.timerButton} onPress={isStopwatchRunning ? pauseStopwatch : startStopwatch}>
                        <Ionicons
                            name={isStopwatchRunning ? "pause" : "play"}
                            size={30}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timerButton} onPress={resetStopwatch}>
                        <Text style={styles.timerLabel}>RESET</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    timerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: 2,
    },
    timerBoxContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 3,
        justifyContent: "center",
    },
    restTimerContainer: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    timerBox: {
        alignItems: "center",
    },
    timerLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: colors.text,
    },
    timerValue: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.primary,
    },
    timerButtonContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },
    timerButton: {
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        width: 50,
    },
    verticalBorder: {
        width: 1,
        height: "100%",
        backgroundColor: colors.border,
    },
});
