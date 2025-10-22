import { Button, Icon } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export function SettingsButton() {
  const router = useRouter();

  return (
    <View className="flex-row gap-2">
      <Button
        appearance="ghost"
        style={style.button}
        accessoryLeft={(props) => <Icon {...props} name="plus" />}
        onPress={() => router.push("/words/add")}
      />
      <Button
        style={style.button}
        accessoryLeft={(props) => <Icon {...props} name="settings" />}
        onPress={() => router.push("/settings")}
      />
    </View>
  );
}

const style = StyleSheet.create({
  button: {
    borderRadius: 9999,
    padding: 8,
    width: 32,
    height: 32,
  },
});
