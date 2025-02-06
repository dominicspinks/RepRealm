import { useAuthStore } from '../store/authStore';
import Constants from 'expo-constants';

const API_URL = Constants?.expoConfig?.extra?.API_URL ?? "";

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
              }
            }
          `,
                }),
            });

            const result = await response.json();

            if (result.data?.login) {
                useAuthStore.getState().setTokens(result.data.login.accessToken, result.data.login.refreshToken);
                useAuthStore.getState().setUser({ id: "123", email }, false);
                return { success: true };
            } else {
                return { success: false, error: "Invalid credentials" };
            }
        } catch (error) {
            return { success: false, error: "Network error" };
        }
    },

    continueAsGuest() {
        useAuthStore.getState().setUser(null, true);
    },
};
