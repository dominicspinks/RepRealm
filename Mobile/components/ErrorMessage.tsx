import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, ThemeColors } from "../theme";
import { useColourTheme } from "../contexts/ThemeContext";

interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <Ionicons name="warning-outline" size={24} color={colors.error} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: colors.background.error,
        borderRadius: 8,
        margin: 10,
    },
    text: {
        color: colors.error,
        fontSize: 16,
        marginLeft: 8,
    },
});
