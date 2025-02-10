CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`colour_id` text NOT NULL,
	`is_deleted` integer DEFAULT false,
	`created_at` integer DEFAULT '"2025-02-10T06:21:55.185Z"' NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`colour_id`) REFERENCES `colours`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercise_measurements` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`measurement_id` text NOT NULL,
	`is_primary` integer DEFAULT false,
	`units` text,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`rest` integer,
	`weight_increment` integer,
	`is_deleted` integer DEFAULT false,
	`created_at` integer DEFAULT '"2025-02-10T06:21:55.185Z"' NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `measurement_units` (
	`id` text PRIMARY KEY NOT NULL,
	`measurement_id` text NOT NULL,
	`unit` text NOT NULL,
	FOREIGN KEY (`measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `measurements` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routine_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`workout_id` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT '"2025-02-10T06:21:55.185Z"' NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `workout_exercise_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`reps` integer NOT NULL,
	`measurement_1_id` text NOT NULL,
	`measurement_1_value` text,
	`measurement_2_id` text,
	`measurement_2_value` text,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`measurement_1_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`measurement_2_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`created_at` integer DEFAULT '"2025-02-10T06:21:55.185Z"' NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT '"2025-02-10T06:21:55.185Z"' NOT NULL,
	`updated_at` integer
);
