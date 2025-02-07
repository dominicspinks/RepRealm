import { Model } from '@nozbe/watermelondb';
import { date, children, immutableRelation } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import Exercise from './Exercise';
import Workout from './Workout';
import WorkoutExerciseSet from './WorkoutExerciseSet';

export default class WorkoutExercise extends Model {
    static table = 'workout_exercises';

    static associations: Readonly<{ exercise: AssociationInfo, workout: AssociationInfo, sets: AssociationInfo }> = {
        exercise: { type: 'belongs_to', key: 'exercise_id' },
        workout: { type: 'belongs_to', key: 'workout_id' },
        sets: { type: 'has_many', foreignKey: 'workout_exercise_id' },
    };

    @date('created_at') createdAt!: number;

    @immutableRelation('exercises', 'exercise_id') exercise!: Exercise;
    @immutableRelation('workouts', 'workout_id') workout!: Workout;
    @children('workout_exercise_sets') sets!: WorkoutExerciseSet[];
}
