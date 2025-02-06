import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import Category from '../models/Category';
import Exercise from '../models/Exercise';
import { setGenerator } from '@nozbe/watermelondb/utils/common/randomId';
import { uuidv7 } from 'uuidv7';

// Set UUIDv7 as the ID generator
setGenerator(() => uuidv7());

const adapter = new SQLiteAdapter({
    schema,
    jsi: true,
});

export const database = new Database({
    adapter,
    modelClasses: [Category, Exercise],
});
