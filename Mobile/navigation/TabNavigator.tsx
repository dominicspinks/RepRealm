import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutListScreen from '../screens/WorkoutListScreen';
import RoutineListScreen from '../screens/RoutineListScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import ExerciseListScreen from '../screens/ExerciseListScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ onTabChange }: { onTabChange: (tab: string) => void }) {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            screenListeners={{
                state: (e) => {
                    const tabName = e.data.state.routeNames[e.data.state.index];
                    onTabChange(tabName); // Notify parent component
                },
            }}
        >
            <Tab.Screen name="Workouts" component={WorkoutListScreen} />
            <Tab.Screen name="Routines" component={RoutineListScreen} />
            <Tab.Screen name="Categories" component={CategoryListScreen} />
            <Tab.Screen name="Exercises" component={ExerciseListScreen} />
        </Tab.Navigator>
    );
}
