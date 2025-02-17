import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainDrawer from './MainDrawer';
import SetWorkoutScreen from '../screens/SetWorkoutScreen';
import SetRoutineScreen from '../screens/SetRoutineScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {


    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainDrawer} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SetWorkout" component={SetWorkoutScreen} />
            <Stack.Screen name="SetRoutine" component={SetRoutineScreen} />
        </Stack.Navigator>
    );
}
