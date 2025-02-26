import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { playBeep } from "../utilities/notificationHelper";
import { AudioPlayer } from "expo-audio";
import { updateWorkoutLogById } from "../services/workoutLogsService";

interface TimerState {
    workoutLogId: string | null;
    initialiseTimerStore: (workoutLogId: string, startTime: number | null, endTime: number | null) => void;

    // Workout Timer
    workoutStartTime: number | null;
    workoutEndTime: number | null;
    isWorkoutActive: boolean;
    startWorkout: (workoutLogId: string) => void;
    endWorkout: (workoutLogId: string) => void;

    // Rest Timer
    restTimeRemaining: number;
    isRestActive: boolean;
    startRest: (duration: number) => void;
    endRest: () => void;
    restInterval: NodeJS.Timeout | null;
    playerLongBeep: AudioPlayer | null;

    // Stopwatch
    stopwatchTime: number;
    isStopwatchRunning: boolean;
    stopwatchInterval: NodeJS.Timeout | null;
    startStopwatch: () => void;
    pauseStopwatch: () => void;
    resetStopwatch: () => void;

    // Persistent storage loading
    loadStoredTimers: () => Promise<void>;
    setPlayer: (player: AudioPlayer) => void;
}

export const useWorkoutTimerStore = create<TimerState>((set, get) => ({
    workoutLogId: null,

    initialiseTimerStore: (workoutLogId: string, startTime: number | null = null, endTime: number | null = null) => {
        const { workoutLogId: currentWorkoutId, workoutStartTime, workoutEndTime } = get();
        console.log("🔄 Initialising timer store for workout:", workoutLogId, currentWorkoutId, startTime, endTime);
        if (currentWorkoutId !== workoutLogId || workoutStartTime !== startTime || workoutEndTime !== endTime) {
            set({
                workoutLogId,
                workoutStartTime: startTime,
                workoutEndTime: endTime,
                isWorkoutActive: !!startTime && !endTime,
                restTimeRemaining: 0,
                isRestActive: false,
                stopwatchTime: 0,
                isStopwatchRunning: false,
            });
            console.log("🔄 Switched to new workout, resetting timers.");
        }
    },

    // Workout Timer
    workoutStartTime: null,
    workoutEndTime: null,
    isWorkoutActive: false,
    playerLongBeep: null,

    setPlayer: (player: AudioPlayer) => set({ playerLongBeep: player }),

    startWorkout: async (workoutLogId: string) => {
        const { workoutStartTime, workoutLogId: currentWorkoutId } = get();
        const currentTime = workoutStartTime ?? Date.now();
        set({ workoutStartTime: currentTime, workoutEndTime: null, isWorkoutActive: true });
        await updateWorkoutLogById(workoutLogId, { startedAt: new Date(currentTime), stoppedAt: null });
    },

    endWorkout: async (workoutLogId: string) => {
        set({
            workoutEndTime: Date.now(),
            isWorkoutActive: false,
            restTimeRemaining: 0,
            isRestActive: false,
            stopwatchTime: 0,
            isStopwatchRunning: false,
        });
        await AsyncStorage.multiRemove(["workoutStartTime", "restTimeRemaining", "stopwatchTime"]);
        await updateWorkoutLogById(workoutLogId, { stoppedAt: new Date() });
    },

    // Rest Timer
    restTimeRemaining: 0,
    isRestActive: false,
    restInterval: null,

    startRest: async (duration: number) => {
        const { restInterval, playerLongBeep } = get();

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
    stopwatchInterval: null,

    startStopwatch: async () => {
        const { stopwatchInterval } = get();

        if (stopwatchInterval) {
            clearInterval(stopwatchInterval);
        }

        set({ isStopwatchRunning: true });

        const interval = setInterval(() => {
            set((state) => {
                if (!state.isStopwatchRunning) {
                    clearInterval(get().stopwatchInterval!);
                    return state;
                }
                return { stopwatchTime: state.stopwatchTime + 1000 };
            });
        }, 1000);

        set({ stopwatchInterval: interval });
    },

    pauseStopwatch: async () => {
        const { stopwatchInterval } = get();
        if (stopwatchInterval) {
            clearInterval(stopwatchInterval);
        }
        set({ isStopwatchRunning: false, stopwatchInterval: null });
    },

    resetStopwatch: async () => {
        const { stopwatchInterval } = get();
        if (stopwatchInterval) {
            clearInterval(stopwatchInterval);
        }
        set({ stopwatchTime: 0, isStopwatchRunning: false, stopwatchInterval: null });
    },

    // Load Stored Timers
    loadStoredTimers: async () => {
        const workoutStartTime = await AsyncStorage.getItem("workoutStartTime");
        const restTimeRemaining = await AsyncStorage.getItem("restTimeRemaining");
        const stopwatchTime = await AsyncStorage.getItem("stopwatchTime");

        set({
            workoutStartTime: workoutStartTime ? parseInt(workoutStartTime) : null,
            isWorkoutActive: !!workoutStartTime,
            restTimeRemaining: restTimeRemaining ? parseInt(restTimeRemaining) : 0,
            isRestActive: !!restTimeRemaining,
            stopwatchTime: stopwatchTime ? parseInt(stopwatchTime) : 0,
            isStopwatchRunning: false,
        });
    },
}));
