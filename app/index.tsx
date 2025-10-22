import { useSettings } from "@/features/settings/hooks/useSettings";
import { capitalize } from "@/features/shared/utils/capitalize";
import { useWords } from "@/features/words/hooks/useWords";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { wordsData } = useWords();
  const { childName } = useSettings();

  const handleStartPractice = (wordId: number) => {
    router.push(`/words/practice/${wordId}`);
  };

  return (
    <Layout className="flex-1">
      <View className="flex-1 p-6 gap-6">
        <View className="gap-2">
          <Text category="h3" className="text-primary-600">
            ¡Hola, {capitalize(childName ?? "")}! 👋
          </Text>
          <Text category="s1" appearance="hint">
            ¡Vamos a aprender palabras nuevas!
          </Text>
        </View>

        {wordsData.length > 0 ? (
          <>
            <View className="gap-4">
              <Text category="h5" className="mb-2">
                Palabras de Hoy 📖
              </Text>

              <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={wordsData}
                renderItem={({ item: word }) => (
                  <Card className="mb-3" key={word.id}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 gap-1">
                        <Text category="h6">{capitalize(word.word)}</Text>
                        <Text category="s2" appearance="hint">
                          Nueva palabra
                        </Text>
                      </View>
                      <Button
                        size="small"
                        onPress={() => handleStartPractice(word.id)}
                        style={{ borderRadius: 9999 }}
                        accessoryRight={(props) => (
                          <Icon {...props} name="arrow-forward" />
                        )}
                      />
                    </View>
                  </Card>
                )}
              />
            </View>
          </>
        ) : (
          <>
            <Button
              accessoryRight={(props) => <Icon {...props} name="plus" />}
              onPress={() => router.push("/words/add")}
            >
              Agregar primera palabra
            </Button>
          </>
        )}
      </View>
    </Layout>
  );
}
