ALTER TABLE `workout_exercises` ADD `order` integer;

WITH `OrderedExercises` AS (
    SELECT
        `id`,
        `workout_id`,
        ROW_NUMBER() OVER (PARTITION BY `workout_id` ORDER BY `created_at`) AS `order_num`
    FROM `workout_exercises`
)
UPDATE `workout_exercises`
SET `order` = `OrderedExercises`.`order_num`
FROM `OrderedExercises`
WHERE `workout_exercises`.`id` = `OrderedExercises`.`id`;