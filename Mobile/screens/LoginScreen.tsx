import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import StyledContainer from '../components/StyledContainer';
import Button from '../components/buttons/Button';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../navigation/types';
import Input from '../components/forms/Input';
import { AuthService } from '../services/authService';

export default function LoginScreen() {
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

            {/* Email Input */}
            <Input
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
            />

            {/* Password Input */}
            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            {/* Login Button */}
            <Button title="Login" onPress={handleLogin} style={styles.loginButton} />

            {/* Error Message */}
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            {/* Sign Up */}
            <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.signUpText}>Not a member? <Text style={styles.link}>Register now</Text></Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Continue as Guest Button */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>

            {/* Guest Confirmation Modal */}
            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Continue as Guest</Text>
                            <Text style={styles.modalMessage}>
                                Are you sure you want to continue as a guest? You won’t be able to sync workouts or access other users’ workouts.
                            </Text>

                            {/* Buttons */}
                            <View style={styles.buttonRow}>
                                <Button variant="secondary" title="Login" onPress={() => setModalVisible(false)} style={styles.modalButton} />
                                <Button title="Continue" onPress={handleContinueAsGuest} style={styles.modalButton} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </StyledContainer>
    );
}

const styles = StyleSheet.create({
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
        width: 150,
        height: 150,
        marginBottom: theme.spacing.large,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.large,
    },
    input: {
        width: '100%',
        backgroundColor: theme.colors.inputBackground,
        padding: theme.spacing.medium,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
        marginBottom: theme.spacing.medium,
    },
    signUpText: {
        marginTop: theme.spacing.large,
        color: theme.colors.text,
    },
    link: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: theme.colors.inputBorder,
        marginVertical: theme.spacing.large,
    },
    guestText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginTop: theme.spacing.small,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: theme.spacing.large,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: theme.spacing.medium,
    },
    modalMessage: {
        textAlign: 'center',
        marginBottom: theme.spacing.medium,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
    },
    loginButton: {
        width: '100%',
    },
});
