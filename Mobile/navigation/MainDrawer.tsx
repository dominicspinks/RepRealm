import { createDrawerNavigator } from '@react-navigation/drawer';
import WorkoutLogsScreen from '../screens/WorkoutLogsScreen';
import MyWorkoutsScreen from '../screens/MyWorkoutsScreen';
import CustomDrawer from './CustomDrawer';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="Workout Logs"
            drawerContent={(props) => <CustomDrawer {...props} />}
        >
            <Drawer.Screen name="Workout Logs" component={WorkoutLogsScreen} />
            <Drawer.Screen name="My Workouts" component={MyWorkoutsScreen} />
        </Drawer.Navigator>
    );
}
