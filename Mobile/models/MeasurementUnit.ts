import { Model } from '@nozbe/watermelondb';
import { text, immutableRelation } from '@nozbe/watermelondb/decorators';
import Measurement from './Measurement';
import { AssociationInfo } from '@nozbe/watermelondb/Model';

export default class MeasurementUnit extends Model {
    static table = 'measurement_units';

    static associations: Readonly<{ measurement: AssociationInfo }> = {
        measurement: { type: 'belongs_to', key: 'measurement_id' },
    };

    @text('unit') unit!: string;

    @immutableRelation('measurements', 'measurement_id') measurement!: Measurement;
}
