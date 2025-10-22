import { capitalize } from "@/features/shared/utils/capitalize";

describe("capitalize", () => {
  it("should capitalize the first letter and lowercase the rest", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("WORLD")).toBe("World");
    expect(capitalize("mIxEd")).toBe("Mixed");
  });

  it("should handle single character strings", () => {
    expect(capitalize("a")).toBe("A");
    expect(capitalize("Z")).toBe("Z");
  });

  it("should handle empty strings", () => {
    expect(capitalize("")).toBe("");
  });

  it("should handle strings with spaces", () => {
    expect(capitalize("hello world")).toBe("Hello world");
    expect(capitalize("MARY HAD")).toBe("Mary had");
  });

  it("should handle strings with numbers", () => {
    expect(capitalize("test123")).toBe("Test123");
    expect(capitalize("123test")).toBe("123test");
  });

  it("should handle strings with special characters", () => {
    expect(capitalize("!hello")).toBe("!hello");
    expect(capitalize("@world")).toBe("@world");
  });
});
