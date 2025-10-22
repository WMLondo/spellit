import * as schema from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";

export interface Grapheme {
  id: number;
  letters: string;
  position: number;
  color: string;
  phonemeSymbol: string;
  phonemeDescription: string;
}

interface WordWithGraphemes {
  id: number;
  word: string;
  definition: string;
  imageUrl: string | null;
  createdAt: Date;
  graphemes: Grapheme[];
}

export const useWordPractice = (wordId: number) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  const { data: wordData } = useLiveQuery(
    drizzleDb.query.words.findFirst({
      where: (words, { eq }) => eq(words.id, wordId),
      with: {
        wordGraphemes: {
          with: {
            grapheme: {
              with: {
                graphemePhonemes: {
                  with: {
                    phoneme: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  );

  // Procesar los datos para agrupar graphemes por palabra
  const processedWord: WordWithGraphemes | null = wordData
    ? {
        id: wordData.id,
        word: wordData.word,
        definition: wordData.definition,
        imageUrl: wordData.imageUrl,
        createdAt: wordData.createdAt,
        graphemes: wordData.wordGraphemes
          .map((wg) => ({
            id: wg.id,
            letters: wg.grapheme.letters,
            position: wg.position,
            color: wg.color,
            phonemeSymbol:
              wg.grapheme.graphemePhonemes[0]?.phoneme.symbol || "/?/",
            phonemeDescription:
              wg.grapheme.graphemePhonemes[0]?.phoneme.description ||
              "desconocido",
          }))
          .sort((a, b) => a.position - b.position),
      }
    : null;

  return {
    word: processedWord,
    isLoading: !wordData,
  };
};
