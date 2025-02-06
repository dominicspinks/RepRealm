import { Model } from '@nozbe/watermelondb';
import { field, date, text, immutableRelation, relation } from '@nozbe/watermelondb/decorators';
import Category from './Category';
import { AssociationInfo } from '@nozbe/watermelondb/Model';

export default class Exercise extends Model {
    static table = 'exercises';

    static associations: Readonly<{ categories: AssociationInfo }> = {
        categories: { type: 'belongs_to', key: 'category_id' },
    };

    @text('name') name!: string;
    @field('rest') rest?: number;
    @field('weight_increment') weightIncrement?: number;
    @field('is_deleted') isDeleted!: boolean;
    @date('created_at') createdAt!: number;
    @date('updated_at') updatedAt?: number;

    @relation('categories', 'category_id') category!: Category;
}
