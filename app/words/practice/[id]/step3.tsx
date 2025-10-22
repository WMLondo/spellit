import { useSpeech } from "@/features/speech/hooks/useSpeech";
import { useWordPractice } from "@/features/words/hooks/useWordPractice";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";

interface DraggedLetter {
  id: string;
  letter: string;
  color: string;
  position: number;
  isPlaced: boolean;
}

export default function WordPracticeStep3Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { speak } = useSpeech();
  const { word, isLoading } = useWordPractice(parseInt(id || "0"));
  const [draggedLetters, setDraggedLetters] = useState<DraggedLetter[]>([]);
  const [placedLetters, setPlacedLetters] = useState<(DraggedLetter | null)[]>(
    [],
  );

  useEffect(() => {
    if (word && word.graphemes.length > 0) {
      const letters = word.graphemes.map((grapheme, index) => ({
        id: `letter-${index}`,
        letter: grapheme.letters,
        color: grapheme.color,
        position: grapheme.position,
        isPlaced: false,
      }));
      setDraggedLetters(letters);
      setPlacedLetters(new Array(word.graphemes.length).fill(null));
    }
  }, [word]);

  const handlePlaySound = async (letter: string) => {
    try {
      await speak(letter);
    } catch (error) {
      console.error("Error al reproducir sonido:", error);
    }
  };

  const handleLetterPress = (letter: DraggedLetter) => {
    if (letter.isPlaced) return;

    const emptyIndex = placedLetters.findIndex((slot) => slot === null);
    if (emptyIndex === -1) return;

    const newPlacedLetters = [...placedLetters];
    newPlacedLetters[emptyIndex] = letter;

    const newDraggedLetters = draggedLetters.map((l) =>
      l.id === letter.id ? { ...l, isPlaced: true } : l,
    );

    setPlacedLetters(newPlacedLetters);
    setDraggedLetters(newDraggedLetters);

    handlePlaySound(letter.letter);
  };

  const handleRemoveLetter = (index: number) => {
    const letter = placedLetters[index];
    if (!letter) return;

    const newDraggedLetters = draggedLetters.map((l) =>
      l.id === letter.id ? { ...l, isPlaced: false } : l,
    );

    const newPlacedLetters = [...placedLetters];
    newPlacedLetters[index] = null;

    setDraggedLetters(newDraggedLetters);
    setPlacedLetters(newPlacedLetters);
  };

  const checkWord = () => {
    const placedWord = placedLetters
      .filter((letter) => letter !== null)
      .map((letter) => letter!.letter)
      .join("");

    if (placedWord.toLowerCase() === word!.word.toLowerCase()) {
      Alert.alert("¡Correcto!", "¡Has formado la palabra correctamente!", [
        {
          text: "Continuar",
          onPress: () => {
            router.push(`/words/practice/${id}/step4`);
          },
        },
      ]);
    } else {
      Alert.alert(
        "Incorrecto",
        "La palabra no está correcta. Inténtalo de nuevo.",
        [
          {
            text: "Reiniciar",
            onPress: resetActivity,
          },
        ],
      );
    }
  };

  const resetActivity = () => {
    const letters = word!.graphemes.map((grapheme, index) => ({
      id: `letter-${index}`,
      letter: grapheme.letters,
      color: grapheme.color,
      position: grapheme.position,
      isPlaced: false,
    }));
    setDraggedLetters(letters);
    setPlacedLetters(new Array(word!.graphemes.length).fill(null));
  };

  const handlePrevious = () => {
    router.back();
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
      <View className="gap-2">
        <Text category="h4" className="text-center font-bold">
          Actividad: Arrastra las letras
        </Text>
        <Text category="s1" className="text-center">
          Arrastra cada letra a su caja de sonido:
        </Text>
      </View>

      <Card className="p-6">
        <View className="gap-6">
          <View className="gap-4">
            <View className="flex-row flex-wrap justify-center gap-3">
              {placedLetters.map((letter, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => letter && handleRemoveLetter(index)}
                  style={{
                    borderWidth: 2,
                    borderStyle: "dashed",
                    borderColor: "#D1D5DB",
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
                  {letter ? (
                    <View
                      style={{
                        backgroundColor: letter.color,
                        borderWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 12,
                        borderRadius: 12,
                        width: 64,
                        height: 64,
                      }}
                    >
                      <Text category="h4" className="text-white font-bold">
                        {letter.letter}
                      </Text>
                    </View>
                  ) : (
                    <Text category="h4" className="text-gray-400 font-bold">
                      {index + 1}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="gap-4">
            <Text category="h6" className="text-center">
              Letras disponibles
            </Text>
            <View className="flex-row flex-wrap justify-center gap-3">
              {draggedLetters
                .filter((letter) => !letter.isPlaced)
                .map((letter) => (
                  <TouchableOpacity
                    key={letter.id}
                    onPress={() => handleLetterPress(letter)}
                    style={{
                      backgroundColor: letter.color,
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
                      {letter.letter}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          <View className="flex-row items-center justify-center gap-2">
            <Icon name="bulb" fill="#FFD700" width={16} height={16} />
            <Text category="c1" className="text-center">
              Arrastra cada letra a la caja correcta
            </Text>
          </View>
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
          status="success"
          onPress={checkWord}
          accessoryRight={(props) => <Icon {...props} name="star" />}
        >
          ¡A Practicar!
        </Button>
      </View>
    </Layout>
  );
}
