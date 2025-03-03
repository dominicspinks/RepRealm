import React from "react";
import { View, StyleSheet } from "react-native";
import { useColourTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../theme";

interface ModalHeaderProps {
    leftElement?: React.ReactNode;
    centreElement?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export default function ModalHeader({ leftElement, centreElement, rightElement }: ModalHeaderProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        < View style={styles.header} >
            <View style={styles.left}>{leftElement}</View>
            <View style={styles.centre}>{centreElement}</View>
            <View style={styles.right}>{rightElement}</View>
        </View>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    left: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centre: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    }
})