import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import "reflect-metadata";
import 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

import AppNavigator from './navigation/AppNavigator';

import { initialiseDatabase } from "./db/initialise";
import { useDatabaseMigrations } from './db/database';
import { useNotificationSounds } from './utilities/notificationHelper';
import { useWorkoutTimerStore } from './store/timerStore';

export default function App() {
    const { success, error } = useDatabaseMigrations();
    const [initialised, setInitialised] = useState(false);
    const { playerLongBeep } = useNotificationSounds();
    const { setPlayer } = useWorkoutTimerStore();

    useEffect(() => {
        if (!success) return;

        (async () => {
            await initialiseDatabase();
            setInitialised(true);
        })();
    }, [success]);

    // Initialise the audio player
    useEffect(() => {
        if (playerLongBeep) {
            setPlayer(playerLongBeep);
        }
    }, [playerLongBeep, setPlayer]);

    if (error) {
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        );
    }

    if (!success || !initialised) {
        return (
            <View>
                <Text>Setting up database...</Text>
            </View>
        );
    }

    return (
        <MenuProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </MenuProvider>
    );
}
