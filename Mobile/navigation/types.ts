import { StackNavigationProp } from '@react-navigation/stack';
import { Routine, Workout } from '../db/schema';

interface SetWorkoutScreenProps {
    workout: Workout;
}

interface SetRoutineScreenProps {
    routine: Routine;
}

interface ActiveWorkoutScreenProps {
    workoutLogId: string;
}

interface ActiveExerciseScreenProps {
    workoutLogExerciseId: string;
}

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: undefined;
    WorkoutList: undefined;
    SetWorkout: SetWorkoutScreenProps;
    RoutineList: undefined;
    SetRoutine: SetRoutineScreenProps;
    WorkoutLogs: undefined;
    ActiveWorkout: ActiveWorkoutScreenProps;
    ActiveExercise: ActiveExerciseScreenProps;
};

export type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
