import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { theme } from '../theme';

interface InputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean; // Password visibility toggle
}

export default function Input({ placeholder, value, onChangeText, secureTextEntry }: InputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
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
                    <FontAwesome name={isPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#555" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
});
