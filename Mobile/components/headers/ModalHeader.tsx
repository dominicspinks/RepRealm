import React from "react";
import { View, StyleSheet } from "react-native";

interface ModalHeaderProps {
    leftElement?: React.ReactNode;
    centreElement?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export default function ModalHeader({ leftElement, centreElement, rightElement }: ModalHeaderProps) {
    return (
        < View style={styles.header} >
            <View style={styles.left}>{leftElement}</View>
            <View style={styles.centre}>{centreElement}</View>
            <View style={styles.right}>{rightElement}</View>
        </View>
    )
}

const styles = StyleSheet.create({
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