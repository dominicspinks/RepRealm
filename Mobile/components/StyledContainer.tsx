import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme, ThemeColors } from '../theme';
import { useColourTheme } from '../contexts/ThemeContext';

interface Props {
    children: React.ReactNode;
}

export default function StyledContainer({ children }: Props) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return <View style={styles.container}>{children}</View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: theme.spacing.medium,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
