import { Model } from '@nozbe/watermelondb';
import { text, relation, field, immutableRelation } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import Measurement from './Measurement';
import Exercise from './Exercise';

export default class ExerciseMeasurement extends Model {
    static table = 'exercise_measurements';

    static associations: Readonly<{ measurement: AssociationInfo, exercise: AssociationInfo }> = {
        measurement: { type: 'belongs_to', key: 'measurement_id' },
        exercise: { type: 'belongs_to', key: 'exercise_id' },
    };

    @field('is_primary') isPrimary!: boolean;
    @text('units') name?: string;

    @immutableRelation('exercises', 'exercise_id') exercise!: Exercise;
    @relation('measurements', 'measurement_id') measurement!: Measurement;
}
