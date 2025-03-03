import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { theme, ThemeColors } from "../theme";
import { useColourTheme } from "../contexts/ThemeContext";

export default function LoadingIndicator() {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
