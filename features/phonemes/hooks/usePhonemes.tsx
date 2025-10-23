import * as schema from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

export const usePhonemes = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { data: phonemesData } = useLiveQuery(
    drizzleDb.query.phonemes.findMany(),
  );

  return {
    phonemesData,
  };
};
