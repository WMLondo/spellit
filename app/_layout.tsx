import { SettingsButton } from "@/features/shared/layout/settings-button";

import migrations from "@/drizzle/migrations";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import "../global.css";

export const DATABASE_NAME = "spellit";

export default function RootLayout() {
  const expo = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expo);
  useDrizzleStudio(expo);
  useMigrations(db, migrations);
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <StatusBar barStyle={"dark-content"} />
      <IconRegistry icons={EvaIconsPack} />
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <ApplicationProvider {...eva} theme={eva.light}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: "SpellIt",
                headerRight: () => <SettingsButton />,
                headerTitleStyle: {
                  fontSize: 20,
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="settings/index"
              options={{ title: "Ajustes" }}
            />
            <Stack.Screen
              name="words/add"
              options={{ title: "Agregar Palabra" }}
            />
            <Stack.Screen
              name="phonemes/seed"
              options={{ title: "Seed de Fonemas" }}
            />
            <Stack.Screen
              name="words/practice/[id]/index"
              options={{ title: "Práctica" }}
            />
            <Stack.Screen
              name="words/practice/[id]/step2"
              options={{ title: "Escucha los sonidos" }}
            />
            <Stack.Screen
              name="words/practice/[id]/step3"
              options={{ title: "Arrastra las letras" }}
            />
            <Stack.Screen
              name="words/practice/[id]/step4"
              options={{ title: "Escribe la palabra" }}
            />
          </Stack>
        </ApplicationProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
