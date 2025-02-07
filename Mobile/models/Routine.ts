import { Model } from '@nozbe/watermelondb';
import { date, text, children } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import RoutineWorkout from './RoutineWorkouts';

export default class Routine extends Model {
    static table = 'routines';

    static associations: Readonly<{ workouts: AssociationInfo }> = {
        workouts: { type: 'has_many', foreignKey: 'workout_id' },
    };

    @text('name') name!: string;
    @date('created_at') createdAt!: number;
    @date('updated_at') updatedAt?: number;

    @children('routine_workouts') workouts!: RoutineWorkout[];
}
