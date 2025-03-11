import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, ThemeColors } from '../../theme';
import { useColourTheme } from '../../contexts/ThemeContext';

interface InputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    label?: string;
    style?: ViewStyle | TextStyle;
}

export default function Input({ placeholder, value, onChangeText, secureTextEntry, label, style }: InputProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={[styles.inputContainer, style]}>
            {label && (
                <Text style={styles.label}>{label}</Text>
            )}
            <View style={styles.fieldContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#555" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.background.inputField,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border.input,
        marginBottom: theme.spacing.medium,
        padding: theme.spacing.small,
    },
    input: {
        flex: 1,
    },
    iconContainer: {
        paddingLeft: theme.spacing.small,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.text.primary,
    },
});
