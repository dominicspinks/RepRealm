CREATE TABLE `primary_measurement` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `primary_unit` (
	`id` text PRIMARY KEY NOT NULL,
	`measurement_id` text NOT NULL,
	`unit` text NOT NULL,
	`decimal_places` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `secondary_measurement` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `secondary_unit` (
	`id` text PRIMARY KEY NOT NULL,
	`measurement_id` text NOT NULL,
	`unit` text NOT NULL,
	`decimal_places` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`colour_id` text NOT NULL,
	`is_deleted` integer DEFAULT false,
	`created_at` integer DEFAULT '"2025-02-17T01:17:19.041Z"' NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`colour_id`) REFERENCES `colours`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "colour_id", "is_deleted", "created_at", "updated_at") SELECT "id", "name", "colour_id", "is_deleted", "created_at", "updated_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`rest` integer,
	`weight_increment` integer,
	`primary_measurement_id` text NOT NULL,
	`primary_measurement_unit_id` text,
	`secondary_measurement_id` text,
	`secondary_measurement_unit_id` text,
	`is_deleted` integer DEFAULT false,
	`created_at` integer DEFAULT '"2025-02-17T01:17:19.041Z"' NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`primary_measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`primary_measurement_unit_id`) REFERENCES `measurement_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`secondary_measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`secondary_measurement_unit_id`) REFERENCES `measurement_units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "category_id", "name", "rest", "weight_increment", "primary_measurement_id", "primary_measurement_unit_id", "secondary_measurement_id", "secondary_measurement_unit_id", "is_deleted", "created_at", "updated_at") SELECT "id", "category_id", "name", "rest", "weight_increment", "primary_measurement_id", "primary_measurement_unit_id", "secondary_measurement_id", "secondary_measurement_unit_id", "is_deleted", "created_at", "updated_at" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
CREATE TABLE `__new_routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT '"2025-02-17T01:17:19.042Z"' NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_routines`("id", "name", "created_at", "updated_at") SELECT "id", "name", "created_at", "updated_at" FROM `routines`;--> statement-breakpoint
DROP TABLE `routines`;--> statement-breakpoint
ALTER TABLE `__new_routines` RENAME TO `routines`;--> statement-breakpoint
CREATE TABLE `__new_workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`created_at` integer DEFAULT '"2025-02-17T01:17:19.042Z"' NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_exercises`("id", "workout_id", "exercise_id", "created_at") SELECT "id", "workout_id", "exercise_id", "created_at" FROM `workout_exercises`;--> statement-breakpoint
DROP TABLE `workout_exercises`;--> statement-breakpoint
ALTER TABLE `__new_workout_exercises` RENAME TO `workout_exercises`;--> statement-breakpoint
CREATE TABLE `__new_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT '"2025-02-17T01:17:19.042Z"' NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_workouts`("id", "name", "created_at", "updated_at") SELECT "id", "name", "created_at", "updated_at" FROM `workouts`;--> statement-breakpoint
DROP TABLE `workouts`;--> statement-breakpoint
ALTER TABLE `__new_workouts` RENAME TO `workouts`;--> statement-breakpoint
CREATE UNIQUE INDEX `routine_workouts_routine_id_workout_id_unique` ON `routine_workouts` (`routine_id`,`workout_id`);