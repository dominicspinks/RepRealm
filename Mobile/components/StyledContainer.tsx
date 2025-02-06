import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface Props {
    children: React.ReactNode;
}

export default function StyledContainer({ children }: Props) {
    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.medium,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
