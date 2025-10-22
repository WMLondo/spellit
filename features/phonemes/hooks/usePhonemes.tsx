import * as schema from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";

export const usePhonemes = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  const { data: phonemesData } = useLiveQuery(
    drizzleDb.query.phonemes.findMany(),
  );

  return {
    phonemesData,
  };
};
