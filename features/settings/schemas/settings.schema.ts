import { z } from "zod/v4";

export const languageEnum = ["en-US", "es-ES"] as const;

export const settingsSchema = z.object({
  childName: z.string().min(1, "El nombre es requerido"),
  voiceId: z.string().optional(),
  language: z.enum(languageEnum),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
export type Language = (typeof languageEnum)[number];
