import React from "react";
import { useColourTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { ViewStyle, TextStyle, StyleSheet, View } from "react-native";

interface CheckboxIconProps {
    checked: boolean;
    style?: ViewStyle | TextStyle
}

export default function CheckboxIcon({ checked, style }: CheckboxIconProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={[styles.checkbox, style, checked && { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={20} color={checked ? "white" : "transparent"} />
        </View>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    checkbox: {
        width: 24,
        height: 24,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        borderColor: colors.primary,
        borderWidth: 2,
        margin: 2
    },
})