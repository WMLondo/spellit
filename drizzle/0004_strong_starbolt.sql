PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word_id` integer NOT NULL,
	`date` integer NOT NULL,
	`correct` integer NOT NULL,
	`time_spent` integer NOT NULL,
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_progress`("id", "word_id", "date", "correct", "time_spent") SELECT "id", "word_id", "date", "correct", "time_spent" FROM `progress`;--> statement-breakpoint
DROP TABLE `progress`;--> statement-breakpoint
ALTER TABLE `__new_progress` RENAME TO `progress`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `phonemes` DROP COLUMN `is_silent`;--> statement-breakpoint
ALTER TABLE `words` DROP COLUMN `orthographic_pattern`;--> statement-breakpoint
ALTER TABLE `words` DROP COLUMN `phase`;--> statement-breakpoint
ALTER TABLE `words` DROP COLUMN `difficulty`;--> statement-breakpoint
ALTER TABLE `words` DROP COLUMN `correct`;--> statement-breakpoint
ALTER TABLE `words` DROP COLUMN `attempts`;--> statement-breakpoint
ALTER TABLE `words` DROP COLUMN `last_practiced`;--> statement-breakpoint
ALTER TABLE `words` DROP COLUMN `next_review`;