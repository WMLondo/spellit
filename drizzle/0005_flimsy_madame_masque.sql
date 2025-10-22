CREATE TABLE `english_phonemes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`letters` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `english_phonemes_name_unique` ON `english_phonemes` (`name`);