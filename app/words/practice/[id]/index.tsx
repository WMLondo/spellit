import { capitalize } from "@/features/shared/utils/capitalize";
import { useSpeech } from "@/features/speech/hooks/useSpeech";
import { useWordPractice } from "@/features/words/hooks/useWordPractice";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, View } from "react-native";

export default function WordPracticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { speak } = useSpeech();
  const { word, isLoading } = useWordPractice(parseInt(id || "0"));
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = async () => {
    if (!word) return;

    setIsPlaying(true);
    try {
      await speak(word.word);
    } catch (error) {
      console.error("Error al reproducir audio:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    router.back();
  };

  const handleNext = () => {
    router.push(`/words/practice/${id}/step2`);
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
      <Card className="p-6">
        <View className="items-center gap-6">
          <Text category="h4" className="text-center">
            Mira la palabra
          </Text>
          <Image
            source={{ uri: word.imageUrl ?? "" }}
            className="w-full h-48 rounded-lg"
          />
          <Text category="h2" className="font-bold text-center">
            {capitalize(word.word)}
          </Text>
          <Text category="s1">{word.definition}</Text>
          <Button
            style={{ borderRadius: 9999, width: 32, height: 32 }}
            accessoryLeft={(props) => <Icon {...props} name="volume-up" />}
            onPress={handlePlayAudio}
            disabled={isPlaying}
          />
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
