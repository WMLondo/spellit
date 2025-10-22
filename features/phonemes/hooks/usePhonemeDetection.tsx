import * as schema from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

interface DetectedGrapheme {
  letters: string;
  phonemeId: number;
  phonemeSymbol: string;
  position: number;
  isCommon: boolean;
}

export const usePhonemeDetection = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  // Obtener todos los graphemes con sus fonemas
  const { data: allGraphemes } = useLiveQuery(
    drizzleDb.query.graphemes.findMany({
      with: {
        graphemePhonemes: {
          with: {
            phoneme: true,
          },
        },
      },
    }),
  );

  // Mapa de graphemes organizados por longitud (más largos primero)
  const graphemeMap = useMemo(() => {
    if (!allGraphemes) return new Map<string, any[]>();

    const map = new Map<string, any[]>();

    allGraphemes.forEach((grapheme) => {
      const key = grapheme.letters.toLowerCase();
      if (!map.has(key)) {
        map.set(key, []);
      }

      // Crear entradas para cada fonema del grapheme
      grapheme.graphemePhonemes.forEach((gp) => {
        map.get(key)!.push({
          id: grapheme.id,
          letters: grapheme.letters,
          isCommon: grapheme.isCommon,
          phonemeId: gp.phoneme.id,
          phonemeSymbol: gp.phoneme.symbol,
        });
      });
    });

    return map;
  }, [allGraphemes]);

  /**
   * Detecta automáticamente los graphemes de una palabra
   * Usa un algoritmo greedy que prioriza:
   * 1. Graphemes más largos primero
   * 2. Graphemes comunes sobre alternativos
   */
  const detectGraphemes = (word: string): DetectedGrapheme[] => {
    if (!word || !allGraphemes || allGraphemes.length === 0) {
      return [];
    }

    const normalizedWord = word.toLowerCase();
    const result: DetectedGrapheme[] = [];
    let position = 0;
    let i = 0;

    while (i < normalizedWord.length) {
      let found = false;

      // Intentar encontrar el grapheme más largo posible desde la posición actual
      // Empezar con longitud 4 (el más largo común es "ough", "augh", etc.)
      for (let len = Math.min(4, normalizedWord.length - i); len > 0; len--) {
        const substring = normalizedWord.substring(i, i + len);
        const matches = graphemeMap.get(substring);

        if (matches && matches.length > 0) {
          // Priorizar graphemes comunes
          const commonMatch = matches.find((m) => m.isCommon);
          const selectedMatch = commonMatch || matches[0];

          result.push({
            letters: substring,
            phonemeId: selectedMatch.phonemeId,
            phonemeSymbol: selectedMatch.phonemeSymbol,
            position,
            isCommon: selectedMatch.isCommon,
          });

          i += len;
          position++;
          found = true;
          break;
        }
      }

      // Si no se encontró ningún grapheme, tratar la letra como un grapheme individual
      if (!found) {
        const singleLetter = normalizedWord[i];
        const matches = graphemeMap.get(singleLetter);

        if (matches && matches.length > 0) {
          const commonMatch = matches.find((m) => m.isCommon);
          const selectedMatch = commonMatch || matches[0];

          result.push({
            letters: singleLetter,
            phonemeId: selectedMatch.phonemeId,
            phonemeSymbol: selectedMatch.phonemeSymbol,
            position,
            isCommon: selectedMatch.isCommon,
          });
        } else {
          // Letra no reconocida, agregar como desconocida
          result.push({
            letters: singleLetter,
            phonemeId: -1, // ID inválido para indicar desconocido
            phonemeSymbol: "/?/",
            position,
            isCommon: false,
          });
        }

        i++;
        position++;
      }
    }

    return result;
  };

  /**
   * Obtiene sugerencias alternativas de graphemes para una palabra
   */
  const getAlternativeGraphemes = (
    word: string,
  ): { original: DetectedGrapheme[]; alternatives: DetectedGrapheme[][] }[] => {
    // TODO: Implementar lógica para sugerencias alternativas
    // Por ejemplo, para "night", podría sugerir diferentes formas de dividir:
    // n-igh-t vs ni-gh-t
    return [];
  };

  return {
    detectGraphemes,
    getAlternativeGraphemes,
    isReady: !!allGraphemes && allGraphemes.length > 0,
  };
};
