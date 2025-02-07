import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface InputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    label?: string;
}

export default function Input({ placeholder, value, onChangeText, secureTextEntry, label }: InputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
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

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: theme.colors.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
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
        color: theme.colors.text,
    },
});
