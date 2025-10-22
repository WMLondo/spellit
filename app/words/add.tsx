import { usePhonemeDetection } from "@/features/phonemes/hooks/usePhonemeDetection";
import { PHONEME_COLORS } from "@/features/words/constants/colors";
import { useWords } from "@/features/words/hooks/useWords";
import { Button, Card, Input, Layout, Text } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface DetectedGrapheme {
  letters: string;
  phonemeId: number;
  phonemeSymbol: string;
  position: number;
  isCommon: boolean;
  color: string;
}

export default function AddWordScreen() {
  const router = useRouter();
  const { addWord, isLoading } = useWords();
  const { detectGraphemes, isReady } = usePhonemeDetection();

  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [detectedGraphemes, setDetectedGraphemes] = useState<
    DetectedGrapheme[]
  >([]);
  const [errors, setErrors] = useState<{
    word?: string;
    definition?: string;
    graphemes?: string;
  }>({});

  // Detectar graphemes automáticamente cuando cambia la palabra
  useEffect(() => {
    if (word && isReady) {
      const detected = detectGraphemes(word);

      // Asignar colores a los graphemes detectados
      const graphemesWithColors = detected.map((g, idx) => ({
        ...g,
        color: PHONEME_COLORS[idx % PHONEME_COLORS.length].value,
      }));

      setDetectedGraphemes(graphemesWithColors);
    } else {
      setDetectedGraphemes([]);
    }
  }, [word, isReady, detectGraphemes]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validaciones
    const newErrors: typeof errors = {};

    if (!word.trim()) {
      newErrors.word = "La palabra es requerida";
    }
    if (!definition.trim()) {
      newErrors.definition = "El significado es requerido";
    }
    if (detectedGraphemes.length === 0) {
      newErrors.graphemes = "Debe agregar al menos un grapheme";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Guardar palabra
    const result = await addWord({
      word: word.trim(),
      definition: definition.trim(),
      imageUrl: imageUrl || undefined,
      detectedGraphemes: detectedGraphemes.map((g) => ({
        letters: g.letters,
        phonemeId: g.phonemeId,
        position: g.position,
        color: g.color,
      })),
    });

    if (result?.success) {
      router.back();
    }
  };

  const handleChangeColor = (index: number, newColor: string) => {
    const updated = [...detectedGraphemes];
    updated[index].color = newColor;
    setDetectedGraphemes(updated);
  };

  const isFormValid =
    word.trim() && definition.trim() && detectedGraphemes.length > 0;

  return (
    <Layout className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 gap-6">
          <Text category="h5">Información Básica</Text>

          <Card>
            <View className="gap-4">
              {/* Palabra */}
              <View className="gap-2">
                <Text category="label">Palabra *</Text>
                <Input
                  value={word}
                  onChangeText={setWord}
                  placeholder="Ej: plane"
                  status={errors.word ? "danger" : "basic"}
                  caption={errors.word}
                  autoCapitalize="none"
                />
              </View>

              {/* Significado */}
              <View className="gap-2">
                <Text category="label">Significado *</Text>
                <Input
                  value={definition}
                  onChangeText={setDefinition}
                  placeholder="Ej: Un avión que vuela en el cielo"
                  multiline
                  numberOfLines={3}
                  status={errors.definition ? "danger" : "basic"}
                  caption={errors.definition}
                />
              </View>

              {/* Imagen */}
              <View className="gap-2">
                <Text category="label">Imagen</Text>
                {imageUrl ? (
                  <View className="relative">
                    <Image
                      source={{ uri: imageUrl }}
                      className="w-full h-48 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={pickImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-2"
                    >
                      <Text>Cambiar</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
                  >
                    <Text category="s1" appearance="hint">
                      Haz clic para agregar una imagen aquí
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>

          {/* Graphemes Detectados */}
          <Text category="h5">Fonemas Detectados</Text>

          <Card>
            <View className="gap-4">
              {!isReady ? (
                <View className="gap-3">
                  <Text category="s1" status="warning">
                    ⚠️ Base de datos de fonemas no inicializada
                  </Text>
                  <Text category="s2" appearance="hint">
                    Debes ejecutar el seed de fonemas primero. Ve a la pantalla
                    de Phonemes Seed y ejecuta el proceso.
                  </Text>
                  <Button
                    appearance="outline"
                    status="info"
                    onPress={() => router.push("/phonemes/seed")}
                  >
                    Ir a Phonemes Seed
                  </Button>
                </View>
              ) : detectedGraphemes.length === 0 ? (
                <Text category="s2" appearance="hint">
                  {word
                    ? "No se detectaron graphemes para esta palabra"
                    : "Escribe una palabra para detectar sus fonemas automáticamente"}
                </Text>
              ) : (
                <>
                  <View className="flex-row flex-wrap gap-2">
                    {detectedGraphemes.map((grapheme, idx) => (
                      <View
                        key={`${grapheme.letters}-${idx}`}
                        style={[
                          styles.graphemeChip,
                          { backgroundColor: grapheme.color },
                          grapheme.phonemeId === -1 && styles.unknownGrapheme,
                        ]}
                      >
                        <Text category="h6" style={styles.graphemeText}>
                          {grapheme.letters}
                        </Text>
                        <Text category="c1" style={styles.phonemeSymbol}>
                          {grapheme.phonemeSymbol}
                        </Text>
                        {!grapheme.isCommon && (
                          <View style={styles.alternativeBadge} />
                        )}
                      </View>
                    ))}
                  </View>

                  {/* Selector de colores */}
                  <View className="gap-2">
                    <Text category="label">
                      Cambiar colores (toca un grapheme):
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {PHONEME_COLORS.map((color) => (
                        <TouchableOpacity
                          key={color.value}
                          style={[
                            styles.colorButton,
                            { backgroundColor: color.value },
                          ]}
                          onPress={() => {
                            if (detectedGraphemes.length > 0) {
                              handleChangeColor(0, color.value);
                            }
                          }}
                        />
                      ))}
                    </View>
                  </View>
                </>
              )}

              {errors.graphemes && (
                <Text category="c1" status="danger">
                  {errors.graphemes}
                </Text>
              )}
            </View>
          </Card>

          {/* Botón Guardar */}
          <Button
            className="w-full"
            status="success"
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading || !isReady}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Guardar Palabra"
            )}
          </Button>

          {!isFormValid && (
            <Text category="c1" status="danger" className="text-center">
              *Completa la palabra, significado y asegúrate de que se detecten
              fonemas
            </Text>
          )}

          {/* Ayuda */}
          <Card>
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Text>💡</Text>
                <Text category="h6">Cómo funciona</Text>
              </View>
              <View className="gap-2">
                <Text category="s2">
                  • Los fonemas se detectan automáticamente al escribir
                </Text>
                <Text category="s2">
                  • Un punto naranja indica un spelling alternativo
                </Text>
                <Text category="s2">
                  • Borde rojo indica un grapheme no reconocido
                </Text>
                <Text category="s2">
                  • Los colores ayudan a distinguir los sonidos
                </Text>
                <Text category="s2">
                  • Basado en los 44 fonemas del inglés estándar
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  graphemeChip: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  unknownGrapheme: {
    borderWidth: 2,
    borderColor: "#FF0000",
  },
  graphemeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  phonemeSymbol: {
    fontSize: 10,
    marginTop: -2,
  },
  alternativeBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "orange",
    borderRadius: 6,
    width: 12,
    height: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
