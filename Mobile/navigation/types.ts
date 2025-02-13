import { StackNavigationProp } from '@react-navigation/stack';
import { Workout, WorkoutWithExercises } from '../db/schema';

interface SetWorkoutScreenProps {
    workout: Workout;
}

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: undefined;
    WorkoutList: undefined;
    SetWorkout: SetWorkoutScreenProps;
};

export type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
