import { Model } from '@nozbe/watermelondb';
import { field, immutableRelation } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import Workout from './Workout';
import Routine from './Routine';

export default class RoutineWorkout extends Model {
    static table = 'routine_workouts';

    static associations: Readonly<{ routine: AssociationInfo, workout: AssociationInfo }> = {
        routine: { type: 'belongs_to', key: 'routine_id' },
        workout: { type: 'belongs_to', key: 'workout_id' },
    };

    @field('order') order!: number;

    @immutableRelation('routines', 'routine_id') routine!: Routine;
    @immutableRelation('workouts', 'workout_id') workout!: Workout;
}
