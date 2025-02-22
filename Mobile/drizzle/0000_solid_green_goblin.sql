CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`colour_id` text NOT NULL,
	`is_deleted` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`colour_id`) REFERENCES `colours`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `colours` (
	`id` text PRIMARY KEY NOT NULL,
	`hex` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercises` (
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
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`primary_measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`primary_measurement_unit_id`) REFERENCES `measurement_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`secondary_measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`secondary_measurement_unit_id`) REFERENCES `measurement_units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `measurement_units` (
	`id` text PRIMARY KEY NOT NULL,
	`measurement_id` text NOT NULL,
	`unit` text NOT NULL,
	`decimal_places` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`measurement_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `measurements` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE `routine_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`workout_id` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_routine_workout` ON `routine_workouts` (`routine_id`,`workout_id`);--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer
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
CREATE TABLE `workout_exercise_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`measurement_1_id` text NOT NULL,
	`measurement_1_value` integer,
	`measurement_2_id` text,
	`measurement_2_value` integer,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`measurement_1_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`measurement_2_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workout_log_exercise_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_log_exercise_id` text NOT NULL,
	`measurement_1_type_id` text NOT NULL,
	`measurement_1_value` integer,
	`measurement_2_type_id` text,
	`measurement_2_value` integer,
	`is_complete` integer DEFAULT false,
	`completed_at` integer,
	FOREIGN KEY (`workout_log_exercise_id`) REFERENCES `workout_log_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`measurement_1_type_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`measurement_2_type_id`) REFERENCES `measurements`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `workout_log_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_log_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`workout_log_id`) REFERENCES `workout_logs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workout_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text,
	`duration` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`started_at` integer,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer
);
