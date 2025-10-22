ALTER TABLE `settings` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `value` text NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `type` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `settings_name_unique` ON `settings` (`name`);--> statement-breakpoint
ALTER TABLE `settings` DROP COLUMN `child_name`;--> statement-breakpoint
ALTER TABLE `settings` DROP COLUMN `sound_enabled`;--> statement-breakpoint
ALTER TABLE `settings` DROP COLUMN `daily_goal`;--> statement-breakpoint
ALTER TABLE `settings` DROP COLUMN `difficulty_level`;--> statement-breakpoint
ALTER TABLE `settings` DROP COLUMN `theme`;--> statement-breakpoint
ALTER TABLE `settings` DROP COLUMN `notifications_enabled`;--> statement-breakpoint
ALTER TABLE `settings` DROP COLUMN `updated_at`;