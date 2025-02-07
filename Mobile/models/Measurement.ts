import { Model } from '@nozbe/watermelondb';
import { text, children } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import MeasurementUnit from './MeasurementUnit';

export default class Measurement extends Model {
    static table = 'measurements';

    static associations: Readonly<{ measurementUnits: AssociationInfo }> = {
        measurementUnits: { type: 'has_many', foreignKey: 'measurement_id' },
    };

    @text('name') name!: string;

    @children('measurement_units') measurementUnits!: MeasurementUnit[]
}
