CREATE TABLE `workout_log_exercise_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_log_exercise_id` text NOT NULL,
	`measurement_1_type_id` text NOT NULL,
	`measurement_1_value` text,
	`measurement_2_type_id` text,
	`measurement_2_value` text,
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
