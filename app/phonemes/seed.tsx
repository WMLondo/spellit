import { seedPhonemes } from "@/scripts/seed-phonemes";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function SeedPhonemesScreen() {
  const db = useSQLiteContext();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setMessage("");
    setSuccess(null);

    try {
      await seedPhonemes();
      setMessage(
        "✅ Los 44 fonemas del inglés han sido insertados correctamente",
      );
      setSuccess(true);
    } catch (error: any) {
      console.error("Error en seed:", error);

      let errorMessage = "❌ Error al insertar fonemas. ";

      if (error.message && error.message.includes("Reinicia la app")) {
        errorMessage +=
          "Las tablas no existen. Por favor:\n\n1. Ve a Settings\n2. Presiona 'Reiniciar Base de Datos'\n3. Reinicia la app\n4. Vuelve aquí e intenta de nuevo";
      } else if (error.message && error.message.includes("contiene fonemas")) {
        errorMessage =
          "⚠️ La base de datos ya contiene fonemas. Usa 'Limpiar' si quieres reiniciar.";
      } else {
        errorMessage += `\n\nDetalles: ${error.message || error}`;
      }

      setMessage(errorMessage);
      setSuccess(false);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    setMessage("");
    setSuccess(null);

    try {
      await db.execAsync(`
        DELETE FROM grapheme_phonemes;
        DELETE FROM graphemes;
        DELETE FROM phonemes;
      `);

      setMessage("🗑️ Base de datos de fonemas limpiada correctamente");
      setSuccess(true);
    } catch (error: any) {
      console.error("Error al limpiar:", error);

      // Si falla, intentar con DROP
      try {
        await db.execAsync(`
          DROP TABLE IF EXISTS grapheme_phonemes;
          DROP TABLE IF EXISTS graphemes;
          DROP TABLE IF EXISTS phonemes;
        `);
        setMessage(
          "🗑️ Tablas eliminadas. Presiona 'Ejecutar Seed' para recrearlas.",
        );
        setSuccess(true);
      } catch (dropError: any) {
        console.error("Error al eliminar tablas:", dropError);
        setMessage(
          `❌ Error al limpiar: ${error.message || error}\n\nIntenta reiniciar la app desde Settings.`,
        );
        setSuccess(false);
      }
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Layout className="flex-1">
      <ScrollView className="flex-1">
        <View className="p-6 gap-6">
          <View className="gap-2">
            <Text category="h4">Seed de Fonemas</Text>
            <Text category="s1" appearance="hint">
              Insertar los 44 fonemas del inglés en la base de datos
            </Text>
          </View>

          <Card>
            <View className="gap-4">
              <View className="gap-2">
                <Text category="h6">¿Qué hace este proceso?</Text>
                <Text category="s2">
                  • Inserta los 44 fonemas del inglés estándar
                </Text>
                <Text category="s2">
                  • Incluye consonantes, vocales, r-controlled y digraphs
                </Text>
                <Text category="s2">
                  • Cada fonema con sus spellings comunes y alternativos
                </Text>
                <Text category="s2">
                  • Basado en el International Phonetic Alphabet (IPA)
                </Text>
                <Text category="s2">
                  • Fuente: Reading Rockets Educational Foundation
                </Text>
              </View>

              <View className="gap-2 mt-2">
                <Text category="label" status="warning">
                  ⚠️ Advertencia
                </Text>
                <Text category="s2" appearance="hint">
                  Este proceso puede tomar unos segundos. Solo necesitas
                  ejecutarlo una vez para poblar la base de datos.
                </Text>
              </View>
            </View>
          </Card>

          <View className="gap-3">
            <Button
              onPress={handleSeed}
              disabled={isSeeding || isClearing}
              status="primary"
              size="large"
            >
              {isSeeding ? "🔄 Insertando fonemas..." : "Ejecutar Seed"}
            </Button>

            <Button
              onPress={handleClear}
              disabled={isSeeding || isClearing}
              status="danger"
              appearance="outline"
              size="large"
            >
              {isClearing ? "🔄 Limpiando..." : "Limpiar Base de Datos"}
            </Button>
          </View>

          {message && (
            <Card status={success ? "success" : "danger"}>
              <Text category="s1">{message}</Text>
            </Card>
          )}

          <Card>
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Text>📚</Text>
                <Text category="h6">Ejemplos de Fonemas</Text>
              </View>
              <View className="gap-2">
                <Text category="s2">
                  • /b/ → &quot;b&quot; (ball), &quot;bb&quot; (ribbon)
                </Text>
                <Text category="s2">
                  • /f/ → &quot;f&quot; (fan), &quot;ff&quot; (cliff),
                  &quot;ph&quot; (phone), &quot;gh&quot; (laugh)
                </Text>
                <Text category="s2">
                  • /s/ → &quot;s&quot; (sun), &quot;ss&quot; (mess),
                  &quot;c&quot; (circus), &quot;ce&quot; (rice)
                </Text>
                <Text category="s2">
                  • /ā/ → &quot;ai&quot; (snail), &quot;ay&quot; (day),
                  &quot;a-e&quot; (cake)
                </Text>
                <Text category="s2">
                  • /ch/ → &quot;ch&quot; (cheese), &quot;tch&quot; (watch),
                  &quot;tu&quot; (future)
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Layout>
  );
}
