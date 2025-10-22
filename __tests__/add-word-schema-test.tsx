import { addWordSchema } from "@/features/words/schemas/add-word.schema";

describe("addWordSchema", () => {
  const validGrapheme = {
    letters: "p",
    phonemeId: 1,
    color: "#FF5733",
  };

  describe("Valid cases", () => {
    it("should validate a complete word with graphemes", () => {
      const validData = {
        word: "plane",
        definition: "Un avión que vuela en el cielo",
        imageUrl: "https://example.com/plane.jpg",
        graphemes: [
          { letters: "p", phonemeId: 1, color: "#FF5733" },
          { letters: "l", phonemeId: 2, color: "#33FF57" },
          { letters: "a", phonemeId: 3, color: "#3357FF" },
          { letters: "n", phonemeId: 4, color: "#FF33F5" },
          { letters: "e", phonemeId: 5, color: "#F5FF33" },
        ],
      };

      const result = addWordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept word without imageUrl", () => {
      const validData = {
        word: "cat",
        definition: "Un gato pequeño",
        graphemes: [validGrapheme],
      };

      const result = addWordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept single grapheme", () => {
      const validData = {
        word: "a",
        definition: "La letra a",
        graphemes: [validGrapheme],
      };

      const result = addWordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept multi-letter graphemes", () => {
      const validData = {
        word: "phone",
        definition: "Un teléfono",
        graphemes: [
          { letters: "ph", phonemeId: 1, color: "#FF5733" },
          { letters: "o", phonemeId: 2, color: "#33FF57" },
          { letters: "ne", phonemeId: 3, color: "#3357FF" },
        ],
      };

      const result = addWordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid cases", () => {
    it("should reject empty word", () => {
      const invalidData = {
        word: "",
        definition: "Una definición",
        graphemes: [validGrapheme],
      };

      const result = addWordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty definition", () => {
      const invalidData = {
        word: "cat",
        definition: "",
        graphemes: [validGrapheme],
      };

      const result = addWordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject word without graphemes", () => {
      const invalidData = {
        word: "cat",
        definition: "Un gato",
        graphemes: [],
      };

      const result = addWordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject grapheme with empty letters", () => {
      const invalidData = {
        word: "cat",
        definition: "Un gato",
        graphemes: [{ letters: "", phonemeId: 1, color: "#FF5733" }],
      };

      const result = addWordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject grapheme with invalid phonemeId", () => {
      const invalidData = {
        word: "cat",
        definition: "Un gato",
        graphemes: [{ letters: "c", phonemeId: 0, color: "#FF5733" }],
      };

      const result = addWordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject grapheme without color", () => {
      const invalidData = {
        word: "cat",
        definition: "Un gato",
        graphemes: [{ letters: "c", phonemeId: 1, color: "" }],
      };

      const result = addWordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing word field", () => {
      const invalidData = {
        definition: "Una definición",
        graphemes: [validGrapheme],
      };

      const result = addWordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing definition field", () => {
      const invalidData = {
        word: "cat",
        graphemes: [validGrapheme],
      };

      const result = addWordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle very long words", () => {
      const longWord = "pneumonoultramicroscopicsilicovolcanoconiosis";
      const graphemes = longWord.split("").map((letter, idx) => ({
        letters: letter,
        phonemeId: idx + 1,
        color: "#FF5733",
      }));

      const validData = {
        word: longWord,
        definition: "Una enfermedad pulmonar",
        graphemes,
      };

      const result = addWordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should handle special characters in definition", () => {
      const validData = {
        word: "cat",
        definition: "¡Un gato! 🐱 con emojis y símbolos #123",
        graphemes: [validGrapheme],
      };

      const result = addWordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should handle multiple graphemes with same color", () => {
      const validData = {
        word: "book",
        definition: "Un libro",
        graphemes: [
          { letters: "b", phonemeId: 1, color: "#FF5733" },
          { letters: "oo", phonemeId: 2, color: "#FF5733" },
          { letters: "k", phonemeId: 3, color: "#FF5733" },
        ],
      };

      const result = addWordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});

