import { useSpeech } from "@/features/speech/hooks/useSpeech";
import {
  Grapheme,
  useWordPractice,
} from "@/features/words/hooks/useWordPractice";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function WordPracticeStep2Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { speak } = useSpeech();
  const { word, isLoading } = useWordPractice(parseInt(id || "0"));
  const [playingGrapheme, setPlayingGrapheme] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const handlePlayGrapheme = async (grapheme: Grapheme) => {
    setPlayingGrapheme(grapheme.id);
    try {
      await speak(grapheme.phonemeSymbol);
    } catch (error) {
      console.error("Error al reproducir sonido:", error);
    } finally {
      setPlayingGrapheme(null);
    }
  };

  const handlePlayAllSounds = async () => {
    if (!word) return;

    setIsPlayingAll(true);
    try {
      for (const grapheme of word.graphemes) {
        await speak(grapheme.phonemeSymbol);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error("Error al reproducir todos los sonidos:", error);
    } finally {
      setIsPlayingAll(false);
    }
  };

  const handlePrevious = () => {
    router.back();
  };

  const handleNext = () => {
    router.push(`/words/practice/${id}/step3`);
  };

  if (isLoading) {
    return (
      <Layout className="flex-1 justify-center items-center">
        <Text category="h6">Cargando palabra...</Text>
      </Layout>
    );
  }

  if (!word) {
    return (
      <Layout className="flex-1 justify-center items-center p-6">
        <Text category="h6" status="danger">
          Palabra no encontrada
        </Text>
        <Button className="mt-4" onPress={() => router.back()}>
          Volver
        </Button>
      </Layout>
    );
  }

  return (
    <Layout className="flex-1 p-6 gap-6">
      <Card>
        <View className="flex items-center gap-6">
          <Text category="h4" className="text-center">
            Escucha los sonidos
          </Text>

          <Text category="h6" className="text-center">
            La palabra tiene {word.graphemes.length} letras:
          </Text>

          <View className="flex flex-row flex-wrap justify-center gap-2">
            {word.graphemes.map((grapheme: Grapheme, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePlayGrapheme(grapheme)}
                disabled={playingGrapheme === grapheme.id}
                style={{
                  backgroundColor: grapheme.color,
                  borderWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 12,
                  borderRadius: 12,
                  width: 80,
                  height: 80,
                }}
              >
                <Text category="h4" className="text-white font-bold">
                  {grapheme.letters}
                </Text>

                <Text category="c1" className="text-white text-center">
                  {grapheme.phonemeSymbol}
                </Text>

                {grapheme.phonemeSymbol === "/?/" && (
                  <Text category="c2" className="text-white text-center">
                    silenciosa
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button
            onPress={handlePlayAllSounds}
            disabled={isPlayingAll}
            accessoryRight={(props) => <Icon {...props} name="volume-up" />}
          >
            {isPlayingAll ? "Reproduciendo..." : "Escuchar todos los sonidos"}
          </Button>
        </View>
      </Card>
      <View className="flex-row gap-4">
        <Button
          className="flex-1"
          appearance="outline"
          status="basic"
          onPress={handlePrevious}
          accessoryLeft={(props) => <Icon {...props} name="arrow-back" />}
        >
          Anterior
        </Button>

        <Button
          className="flex-1"
          status="primary"
          onPress={handleNext}
          accessoryRight={(props) => <Icon {...props} name="arrow-forward" />}
        >
          Siguiente
        </Button>
      </View>
    </Layout>
  );
}
