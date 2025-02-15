import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from './types';
import { theme } from '../theme';

export default function CustomDrawer(props: any) {
    const { user, logout } = useAuthStore();
    const navigation = useNavigation<AuthScreenNavigationProp>();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                {user ? (
                    <View style={styles.userInfo}>
                        <Text style={styles.email}>{user.email}</Text>
                    </View>
                ) : (
                    <View style={styles.userInfo}>
                        <Text style={styles.guest}>Not signed in</Text>
                    </View>
                )}

                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View style={styles.footer}>
                {user ? (
                    <TouchableOpacity
                        onPress={() => {
                            logout();
                            navigation.navigate('Login');
                        }}
                        style={styles.authButton}
                    >
                        <Text style={styles.authText}>Log Out</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            logout();
                            navigation.navigate('Login')
                        }}
                        style={styles.authButton}
                    >
                        <Text style={styles.authText}>Log In</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userInfo: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.inputBorder,
        marginVertical: 10,
    },
    email: {
        fontSize: 14,
        color: theme.colors.text,
        marginTop: 5,
    },
    guest: {
        fontSize: 16,
        fontStyle: 'italic',
        color: theme.colors.text,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: theme.colors.inputBorder,
    },
    authButton: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    authText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
