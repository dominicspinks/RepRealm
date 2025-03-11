import 'dotenv/config';

export default {
    expo: {
        name: "RepRealm",
        slug: "RepRealm",
        version: "0.1.0",
        orientation: "portrait",
        userInterfaceStyle: "automatic",
        icon: "./assets/icon.png",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.anonymous.RepRealm",
            userInterfaceStyle: "automatic"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.anonymous.RepRealm",
            userInterfaceStyle: "automatic"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-sqlite",
            ["expo-audio"]
        ],
        extra: {
            API_URL: process.env.API_URL,
            eas: {
                projectId: "457210e6-da4b-48c1-a70b-eda19d0b8252"
            }
        },
        owner: "dominicsp"
    },
};
