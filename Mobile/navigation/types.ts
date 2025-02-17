import { StackNavigationProp } from '@react-navigation/stack';
import { Routine, Workout, WorkoutWithExercises } from '../db/schema';

interface SetWorkoutScreenProps {
    workout: Workout;
}

interface SetRoutineScreenProps {
    routine: Routine;
}

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: undefined;
    WorkoutList: undefined;
    SetWorkout: SetWorkoutScreenProps;
    RoutineList: undefined;
    SetRoutine: SetRoutineScreenProps;
};

export type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
