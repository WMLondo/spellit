import { VoiceSelect } from "@/features/settings/components/VoiceSelect";
import { useSettings } from "@/features/settings/hooks/useSettings";
import {
  languageEnum,
  settingsSchema,
  type SettingsFormData,
} from "@/features/settings/schemas/settings.schema";
import { capitalize } from "@/features/shared/utils/capitalize";
import { useSpeech } from "@/features/speech/hooks/useSpeech";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";

const LANGUAGE_LABELS: Record<string, string> = {
  "en-US": "Inglés (US)",
  "es-ES": "Español (ES)",
};

export default function SettingsScreen() {
  const router = useRouter();
  const { childName, language, voiceId, updateSettings, cleanDatabase } =
    useSettings();
  const { voices, speak } = useSpeech();
  const [isResetting, setIsResetting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    values: {
      childName: childName ?? "",
      language: language as "en-US" | "es-ES",
      voiceId: voiceId,
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    const formattedName = capitalize(data.childName.trim());
    const updates: Record<string, string> = {
      childName: formattedName,
      language: data.language,
    };

    if (data.voiceId) {
      updates.voiceId = data.voiceId;
    }

    await updateSettings(updates);
    router.back();
  };

  const handleResetDatabase = () => {
    Alert.alert(
      "⚠️ Reiniciar Base de Datos",
      "Esto eliminará TODAS las palabras y fonemas. Esta acción no se puede deshacer. ¿Estás seguro?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar Todo",
          style: "destructive",
          onPress: async () => {
            setIsResetting(true);
            try {
              await cleanDatabase();

              Alert.alert(
                "✅ Completado",
                "Base de datos reiniciada. Navega a Phonemes Seed para volver a inicializar.",
              );
            } catch (error) {
              Alert.alert("Error al reiniciar:", error as string);
            } finally {
              setIsResetting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Layout className="flex-1">
      <ScrollView className="flex-1">
        <View className="p-6 gap-6">
          <Text category="h5">Perfil</Text>

          <Card>
            <View className="gap-4">
              <Controller
                control={control}
                name="childName"
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <View className="gap-2">
                    <Text category="label">Nombre del niño</Text>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Tu nombre"
                      status={errors.childName ? "danger" : "basic"}
                      caption={errors.childName?.message}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="language"
                render={({ field: { onChange, value } }) => {
                  const selectedIndex = new IndexPath(
                    languageEnum.indexOf(value as "en-US" | "es-ES"),
                  );

                  return (
                    <View className="gap-2">
                      <Text category="label">Idioma</Text>
                      <Select
                        selectedIndex={selectedIndex}
                        value={LANGUAGE_LABELS[value]}
                        onSelect={(index) => {
                          const selectedLang =
                            languageEnum[(index as IndexPath).row];
                          onChange(selectedLang);
                        }}
                      >
                        {languageEnum.map((lang) => (
                          <SelectItem
                            key={lang}
                            title={LANGUAGE_LABELS[lang]}
                          />
                        ))}
                      </Select>
                    </View>
                  );
                }}
              />

              <Controller
                control={control}
                name="voiceId"
                render={({ field: { onChange, value } }) => (
                  <VoiceSelect
                    value={value}
                    onChange={onChange}
                    voices={voices}
                    speak={speak}
                    childName={childName}
                  />
                )}
              />
            </View>
          </Card>

          <Button onPress={handleSubmit(onSubmit)}>Guardar cambios</Button>

          {/* Sección de Base de Datos */}
          <View className="gap-2 mt-4">
            <Text category="h5">Base de Datos</Text>
            <Text category="s2" appearance="hint">
              Gestiona los fonemas y datos de la aplicación
            </Text>
          </View>

          <Card>
            <View className="gap-3">
              <Button
                appearance="outline"
                status="info"
                onPress={() => router.push("/phonemes/seed")}
              >
                Ir a Phonemes Seed
              </Button>

              <Button
                appearance="outline"
                status="danger"
                onPress={handleResetDatabase}
                disabled={isResetting}
              >
                {isResetting
                  ? "🔄 Reiniciando..."
                  : "🗑️ Reiniciar Base de Datos"}
              </Button>

              <View className="gap-2 mt-2">
                <Text category="c1" appearance="hint">
                  ⚠️ Usar &quot;Reiniciar Base de Datos&quot; solo si necesitas
                  empezar desde cero. Eliminará todas las palabras y fonemas.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Layout>
  );
}
