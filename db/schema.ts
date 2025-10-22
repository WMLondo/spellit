import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const words = sqliteTable("words", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  word: text("word").notNull(),
  definition: text("definition").notNull(),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Fonemas: Los 44 sonidos del inglés
export const phonemes = sqliteTable("phonemes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  symbol: text("symbol").notNull().unique(), // /b/, /d/, /f/, etc.
  type: text("type", {
    enum: ["consonant", "short_vowel", "long_vowel", "r_controlled", "digraph"],
  }).notNull(),
  description: text("description"), // "ball", "dog", "fan", etc.
});

// Graphemes: Letras o combinaciones de letras (a, b, ch, igh, etc.)
export const graphemes = sqliteTable("graphemes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  letters: text("letters").notNull(), // "b", "bb", "ph", "igh", etc.
  isCommon: integer("is_common", { mode: "boolean" }).notNull().default(false), // si es spelling común o alternativo
});

// Relación many-to-many: Grapheme puede tener múltiples phonemes, phoneme puede tener múltiples graphemes
export const graphemePhonemes = sqliteTable("grapheme_phonemes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  graphemeId: integer("grapheme_id")
    .notNull()
    .references(() => graphemes.id, { onDelete: "cascade" }),
  phonemeId: integer("phoneme_id")
    .notNull()
    .references(() => phonemes.id, { onDelete: "cascade" }),
});

// Relación entre palabras y sus graphemes con posición
export const wordGraphemes = sqliteTable("word_graphemes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wordId: integer("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  graphemeId: integer("grapheme_id")
    .notNull()
    .references(() => graphemes.id, { onDelete: "cascade" }),
  position: integer("position").notNull(), // orden en la palabra
  color: text("color").notNull(), // color para visualización
});

export const settingTypeEnum = ["string", "number", "boolean"] as const;

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  value: text("value").notNull(),
  type: text("type", { enum: settingTypeEnum }).notNull(),
});

export const progress = sqliteTable("progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wordId: integer("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  date: integer("date", { mode: "timestamp" }).notNull(),
  correct: integer("correct", { mode: "boolean" }).notNull(),
  timeSpent: integer("time_spent").notNull(),
});

// Relations
export const wordsRelations = relations(words, ({ many }) => ({
  wordGraphemes: many(wordGraphemes),
  progress: many(progress),
}));

export const phonemesRelations = relations(phonemes, ({ many }) => ({
  graphemePhonemes: many(graphemePhonemes),
}));

export const graphemesRelations = relations(graphemes, ({ many }) => ({
  graphemePhonemes: many(graphemePhonemes),
  wordGraphemes: many(wordGraphemes),
}));

export const graphemePhonemesRelations = relations(
  graphemePhonemes,
  ({ one }) => ({
    grapheme: one(graphemes, {
      fields: [graphemePhonemes.graphemeId],
      references: [graphemes.id],
    }),
    phoneme: one(phonemes, {
      fields: [graphemePhonemes.phonemeId],
      references: [phonemes.id],
    }),
  }),
);

export const wordGraphemesRelations = relations(wordGraphemes, ({ one }) => ({
  word: one(words, {
    fields: [wordGraphemes.wordId],
    references: [words.id],
  }),
  grapheme: one(graphemes, {
    fields: [wordGraphemes.graphemeId],
    references: [graphemes.id],
  }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  word: one(words, {
    fields: [progress.wordId],
    references: [words.id],
  }),
}));

// Types
export type Word = typeof words.$inferSelect;
export type Phoneme = typeof phonemes.$inferSelect;
export type Grapheme = typeof graphemes.$inferSelect;
export type GraphemePhoneme = typeof graphemePhonemes.$inferSelect;
export type WordGrapheme = typeof wordGraphemes.$inferSelect;
export type Settings = typeof settings.$inferSelect;
export type SettingType = (typeof settingTypeEnum)[number];
export type Progress = typeof progress.$inferSelect;

// Insert types
export type NewWord = typeof words.$inferInsert;
export type NewPhoneme = typeof phonemes.$inferInsert;
export type NewGrapheme = typeof graphemes.$inferInsert;
export type NewGraphemePhoneme = typeof graphemePhonemes.$inferInsert;
export type NewWordGrapheme = typeof wordGraphemes.$inferInsert;
