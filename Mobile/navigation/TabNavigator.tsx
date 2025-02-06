import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutListScreen from '../screens/WorkoutListScreen';
import RoutineListScreen from '../screens/RoutineListScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import ExerciseListScreen from '../screens/ExerciseListScreen';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ onTabChange }: { onTabChange: (tab: string) => void }) {

    type TabIconList = {
        [key: string]: {
            focused: keyof typeof Ionicons.glyphMap,
            unfocused: keyof typeof Ionicons.glyphMap
        }
    }

    const tabIcons: TabIconList = {
        Workouts: {
            focused: 'bookmark',
            unfocused: 'bookmark-outline'
        },
        Routines: {
            focused: 'bookmarks',
            unfocused: 'bookmarks-outline'
        },
        Categories: {
            focused: 'walk',
            unfocused: 'walk-outline'
        },
        Exercises: {
            focused: 'barbell',
            unfocused: 'barbell-outline'
        },
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (focused) {
                        iconName = tabIcons[route.name].focused;
                    } else {
                        iconName = tabIcons[route.name].unfocused;
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
            screenListeners={{
                state: (e) => {
                    const tabName = e.data.state.routeNames[e.data.state.index];
                    onTabChange(tabName);
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
