import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <View style={styles.container}>
            <Ionicons name="warning-outline" size={24} color={theme.colors.error} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: theme.colors.errorBackground || "#FDEDED",
        borderRadius: 8,
        margin: 10,
    },
    text: {
        color: theme.colors.error || "#D8000C",
        fontSize: 16,
        marginLeft: 8,
    },
});
