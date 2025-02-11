import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = { id: string; email: string; fullName?: string } | null;

type AuthState = {
    user: User;
    accessToken: string | null;
    refreshToken: string | null;
    isGuest: boolean;

    // Actions
    setUser: (user: User, isGuest?: boolean) => Promise<void>;
    setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
    loadAuthState: () => Promise<void>;
    logout: () => Promise<void>;
};

// Zustand store
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isGuest: true,

    // Load persisted auth state on app launch
    loadAuthState: async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            const storedAccessToken = await AsyncStorage.getItem("accessToken");
            const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
            const storedIsGuest = await AsyncStorage.getItem("isGuest");

            set({
                user: storedUser ? JSON.parse(storedUser) : null,
                accessToken: storedAccessToken,
                refreshToken: storedRefreshToken,
                isGuest: storedIsGuest === "true",
            });
        } catch (error) {
            console.error("Failed to load auth state", error);
        }
    },

    // Set user and persist state
    setUser: async (user, isGuest = false) => {
        set({ user, isGuest });
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("isGuest", isGuest ? "true" : "false");
    },

    // Set tokens and persist state
    setTokens: async (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
    },

    logout: async () => {
        set({ user: null, accessToken: null, refreshToken: null, isGuest: false });
        await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken", "isGuest"]);
    },
}));
