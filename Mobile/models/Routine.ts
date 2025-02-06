import { Model } from '@nozbe/watermelondb';
import { field, date, text } from '@nozbe/watermelondb/decorators';

export default class Routine extends Model {
    static table = 'routines';

    @text('name') name!: string;
    @date('created_at') createdAt!: number;
    @date('updated_at') updatedAt?: number;
}
