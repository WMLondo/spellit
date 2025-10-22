import { useSettings } from "@/features/settings/hooks/useSettings";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";

export const useSpeech = () => {
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const { voiceId, language } = useSettings();

  const speak = (text: string, customVoiceId?: string) => {
    // Limpiar símbolos fonéticos si es necesario
    // Si el texto contiene símbolos como /p/, extraer solo la letra
    let cleanText = text;

    // Si es un símbolo fonético (ej: /p/, /th/, /ā/), extraer solo el contenido
    const phoneticMatch = text.match(/^\/(.+?)\/$/);
    if (phoneticMatch) {
      cleanText = phoneticMatch[1];
    }

    Speech.speak(cleanText, {
      voice: customVoiceId || voiceId || undefined,
      language: language || "en-US", // Usar idioma de settings
      rate: 0.8, // Velocidad más lenta para mejor pronunciación
    });
  };

  useEffect(() => {
    Speech.getAvailableVoicesAsync().then(setVoices);
  }, []);

  return { speak, voices };
};
