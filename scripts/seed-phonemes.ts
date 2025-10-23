// 🧠 Seed de los 44 fonemas del inglés según Reading Rockets
// Basado en: https://www.readingrockets.org/sites/default/files/migrated/the-44-phonemes-of-english.pdf

import { DATABASE_NAME } from "@/app/_layout";
import { graphemePhonemes, graphemes, phonemes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

// Los 44 fonemas del inglés con sus graphemes
const ENGLISH_PHONEMES = [
  // CONSONANTS
  {
    symbol: "/b/",
    type: "consonant" as const,
    description: "ball",
    commonSpellings: ["b"],
    alternativeSpellings: ["bb"],
  },
  {
    symbol: "/d/",
    type: "consonant" as const,
    description: "dog",
    commonSpellings: ["d"],
    alternativeSpellings: ["dd", "ed"],
  },
  {
    symbol: "/f/",
    type: "consonant" as const,
    description: "fan",
    commonSpellings: ["f"],
    alternativeSpellings: ["ff", "ph", "gh", "lf", "ft"],
  },
  {
    symbol: "/g/",
    type: "consonant" as const,
    description: "grapes",
    commonSpellings: ["g"],
    alternativeSpellings: ["gg", "gh", "gu", "gue"],
  },
  {
    symbol: "/h/",
    type: "consonant" as const,
    description: "hat",
    commonSpellings: ["h"],
    alternativeSpellings: ["wh"],
  },
  {
    symbol: "/j/",
    type: "consonant" as const,
    description: "jellyfish",
    commonSpellings: ["j"],
    alternativeSpellings: ["ge", "g", "dge", "di", "gg"],
  },
  {
    symbol: "/k/",
    type: "consonant" as const,
    description: "kite",
    commonSpellings: ["k", "c"],
    alternativeSpellings: ["ch", "cc", "lk", "qu", "q", "ck", "x"],
  },
  {
    symbol: "/l/",
    type: "consonant" as const,
    description: "leaf",
    commonSpellings: ["l"],
    alternativeSpellings: ["ll"],
  },
  {
    symbol: "/m/",
    type: "consonant" as const,
    description: "monkey",
    commonSpellings: ["m"],
    alternativeSpellings: ["mm", "mb", "mn", "lm"],
  },
  {
    symbol: "/n/",
    type: "consonant" as const,
    description: "nest",
    commonSpellings: ["n"],
    alternativeSpellings: ["nn", "kn", "gn", "pn"],
  },
  {
    symbol: "/ng/",
    type: "consonant" as const,
    description: "ring",
    commonSpellings: ["ng"],
    alternativeSpellings: ["n", "ngue"],
  },
  {
    symbol: "/p/",
    type: "consonant" as const,
    description: "pig",
    commonSpellings: ["p"],
    alternativeSpellings: ["pp"],
  },
  {
    symbol: "/r/",
    type: "consonant" as const,
    description: "robot",
    commonSpellings: ["r"],
    alternativeSpellings: ["rr", "wr", "rh"],
  },
  {
    symbol: "/s/",
    type: "consonant" as const,
    description: "sun",
    commonSpellings: ["s"],
    alternativeSpellings: ["ss", "c", "sc", "ps", "st", "ce", "se"],
  },
  {
    symbol: "/t/",
    type: "consonant" as const,
    description: "tap",
    commonSpellings: ["t"],
    alternativeSpellings: ["tt", "th", "ed"],
  },
  {
    symbol: "/v/",
    type: "consonant" as const,
    description: "van",
    commonSpellings: ["v"],
    alternativeSpellings: ["f", "ph", "ve"],
  },
  {
    symbol: "/w/",
    type: "consonant" as const,
    description: "web",
    commonSpellings: ["w"],
    alternativeSpellings: ["wh", "u", "o"],
  },
  {
    symbol: "/y/",
    type: "consonant" as const,
    description: "yo-yo",
    commonSpellings: ["y"],
    alternativeSpellings: ["i", "j"],
  },
  {
    symbol: "/z/",
    type: "consonant" as const,
    description: "zebra",
    commonSpellings: ["z"],
    alternativeSpellings: ["zz", "s", "ss", "x", "ze", "se"],
  },

  // DIGRAPHS
  {
    symbol: "/zh/",
    type: "digraph" as const,
    description: "treasure",
    commonSpellings: ["s"],
    alternativeSpellings: ["si", "z"],
  },
  {
    symbol: "/ch/",
    type: "digraph" as const,
    description: "cheese",
    commonSpellings: ["ch"],
    alternativeSpellings: ["tch", "tu", "ti", "te"],
  },
  {
    symbol: "/sh/",
    type: "digraph" as const,
    description: "shark",
    commonSpellings: ["sh"],
    alternativeSpellings: ["ce", "s", "ci", "si", "ch", "sci", "ti"],
  },
  {
    symbol: "/th/",
    type: "digraph" as const,
    description: "thongs (unvoiced)",
    commonSpellings: ["th"],
    alternativeSpellings: [],
  },
  {
    symbol: "/th/",
    type: "digraph" as const,
    description: "feather (voiced)",
    commonSpellings: ["th"],
    alternativeSpellings: [],
  },

  // SHORT VOWELS
  {
    symbol: "/a/",
    type: "short_vowel" as const,
    description: "cat",
    commonSpellings: ["a"],
    alternativeSpellings: ["ai"],
  },
  {
    symbol: "/e/",
    type: "short_vowel" as const,
    description: "egg",
    commonSpellings: ["e"],
    alternativeSpellings: ["ea", "u", "ie", "ai", "a", "eo", "ei", "ae", "ay"],
  },
  {
    symbol: "/i/",
    type: "short_vowel" as const,
    description: "igloo",
    commonSpellings: ["i"],
    alternativeSpellings: ["e", "o", "u", "ui", "y", "ie"],
  },
  {
    symbol: "/o/",
    type: "short_vowel" as const,
    description: "orange",
    commonSpellings: ["o"],
    alternativeSpellings: ["a", "ho"],
  },
  {
    symbol: "/u/",
    type: "short_vowel" as const,
    description: "mug",
    commonSpellings: ["u"],
    alternativeSpellings: ["o", "oo", "ou"],
  },
  {
    symbol: "/oo/",
    type: "short_vowel" as const,
    description: "book",
    commonSpellings: ["oo"],
    alternativeSpellings: ["u", "ou", "o"],
  },

  // LONG VOWELS
  {
    symbol: "/ā/",
    type: "long_vowel" as const,
    description: "snail",
    commonSpellings: ["ai", "a"],
    alternativeSpellings: [
      "eigh",
      "aigh",
      "ay",
      "et",
      "ei",
      "au",
      "a-e",
      "ea",
      "ey",
    ],
  },
  {
    symbol: "/ē/",
    type: "long_vowel" as const,
    description: "bee",
    commonSpellings: ["ee", "e"],
    alternativeSpellings: ["ea", "y", "ey", "oe", "ie", "i", "ei", "eo", "ay"],
  },
  {
    symbol: "/ī/",
    type: "long_vowel" as const,
    description: "spider",
    commonSpellings: ["i"],
    alternativeSpellings: [
      "y",
      "igh",
      "ie",
      "uy",
      "ye",
      "ai",
      "is",
      "eigh",
      "i-e",
    ],
  },
  {
    symbol: "/ō/",
    type: "long_vowel" as const,
    description: "boat",
    commonSpellings: ["oa", "o-e", "o"],
    alternativeSpellings: ["oe", "ow", "ough", "eau", "oo", "ew"],
  },
  {
    symbol: "/ü/",
    type: "long_vowel" as const,
    description: "moon",
    commonSpellings: ["oo"],
    alternativeSpellings: [
      "ew",
      "ue",
      "u-e",
      "oe",
      "ough",
      "ui",
      "o",
      "oeu",
      "ou",
    ],
  },
  {
    symbol: "/yü/",
    type: "long_vowel" as const,
    description: "uniform",
    commonSpellings: ["u"],
    alternativeSpellings: ["you", "ew", "iew", "yu", "eue", "eau", "ieu", "eu"],
  },

  // R-CONTROLLED VOWELS
  {
    symbol: "/ã/",
    type: "r_controlled" as const,
    description: "chair",
    commonSpellings: ["air"],
    alternativeSpellings: ["are", "ear", "ere", "eir", "ayer"],
  },
  {
    symbol: "/ä/",
    type: "r_controlled" as const,
    description: "car",
    commonSpellings: ["ar"],
    alternativeSpellings: ["a", "au", "er", "ear"],
  },
  {
    symbol: "/û/",
    type: "r_controlled" as const,
    description: "bird",
    commonSpellings: ["ir"],
    alternativeSpellings: ["er", "ur", "ear", "or", "our", "yr"],
  },
  {
    symbol: "/ô/",
    type: "r_controlled" as const,
    description: "paw",
    commonSpellings: ["aw"],
    alternativeSpellings: [
      "a",
      "or",
      "oor",
      "ore",
      "oar",
      "our",
      "augh",
      "ar",
      "ough",
      "au",
    ],
  },
  {
    symbol: "/ēә/",
    type: "r_controlled" as const,
    description: "ear",
    commonSpellings: ["ear"],
    alternativeSpellings: ["eer", "ere", "ier"],
  },
  {
    symbol: "/üә/",
    type: "r_controlled" as const,
    description: "cure",
    commonSpellings: ["ure"],
    alternativeSpellings: ["our"],
  },
  {
    symbol: "/oi/",
    type: "long_vowel" as const,
    description: "coin",
    commonSpellings: ["oi"],
    alternativeSpellings: ["oy", "uoy"],
  },
  {
    symbol: "/ow/",
    type: "long_vowel" as const,
    description: "cow",
    commonSpellings: ["ow"],
    alternativeSpellings: ["ou", "ough"],
  },
  {
    symbol: "/ә/",
    type: "short_vowel" as const,
    description: "schwa (ladder)",
    commonSpellings: ["er"],
    alternativeSpellings: ["ar", "our", "or", "i", "e", "u", "ur", "re", "eur"],
  },
];

export async function seedPhonemes() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);

  try {
    console.log("🌱 Iniciando seed de los 44 fonemas del inglés...");

    // Verificar que las tablas existan usando SQL directo
    try {
      await expoDb.execAsync(`
        CREATE TABLE IF NOT EXISTS phonemes (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          symbol TEXT NOT NULL UNIQUE,
          type TEXT NOT NULL CHECK(type IN ('consonant', 'short_vowel', 'long_vowel', 'r_controlled', 'digraph')),
          description TEXT
        );
        
        CREATE TABLE IF NOT EXISTS graphemes (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          letters TEXT NOT NULL,
          is_common INTEGER DEFAULT 0 NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS grapheme_phonemes (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          grapheme_id INTEGER NOT NULL,
          phoneme_id INTEGER NOT NULL,
          FOREIGN KEY (grapheme_id) REFERENCES graphemes(id) ON DELETE CASCADE,
          FOREIGN KEY (phoneme_id) REFERENCES phonemes(id) ON DELETE CASCADE
        );
      `);
      console.log("✓ Tablas verificadas/creadas");
    } catch (tableError) {
      console.error("Error al crear/verificar tablas:", tableError);
      throw new Error("No se pudieron crear las tablas. Reinicia la app.");
    }

    // Verificar si ya hay datos
    let existingPhonemes;
    try {
      existingPhonemes = await db.select().from(phonemes).limit(1);
    } catch (selectError) {
      console.error("Error al verificar datos existentes:", selectError);
      // Si falla el select, asumir que no hay datos y continuar
      existingPhonemes = [];
    }

    if (existingPhonemes.length > 0) {
      console.log("⚠️ La base de datos ya contiene fonemas. Saltando seed.");
      return;
    }

    // Agrupar fonemas duplicados (como /th/ voiced y unvoiced)
    const processedSymbols = new Set<string>();

    for (const phonemeData of ENGLISH_PHONEMES) {
      let insertedPhoneme;

      // Si el símbolo ya fue procesado, buscar el fonema existente
      if (processedSymbols.has(phonemeData.symbol)) {
        const existing = await db
          .select()
          .from(phonemes)
          .where(eq(phonemes.symbol, phonemeData.symbol))
          .limit(1);

        if (existing.length > 0) {
          insertedPhoneme = existing[0];
        }
      } else {
        // Insertar nuevo fonema
        [insertedPhoneme] = await db
          .insert(phonemes)
          .values({
            symbol: phonemeData.symbol,
            type: phonemeData.type,
            description: phonemeData.description,
          })
          .returning();

        processedSymbols.add(phonemeData.symbol);
        console.log(`✓ Fonema ${phonemeData.symbol} insertado`);
      }

      if (!insertedPhoneme) continue;

      // 2. Insertar graphemes comunes
      for (const letters of phonemeData.commonSpellings) {
        const [insertedGrapheme] = await db
          .insert(graphemes)
          .values({
            letters,
            isCommon: true,
          })
          .returning();

        // 3. Crear relación grapheme-phoneme
        await db.insert(graphemePhonemes).values({
          graphemeId: insertedGrapheme.id,
          phonemeId: insertedPhoneme.id,
        });
      }

      // 4. Insertar graphemes alternativos
      for (const letters of phonemeData.alternativeSpellings) {
        const [insertedGrapheme] = await db
          .insert(graphemes)
          .values({
            letters,
            isCommon: false,
          })
          .returning();

        await db.insert(graphemePhonemes).values({
          graphemeId: insertedGrapheme.id,
          phonemeId: insertedPhoneme.id,
        });
      }
    }
  } catch (error) {
    console.error("❌ Error al insertar fonemas:", error);
    throw error;
  }
}
