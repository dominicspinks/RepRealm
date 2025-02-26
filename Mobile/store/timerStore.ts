import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { playBeep } from "../utilities/notificationHelper";
import { AudioPlayer } from "expo-audio";

interface TimerState {
    // Workout Timer
    workoutStartTime: number | null;
    workoutEndTime: number | null;
    isWorkoutActive: boolean;
    startWorkout: () => void;
    endWorkout: () => void;

    // Rest Timer
    restTimeRemaining: number;
    isRestActive: boolean;
    startRest: (duration: number, playerLongBeep: AudioPlayer | null) => void;
    endRest: () => void;
    restInterval: NodeJS.Timeout | null;

    // Stopwatch
    stopwatchTime: number;
    isStopwatchRunning: boolean;
    isNegativeStopwatch: boolean;
    leadTime: number;
    startStopwatch: () => void;
    pauseStopwatch: () => void;
    resetStopwatch: () => void;

    // Persistent storage loading
    loadStoredTimers: () => Promise<void>;
}

export const useWorkoutTimerStore = create<TimerState>((set, get) => ({
    // Workout Timer
    workoutStartTime: null,
    workoutEndTime: null,
    isWorkoutActive: false,

    startWorkout: async () => {
        const { workoutStartTime } = get();
        const currentTime = workoutStartTime ?? Date.now();
        set({ workoutStartTime: currentTime, workoutEndTime: null, isWorkoutActive: true });
        await AsyncStorage.setItem("workoutStartTime", currentTime.toString());
    },

    endWorkout: async () => {
        set({
            workoutEndTime: Date.now(),
            isWorkoutActive: false,
            restTimeRemaining: 0,
            isRestActive: false,
            stopwatchTime: 0,
            isStopwatchRunning: false,
        });
        await AsyncStorage.multiRemove(["workoutStartTime", "restTimeRemaining", "stopwatchTime"]);
    },

    // Rest Timer
    restTimeRemaining: 0,
    isRestActive: false,
    restInterval: null,

    startRest: async (duration: number, playerLongBeep: AudioPlayer | null) => {
        const { restInterval } = get();

        // If a rest timer is already running, clear it before starting a new one
        if (restInterval) {
            clearInterval(restInterval);
        }

        set({ restTimeRemaining: duration, isRestActive: true });

        await AsyncStorage.setItem("restTimeRemaining", duration.toString());

        const interval = setInterval(() => {
            set((state) => {
                if (state.restTimeRemaining > 1) {
                    return { restTimeRemaining: state.restTimeRemaining - 1 };
                } else {
                    clearInterval(get().restInterval!);
                    playBeep(playerLongBeep);
                    return { restTimeRemaining: 0, isRestActive: false, restInterval: null };
                }
            });
        }, 1000);

        set({ restInterval: interval });
    },

    endRest: async () => {
        const { restInterval } = get();

        if (restInterval) {
            clearInterval(restInterval);
        }

        set({ restTimeRemaining: 0, isRestActive: false, restInterval: null });
        await AsyncStorage.removeItem("restTimeRemaining");
    },

    // Stopwatch
    stopwatchTime: 0,
    isStopwatchRunning: false,
    isNegativeStopwatch: false,
    leadTime: 0,

    startStopwatch: async () => {
        set({ isStopwatchRunning: true });

        const tickStopwatch = setInterval(() => {
            if (!get().isStopwatchRunning) {
                clearInterval(tickStopwatch);
                return;
            }

            set((state) => {
                const newTime = state.stopwatchTime + (state.isNegativeStopwatch ? -1 : 1);
                if (newTime === 0 || newTime === state.leadTime) {
                    console.log("🔔 Stopwatch Beep!");
                }
                return { stopwatchTime: newTime };
            });
        }, 1000);
    },

    pauseStopwatch: async () => {
        set({ isStopwatchRunning: false });
    },

    resetStopwatch: async () => {
        set({ stopwatchTime: get().leadTime, isNegativeStopwatch: get().leadTime < 0 });
    },

    // Load Stored Timers
    loadStoredTimers: async () => {
        const workoutStartTime = await AsyncStorage.getItem("workoutStartTime");
        const restTimeRemaining = await AsyncStorage.getItem("restTimeRemaining");
        const stopwatchTime = await AsyncStorage.getItem("stopwatchTime");

        set({
            workoutStartTime: workoutStartTime ? parseInt(workoutStartTime, 10) : null,
            isWorkoutActive: !!workoutStartTime,
            restTimeRemaining: restTimeRemaining ? parseInt(restTimeRemaining, 10) : 0,
            isRestActive: !!restTimeRemaining,
            stopwatchTime: stopwatchTime ? parseInt(stopwatchTime, 10) : 0,
            isStopwatchRunning: false,
        });
    },
}));
