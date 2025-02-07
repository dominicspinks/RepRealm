import { Model } from '@nozbe/watermelondb';
import { field, date, text, children, relation } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import Exercise from './Exercise';
import Colour from './Colour';

export default class Category extends Model {
    static table = 'categories';

    static associations: Readonly<
        {
            exercises: AssociationInfo,
            colour: AssociationInfo
        }
    > = {
            exercises: { type: 'has_many', foreignKey: 'exercise_id' },
            colour: { type: 'belongs_to', key: 'colour_id' },
        };

    @text('name') name!: string;
    @field('is_deleted') isDeleted!: boolean;
    @date('created_at') createdAt!: number;
    @date('updated_at') updatedAt?: number;

    @relation('colours', 'colour_id') colour!: Colour;

    @children('exercises') exercises!: Exercise[];
}
