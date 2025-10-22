DROP TABLE `english_phonemes`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_phonemes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word_id` integer,
	`letter` text NOT NULL,
	`symbol` text NOT NULL,
	`color` text NOT NULL,
	`name` text,
	`letters` text,
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_phonemes`("id", "word_id", "letter", "symbol", "color", "name", "letters") SELECT "id", "word_id", "letter", "symbol", "color", "name", "letters" FROM `phonemes`;--> statement-breakpoint
DROP TABLE `phonemes`;--> statement-breakpoint
ALTER TABLE `__new_phonemes` RENAME TO `phonemes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;