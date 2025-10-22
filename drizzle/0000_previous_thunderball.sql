CREATE TABLE `progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word_id` integer NOT NULL,
	`date` integer NOT NULL,
	`correct` integer NOT NULL,
	`time_spent` integer NOT NULL,
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`child_name` text DEFAULT 'Emma' NOT NULL,
	`sound_enabled` integer DEFAULT true NOT NULL,
	`daily_goal` integer DEFAULT 5 NOT NULL,
	`difficulty_level` text DEFAULT 'beginner' NOT NULL,
	`theme` text DEFAULT 'light' NOT NULL,
	`notifications_enabled` integer DEFAULT true NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word` text NOT NULL,
	`definition` text NOT NULL,
	`image_url` text,
	`phonemes` text NOT NULL,
	`correct` integer DEFAULT false NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_practiced` integer,
	`next_review` integer,
	`created_at` integer NOT NULL
);
