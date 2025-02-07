import { Model } from '@nozbe/watermelondb';
import { date, text, children } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import WorkoutExercise from './WorkoutExercise';

export default class Workout extends Model {
    static table = 'workouts';

    static associations: Readonly<{ workoutExercises: AssociationInfo }> = {
        workoutExercises: { type: 'has_many', foreignKey: 'workout_id' },
    };

    @text('name') name!: string;
    @date('created_at') createdAt!: number;
    @date('updated_at') updatedAt?: number;

    @children('workout_exercises') workoutExercises!: WorkoutExercise[];
}
