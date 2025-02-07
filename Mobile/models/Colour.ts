import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';

export default class Colour extends Model {
    static table = 'colours';

    @text('hex') unit!: string;
}
