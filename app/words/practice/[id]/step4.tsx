import { useWordPractice } from "@/features/words/hooks/useWordPractice";
import { Button, Card, Icon, Input, Layout, Text } from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WordPracticeStep4Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { word, isLoading } = useWordPractice(parseInt(id || "0"));
  const { bottom } = useSafeAreaInsets();
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(1);
  const [showHints, setShowHints] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckAnswer = () => {
    if (!word) return;

    const userAnswer = userInput.trim().toLowerCase();
    const correctAnswer = word.word.toLowerCase();

    if (userAnswer === correctAnswer) {
      setShowSuccess(true);
    } else {
      setAttempts((prev) => prev + 1);
      showErrorMessage();
    }
  };

  const showErrorMessage = () => {
    Alert.alert("¡Casi! 🦆", "Inténtalo de nuevo", [
      {
        text: "OK",
        onPress: () => {
          setUserInput("");
        },
      },
    ]);
  };

  const handleShowHints = () => {
    setShowHints(true);
  };

  const handleNext = () => {
    router.replace("/");
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

  if (showSuccess) {
    return (
      <Layout className="flex-1" style={{ paddingBottom: bottom }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            <Text category="h4">¡Escribe la palabra! ✍️</Text>

            <Card className="p-6">
              <View className="items-center gap-6">
                {word.imageUrl && (
                  <Image
                    source={{ uri: word.imageUrl }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                )}
                <View
                  style={{
                    backgroundColor: "#E0E7FF",
                    padding: 16,
                    borderRadius: 12,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text category="h3">{word.word}</Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#D1FAE5",
                    padding: 20,
                    borderRadius: 12,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View className="items-center gap-3">
                    <Text category="h4">✅ ¡Excelente! 🎉</Text>
                    <Text category="h6" className="text-center">
                      ¡Has escrito la palabra correctamente!
                    </Text>
                    <View className="flex-row gap-2">
                      <Text category="h4">⭐</Text>
                      <Text category="h4">⭐</Text>
                      <Text category="h4">⭐</Text>
                    </View>
                  </View>
                </View>

                <View className="gap-4 w-full">
                  <Text category="h6" className="text-center">
                    Sonidos de la palabra:
                  </Text>
                  <View className="flex-row flex-wrap justify-center gap-2">
                    {word.graphemes.map((grapheme, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "white",
                          borderWidth: 1,
                          borderColor: "#3B82F6",
                          padding: 8,
                          borderRadius: 8,
                          minWidth: 40,
                          alignItems: "center",
                        }}
                      >
                        <Text category="s1" className="text-blue-600 font-bold">
                          {grapheme.phonemeSymbol}
                        </Text>
                      </View>
                    ))}
                  </View>
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
                onPress={handleNext}
                accessoryRight={(props) => <Icon {...props} name="checkmark" />}
              >
                Finalizar
              </Button>
            </View>
          </View>
        </ScrollView>
      </Layout>
    );
  }

  return (
    <Layout className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 gap-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center gap-2"
            >
              <Icon name="arrow-back" fill="#8F9BB3" width={20} height={20} />
              <Text category="s1" style={{ color: "#8F9BB3" }}>
                Volver
              </Text>
            </TouchableOpacity>

            <Text category="h6" className="text-primary-600 font-bold">
              Intento {attempts}
            </Text>
          </View>

          <View className="gap-2">
            <Text category="h4" className="text-center font-bold">
              ¡Escribe la palabra! ✍️
            </Text>
          </View>

          <Card className="p-6">
            <View className="items-center gap-6">
              {word.imageUrl && (
                <Image
                  source={{ uri: word.imageUrl }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
              )}

              <Input
                value={userInput}
                onChangeText={setUserInput}
                placeholder="Escribe aquí..."
                size="large"
                style={{
                  backgroundColor: "#F3F4F6",
                  borderColor: "#D1D5DB",
                }}
              />

              {!showHints && (
                <TouchableOpacity
                  onPress={handleShowHints}
                  style={{
                    backgroundColor: "#FEF3C7",
                    padding: 12,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text category="s1">?</Text>
                  <Text category="s1" className="text-yellow-800">
                    ¿Necesitas ayuda?
                  </Text>
                  <Text>💡</Text>
                </TouchableOpacity>
              )}
              {showHints && (
                <View
                  style={{
                    backgroundColor: "#DBEAFE",
                    padding: 16,
                    borderRadius: 12,
                    width: "100%",
                  }}
                >
                  <Text category="h6" className="text-blue-600 font-bold mb-3">
                    Pista de sonidos:
                  </Text>
                  <View className="flex-row flex-wrap justify-center gap-2 mb-3">
                    {word.graphemes.map((grapheme, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "white",
                          borderWidth: 1,
                          borderColor: "#3B82F6",
                          padding: 8,
                          borderRadius: 8,
                          minWidth: 40,
                          alignItems: "center",
                        }}
                      >
                        <Text category="s1" className="text-blue-600 font-bold">
                          {grapheme.phonemeSymbol}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <Button
                onPress={handleCheckAnswer}
                disabled={!userInput.trim()}
                status="success"
                accessoryRight={(props) => <Icon {...props} name="checkmark" />}
              >
                Comprobar
              </Button>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Layout>
  );
}
