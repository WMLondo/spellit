import { settingsSchema } from "@/features/settings/schemas/settings.schema";

describe("settingsSchema", () => {
  it("should validate a valid settings object", () => {
    const validData = {
      childName: "Alaya",
      voiceId: "com.apple.voice.compact.en-US.Samantha",
    };

    const result = settingsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty childName", () => {
    const invalidData = {
      childName: "",
      voiceId: "com.apple.voice.compact.en-US.Samantha",
    };

    const result = settingsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should accept empty voiceId", () => {
    const validData = {
      childName: "Alaya",
      voiceId: "",
    };

    const result = settingsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject missing childName", () => {
    const invalidData = {
      voiceId: "com.apple.voice.compact.en-US.Samantha",
    };

    const result = settingsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should handle childName with spaces", () => {
    const dataWithSpaces = {
      childName: "  Alaya  ",
      voiceId: "com.apple.voice.compact.en-US.Samantha",
    };

    const result = settingsSchema.safeParse(dataWithSpaces);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.childName.length).toBeGreaterThan(0);
    }
  });
});
