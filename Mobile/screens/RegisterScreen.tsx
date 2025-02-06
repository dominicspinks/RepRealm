import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import StyledContainer from '../components/StyledContainer';
import Button from '../components/Button';
import Input from '../components/Input';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/authService';

export default function RegisterScreen() {
    const navigation = useNavigation<AuthScreenNavigationProp>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = async () => {
        // Validation
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setErrorMessage('All fields are required');
            return;
        }

        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        const result = await AuthService.signUp(name, email, password);
        if (!result.success) {
            setErrorMessage(result.error ?? 'Sign up failed');
            return;
        }

        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    };

    return (
        <StyledContainer>
            {/* Title */}
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create an account to get started</Text>

            {/* Error Message */}
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            {/* Input Fields */}
            <Input label="Name" placeholder="Name" value={name} onChangeText={setName} />
            <Input label="Email address" placeholder="user@email.com" value={email} onChangeText={setEmail} />
            <Input label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} secureTextEntry />
            <Input placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            {/* Sign Up Button */}
            <Button title="Sign Up" onPress={handleSignUp} style={styles.signUpButton} />

            {/* Already have an account? */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Already have an account? <Text style={styles.link}>Log in</Text></Text>
            </TouchableOpacity>
        </StyledContainer>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 150,
        height: 150,
        marginBottom: theme.spacing.large,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.mutedText,
        marginBottom: theme.spacing.large,
    },
    error: {
        color: theme.colors.error,
        marginBottom: theme.spacing.medium,
        textAlign: 'center',
    },
    signUpButton: {
        width: '100%',
        marginTop: theme.spacing.medium,
    },
    loginText: {
        marginTop: theme.spacing.large,
        color: theme.colors.text,
        textAlign: 'center',
    },
    link: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});
