import { database } from '../database/database';
import Category from '../models/Category';
import Exercise from '../models/Exercise';
import Workout from '../models/Workout';

export const DatabaseService = {

    async getWorkouts(): Promise<Workout[]> {
        return database.get<Workout>('workouts').query().fetch();
    },

    // async addCategory(name: string, isDeleted = false) {
    //     return database.write(async () => {
    //         return await database.get<Category>('categories').create((category) => {
    //             category.name = name;
    //             category.isDeleted = isDeleted;
    //             category.createdAt = Date.now();
    //         });
    //     });
    // },

    // async getCategories(): Promise<Category[]> {
    //     return database.get<Category>('categories').query().fetch();
    // },

    // async deleteCategory(categoryId: string) {
    //     return database.write(async () => {
    //         const category = await database.get<Category>('categories').find(categoryId);
    //         await category.destroyPermanently();
    //     });
    // },

    // async addExercise(categoryId: string, name: string, rest: number | null = null) {
    //     return database.write(async () => {
    //         const category = await database.get<Category>('categories').find(categoryId);

    //         await database.get<Exercise>('exercises').create((exercise) => {
    //             exercise.category = category;
    //             exercise.name = 'Push-Ups';
    //             exercise.createdAt = Date.now();
    //         });
    //     });
    // },

    // async getExercises(): Promise<Exercise[]> {
    //     return database.get<Exercise>('exercises').query().fetch();
    // },
};
