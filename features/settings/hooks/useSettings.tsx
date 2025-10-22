import * as schema from "@/db/schema";
import {
  graphemePhonemes,
  phonemes,
  settings,
  wordGraphemes,
  words,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

const SETTINGS_KEYS = {
  CHILD_NAME: "childName",
  VOICE_ID: "voiceId",
  LANGUAGE: "language",
} as const;

export const useSettings = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { data: childName } = useLiveQuery(
    drizzleDb.query.settings.findFirst({
      where: eq(settings.name, SETTINGS_KEYS.CHILD_NAME),
    }),
  );

  const { data: voiceId } = useLiveQuery(
    drizzleDb.query.settings.findFirst({
      where: eq(settings.name, SETTINGS_KEYS.VOICE_ID),
    }),
  );

  const { data: language } = useLiveQuery(
    drizzleDb.query.settings.findFirst({
      where: eq(settings.name, SETTINGS_KEYS.LANGUAGE),
    }),
  );

  const getAllSettings = async () => {
    return await drizzleDb.query.settings.findMany();
  };

  const getSettingValue = async (name: string) => {
    return await drizzleDb.query.settings.findFirst({
      where: eq(settings.name, name),
    });
  };

  const updateSettings = async (newSettings: Record<string, string>) => {
    for (const [name, value] of Object.entries(newSettings)) {
      if (!value) continue;

      const existing = await getSettingValue(name);

      if (existing) {
        await drizzleDb
          .update(settings)
          .set({ value, type: "string" })
          .where(eq(settings.name, name));
      } else {
        await drizzleDb
          .insert(settings)
          .values({ name, value, type: "string" });
      }
    }
  };

  const cleanDatabase = async () => {
    await drizzleDb.delete(wordGraphemes);
    await drizzleDb.delete(graphemePhonemes);
    await drizzleDb.delete(phonemes);
    await drizzleDb.delete(words);
  };

  return {
    childName: childName?.value,
    voiceId: voiceId?.value,
    language: language?.value,
    updateSettings,
    cleanDatabase,
    getAllSettings,
  };
};
