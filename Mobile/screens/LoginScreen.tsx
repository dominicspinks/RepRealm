import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import StyledContainer from '../components/StyledContainer';
import Button from '../components/buttons/Button';
import { theme, ThemeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../navigation/types';
import Input from '../components/forms/Input';
import { AuthService } from '../services/authService';
import { useColourTheme } from '../contexts/ThemeContext';
import ContinueAsGuestModal from '../components/modals/ContinueAsGuestModal';

export default function LoginScreen() {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [isModalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation<AuthScreenNavigationProp>();

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage('Please enter both email and password.');
            return;
        }

        const result = await AuthService.login(email, password);

        if (!result.success) {
            setErrorMessage(result.error ?? 'Invalid email or password.');
            return;
        }

        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    };

    const handleContinueAsGuest = () => {
        setModalVisible(false);
        AuthService.continueAsGuest();
        navigation.navigate('Main');
    }

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <StyledContainer>

            <Image source={require('../assets/logo.png')} style={styles.logo} />

            <Text style={styles.title}>Welcome!</Text>

            <Input
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
            />

            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <Button title="Login" onPress={handleLogin} style={styles.loginButton} />

            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.signUpText}>Not a member? <Text style={styles.link}>Register now</Text></Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>

            {/* Modals */}
            <ContinueAsGuestModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onContinue={handleContinueAsGuest}
            />
        </StyledContainer>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    error: {
        color: 'red',
        marginBottom: theme.spacing.medium,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: theme.spacing.large,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontFamily: theme.fonts.bold,
        color: colors.text.primary,
        marginBottom: theme.spacing.large,
    },
    signUpText: {
        marginTop: theme.spacing.large,
        color: colors.text.primary,
    },
    link: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.border.input,
        marginVertical: theme.spacing.large,
    },
    guestText: {
        color: colors.primary,
        fontWeight: 'bold',
        marginTop: theme.spacing.small,
    },
    loginButton: {
        width: '100%',
    },
});
