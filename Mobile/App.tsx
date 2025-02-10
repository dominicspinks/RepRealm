import React, { useEffect, useState } from 'react';
import "reflect-metadata";
import 'react-native-gesture-handler';

import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';

import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { initialiseDatabase } from "./db/initialise";
import { Text, View } from 'react-native';
import { useDatabaseMigrations } from './db/database';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);


export default function App() {
    const { success, error } = useDatabaseMigrations();
    const [initialised, setInitialised] = useState(false);

    useEffect(() => {
        if (!success) return;

        (async () => {
            await initialiseDatabase();
            setInitialised(true);
        })();
    }, [success]);

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
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    );
}
