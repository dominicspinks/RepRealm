import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import WorkoutLogsScreen from '../screens/WorkoutLogsScreen';
import MyWorkoutsScreen from '../screens/MyWorkoutsScreen';
import CustomDrawer from './CustomDrawer';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../navigation/types";

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
    const { user, isGuest } = useAuthStore();
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Wait for auth state to update before checking navigation
    useEffect(() => {
        const timeout = setTimeout(() => setCheckingAuth(false), 100); // Short delay to ensure state updates
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!checkingAuth && !user && !isGuest) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        }
    }, [user, isGuest, checkingAuth]);

    if (checkingAuth) return null;

    return (
        <Drawer.Navigator
            initialRouteName="Workout Logs"
            screenOptions={{ headerShown: false }}
            drawerContent={(props) => <CustomDrawer {...props} />}
        >
            <Drawer.Screen name="Workout Logs" component={WorkoutLogsScreen} />
            <Drawer.Screen name="My Workouts" component={MyWorkoutsScreen} />
        </Drawer.Navigator>
    );
}
