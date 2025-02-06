import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary'; // Default to 'primary'
    style?: object;
}

export default function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, variant === 'secondary' ? styles.secondaryButton : styles.primaryButton, style]}
            onPress={onPress}
        >
            <Text style={[styles.primaryText, variant === 'secondary' ? styles.secondaryText : styles.primaryText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#F85F6A',
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#F85F6A',
    },
    primaryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryText: {
        color: '#F85F6A',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
