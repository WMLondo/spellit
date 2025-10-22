CREATE TABLE `grapheme_phonemes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`grapheme_id` integer NOT NULL,
	`phoneme_id` integer NOT NULL,
	FOREIGN KEY (`grapheme_id`) REFERENCES `graphemes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`phoneme_id`) REFERENCES `phonemes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `graphemes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`letters` text NOT NULL,
	`is_common` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `word_graphemes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word_id` integer NOT NULL,
	`grapheme_id` integer NOT NULL,
	`position` integer NOT NULL,
	`color` text NOT NULL,
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`grapheme_id`) REFERENCES `graphemes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_phonemes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`type` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_phonemes`("id", "symbol", "type", "description") SELECT "id", "symbol", "type", "description" FROM `phonemes`;--> statement-breakpoint
DROP TABLE `phonemes`;--> statement-breakpoint
ALTER TABLE `__new_phonemes` RENAME TO `phonemes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `phonemes_symbol_unique` ON `phonemes` (`symbol`);