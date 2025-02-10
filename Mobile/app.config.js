import 'dotenv/config';

export default {
    expo: {
        name: "RepRealm",
        slug: "RepRealm",
        version: "1.0.0",
        orientation: "portrait",
        userInterfaceStyle: "light",
        icon: "./assets/icon.png",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.anonymous.RepRealm"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.anonymous.RepRealm"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-sqlite"
        ],
        extra: {
            API_URL: process.env.API_URL,
        }
    }
};
