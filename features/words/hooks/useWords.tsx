import * as schema from "@/db/schema";
import { graphemes, wordGraphemes, words, type NewWord } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";

interface DetectedGrapheme {
  letters: string;
  phonemeId: number;
  position: number;
  color: string;
}

interface AddWordData {
  word: string;
  definition: string;
  imageUrl?: string;
  detectedGraphemes: DetectedGrapheme[];
}

export const useWords = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [isLoading, setIsLoading] = useState(false);

  const { data: wordsData } = useLiveQuery(drizzleDb.query.words.findMany());

  const addWord = async (data: AddWordData) => {
    setIsLoading(true);

    try {
      // 1. Insertar la palabra
      const newWord: NewWord = {
        word: data.word.trim(),
        definition: data.definition.trim(),
        imageUrl: data.imageUrl || null,
        createdAt: new Date(),
      };

      const [insertedWord] = await drizzleDb
        .insert(words)
        .values(newWord)
        .returning();

      // 2. Para cada grapheme detectado, buscar o crear el grapheme en la BD
      if (data.detectedGraphemes.length > 0) {
        for (const detectedGrapheme of data.detectedGraphemes) {
          let graphemeId: number;

          // Buscar si el grapheme ya existe
          const existingGrapheme = await drizzleDb.query.graphemes.findFirst({
            where: eq(graphemes.letters, detectedGrapheme.letters),
          });

          if (existingGrapheme) {
            graphemeId = existingGrapheme.id;
          } else {
            // Si no existe, crear el grapheme
            const [newGrapheme] = await drizzleDb
              .insert(graphemes)
              .values({
                letters: detectedGrapheme.letters,
                isCommon: true, // Asumimos que es común si viene de detección
              })
              .returning();

            graphemeId = newGrapheme.id;
          }

          // 3. Crear la relación word_grapheme
          await drizzleDb.insert(wordGraphemes).values({
            wordId: insertedWord.id,
            graphemeId,
            position: detectedGrapheme.position,
            color: detectedGrapheme.color,
          });
        }
      }

      return {
        success: true,
        wordId: insertedWord.id,
      };
    } catch (error) {
      console.error("Error al guardar palabra:", error);
      return {
        success: false,
        error: "Error al guardar la palabra",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    wordsData,
    addWord,
    isLoading,
  };
};
