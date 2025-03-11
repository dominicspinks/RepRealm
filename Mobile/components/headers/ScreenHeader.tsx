import React from 'react';
import { View, StyleSheet } from 'react-native';
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
            <View style={styles.left}>{leftElement}</View>
            <View style={styles.centre}>{centreElement}</View>
            <View style={styles.right}>{rightElement}</View>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background.screenHeader,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
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
