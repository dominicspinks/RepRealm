import { create } from 'zustand';

type User = { id: string; email: string; fullName?: string } | null;

type AuthState = {
    user: User;
    accessToken: string | null;
    refreshToken: string | null;
    isGuest: boolean;
    isSyncing: boolean;

    // Actions
    setUser: (user: User, isGuest?: boolean) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    setSyncing: (isSyncing: boolean) => void;
    logout: () => void;
};

// Zustand store
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isGuest: true, // Default to guest mode
    isSyncing: false,

    setUser: (user, isGuest = false) => set({ user, isGuest }),
    setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
    setSyncing: (isSyncing) => set({ isSyncing }),

    logout: () => set({ user: null, accessToken: null, refreshToken: null, isGuest: true }),
}));
