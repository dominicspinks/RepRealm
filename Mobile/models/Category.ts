import { Model } from '@nozbe/watermelondb';
import { field, date, text, immutableRelation, children } from '@nozbe/watermelondb/decorators';
import { AssociationInfo } from '@nozbe/watermelondb/Model';
import Exercise from './Exercise';

export default class Category extends Model {
    static table = 'categories';

    static associations: Readonly<{ exercises: AssociationInfo }> = {
        exercises: { type: 'has_many', foreignKey: 'id' },
    };

    @text('name') name!: string;
    @text('colour_id') colourId!: string;
    @field('is_deleted') isDeleted!: boolean;
    @date('created_at') createdAt!: number;
    @date('updated_at') updatedAt?: number;
    @children('exercises') exercises!: Exercise[];
}
