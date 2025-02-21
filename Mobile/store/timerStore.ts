import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TimerState {
    workoutStartTime: number | null; // Timestamp for when the workout started
    restStartTime: number | null;    // Timestamp for the rest timer
    setStartTime: number | null;     // Timestamp for the current set
    isWorkoutActive: boolean;
    isRestActive: boolean;
    isSetActive: boolean;

    startWorkout: () => void;
    endWorkout: () => void;

    startSet: () => void;
    endSet: () => void;

    startRest: () => void;
    endRest: () => void;

    loadStoredTimers: () => Promise<void>;
}

export const useWorkoutTimerStore = create<TimerState>((set, get) => ({
    workoutStartTime: null,
    restStartTime: null,
    setStartTime: null,
    isWorkoutActive: false,
    isRestActive: false,
    isSetActive: false,

    /** Start a workout - Only one workout can be active at a time */
    startWorkout: async () => {
        const currentTime = Date.now();
        set({ workoutStartTime: currentTime, isWorkoutActive: true });
        await AsyncStorage.setItem("workoutStartTime", currentTime.toString());
    },

    /** End the workout and clear stored timers */
    endWorkout: async () => {
        set({ workoutStartTime: null, isWorkoutActive: false, restStartTime: null, isRestActive: false, setStartTime: null, isSetActive: false });
        await AsyncStorage.multiRemove(["workoutStartTime", "restStartTime", "setStartTime"]);
    },

    /** Start a new set */
    startSet: async () => {
        const currentTime = Date.now();
        set({ setStartTime: currentTime, isSetActive: true });
        await AsyncStorage.setItem("setStartTime", currentTime.toString());

        // If workout isn't already active, start it
        if (!get().isWorkoutActive) {
            get().startWorkout();
        }
    },

    /** End the current set */
    endSet: async () => {
        set({ setStartTime: null, isSetActive: false });
        await AsyncStorage.removeItem("setStartTime");
    },

    /** Start rest timer */
    startRest: async () => {
        const currentTime = Date.now();
        set({ restStartTime: currentTime, isRestActive: true });
        await AsyncStorage.setItem("restStartTime", currentTime.toString());
    },

    /** End the rest timer */
    endRest: async () => {
        set({ restStartTime: null, isRestActive: false });
        await AsyncStorage.removeItem("restStartTime");
    },

    /** Load stored timers on app start */
    loadStoredTimers: async () => {
        const workoutStartTime = await AsyncStorage.getItem("workoutStartTime");
        const restStartTime = await AsyncStorage.getItem("restStartTime");
        const setStartTime = await AsyncStorage.getItem("setStartTime");

        set({
            workoutStartTime: workoutStartTime ? parseInt(workoutStartTime, 10) : null,
            restStartTime: restStartTime ? parseInt(restStartTime, 10) : null,
            setStartTime: setStartTime ? parseInt(setStartTime, 10) : null,
            isWorkoutActive: !!workoutStartTime,
            isRestActive: !!restStartTime,
            isSetActive: !!setStartTime,
        });
    },
}));
