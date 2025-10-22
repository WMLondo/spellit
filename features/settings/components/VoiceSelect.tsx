import {
  Button,
  IndexPath,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import { Voice } from "expo-speech";
import React, { useEffect } from "react";
import { View } from "react-native";

interface Props {
  value?: string;
  onChange: (voiceId: string) => void;
  voices: Voice[];
  speak: (text: string, voiceId?: string) => void;
  childName?: string;
}

export const VoiceSelect = ({
  value,
  onChange,
  voices,
  speak,
  childName,
}: Props) => {
  useEffect(() => {
    if (!value && voices.length > 0) {
      onChange(voices[0].identifier);
    }
  }, [value, voices, onChange]);

  const idx = voices.findIndex((v) => v.identifier === value);
  const selectedIdx = idx !== -1 ? new IndexPath(idx) : undefined;
  const selectedVoice = idx !== -1 ? voices[idx] : undefined;

  const handleTestVoice = () => {
    const testText = `Hola ${childName || "amigo"}, probando voz.`;
    speak(testText, value);
  };

  return (
    <View className="gap-2">
      <Text category="label">Voz</Text>
      <Select
        selectedIndex={selectedIdx}
        value={selectedVoice?.language ?? "Seleccionar voz"}
        onSelect={(index) => {
          const idx = index as IndexPath;
          onChange(voices[idx.row]?.identifier);
        }}
      >
        {voices.map((voice) => (
          <SelectItem key={voice.identifier} title={voice.language} />
        ))}
      </Select>
      {value && (
        <Button size="small" appearance="outline" onPress={handleTestVoice}>
          Probar voz
        </Button>
      )}
    </View>
  );
};
