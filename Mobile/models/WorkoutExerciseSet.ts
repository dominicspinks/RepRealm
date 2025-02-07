import { Model } from '@nozbe/watermelondb';
import { field, date, text, immutableRelation, relation } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import Measurement from './Measurement';
import WorkoutExercise from './WorkoutExercise';

export default class WorkoutExerciseSet extends Model {
    static table = 'workout_exercise_sets';

    static associations: Readonly<
        {
            workoutExercise: AssociationInfo,
            measurement1: AssociationInfo,
            measurement2: AssociationInfo
        }
    > = {
            workoutExercise: { type: 'belongs_to', key: 'workout_exercise_id' },
            measurement1: { type: 'belongs_to', key: 'measurement_1_id' },
            measurement2: { type: 'belongs_to', key: 'measurement_2_id' },
        };

    @field('order') rest?: number;
    @field('measurement_1_value') measurement1Value?: number;
    @field('measurement_2_value') measurement2Value?: number;

    @immutableRelation('workout_exercises', 'workout_exercise_id') workoutExercise!: WorkoutExercise;

    @relation('measurements', 'measurement_1_id') measurement1!: Measurement;
    @relation('measurements', 'measurement_2_id') measurement2?: Measurement;
}
