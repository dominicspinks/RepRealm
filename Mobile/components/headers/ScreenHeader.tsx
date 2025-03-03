import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useColourTheme } from '../../contexts/ThemeContext';
import { ThemeColors } from '../../theme';

interface ScreenHeaderProps {
    leftElement?: React.ReactNode;
    centreElement?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export default function ScreenHeader({ leftElement, centreElement, rightElement }: ScreenHeaderProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            {/* Space for the Status Bar / Notch */}
            <View style={styles.statusBarSpacing} />

            {/* Header Content */}
            <View style={styles.header}>
                <View style={styles.left}>{leftElement}</View>
                <View style={styles.centre}>{centreElement}</View>
                <View style={styles.right}>{rightElement}</View>
            </View>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        backgroundColor: colors.headerBackground,
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
});
