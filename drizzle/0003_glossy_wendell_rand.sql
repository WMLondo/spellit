CREATE TABLE `phonemes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word_id` integer NOT NULL,
	`letter` text NOT NULL,
	`symbol` text NOT NULL,
	`color` text NOT NULL,
	`is_silent` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `words` ADD `orthographic_pattern` text;--> statement-breakpoint
ALTER TABLE `words` ADD `phase` text;--> statement-breakpoint
ALTER TABLE `words` ADD `difficulty` text;--> statement-breakpoint
ALTER TABLE `words` DROP COLUMN `phonemes`;