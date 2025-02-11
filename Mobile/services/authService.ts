import { useAuthStore } from '../store/authStore';
import Constants from 'expo-constants';

const API_URL = Constants?.expoConfig?.extra?.API_URL ?? "";

const signInUser = async (userId: string, email: string, accessToken: string, refreshToken: string, fullName?: string) => {
    const store = useAuthStore.getState();
    await store.setTokens(accessToken, refreshToken);
    await store.setUser({ id: userId, email, fullName }, false);
}

export const AuthService = {
    async login(email: string, password: string) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        mutation {
                        login(input: { email: "${email}", password: "${password}" }) {
                            accessToken
                            refreshToken
                            userId
                        }
                        }
                    `,
                }),
            });

            const result = await response.json();

            if (result.data?.login) {
                signInUser(result.data.login.userId, email, result.data.login.accessToken, result.data.login.refreshToken);
                return { success: true };
            } else {
                return { success: false, error: "Invalid credentials" };
            }
        } catch (error) {
            return { success: false, error: "Network error" };
        }
    },

    async continueAsGuest() {
        await useAuthStore.getState().setUser(null, true);
    },

    async logout() {
        await useAuthStore.getState().logout();
    },

    async signUp(fullName: string, email: string, password: string) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        mutation {
                            signUp(input: { fullName: "${fullName}", email: "${email}", password: "${password}" }) {
                                userId
                                accessToken
                                refreshToken
                            }
                        }
                    `,
                }),
            });

            const result = await response.json();
            if (result.errors) {
                return { success: false, error: result.errors[0].message };
            }

            await signInUser(result.data.signUp.userId, email, fullName, result.data.signUp.accessToken, result.data.signUp.refreshToken);

            return { success: true };
        } catch (error) {
            return { success: false, error: "Network error" };
        }
    }
};
