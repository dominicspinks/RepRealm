import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

interface ScreenHeaderProps {
    leftElement?: React.ReactNode;
    centreElement?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export default function ScreenHeader({ leftElement, centreElement, rightElement }: ScreenHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Space for the Status Bar / Notch */}
            <View style={styles.statusBarSpacing} />

            {/* Header Content */}
            <View style={styles.header}>
                <View style={styles.side}>{leftElement}</View>
                <View style={styles.centre}>{centreElement}</View>
                <View style={styles.side}>{rightElement}</View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    statusBarSpacing: {
        height: StatusBar.currentHeight || 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    side: {
        width: 50,
        alignItems: 'center',
    },
    centre: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
