import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import WorkoutLogsScreen from '../screens/WorkoutLogsScreen';
import MyWorkoutsScreen from '../screens/MyWorkoutsScreen';
import CustomDrawer from './CustomDrawer';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../navigation/types";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useColourTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../theme';
import { StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

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
            screenOptions={{
                headerShown: false,
                drawerLabelStyle: { color: colors.text.secondary },
                drawerActiveBackgroundColor: colors.primary + '40',
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}
        >
            <Drawer.Screen name="Workout Logs" component={WorkoutLogsScreen} />
            <Drawer.Screen name="My Workouts" component={MyWorkoutsScreen} />
        </Drawer.Navigator>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({

})