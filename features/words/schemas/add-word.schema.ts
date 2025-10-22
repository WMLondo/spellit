import { z } from "zod/v4";

// Schema para grapheme (letra o combinación de letras)
export const graphemeSchema = z.object({
  letters: z.string().min(1, "La letra/grapheme es requerida"),
  phonemeId: z.number().min(1, "Debe seleccionar un fonema"),
  color: z.string().min(1, "El color es requerido"),
});

export const addWordSchema = z.object({
  word: z.string().min(1, "La palabra es requerida"),
  definition: z.string().min(1, "El significado es requerido"),
  imageUrl: z.string().optional(),
  graphemes: z
    .array(graphemeSchema)
    .min(1, "Debe agregar al menos un grapheme"),
});

export type AddWordFormData = z.infer<typeof addWordSchema>;
export type GraphemeFormData = z.infer<typeof graphemeSchema>;
