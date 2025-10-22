import { useSettings } from "@/features/settings/hooks/useSettings";
import { renderHook } from "@testing-library/react-native";

// Mock expo-sqlite
jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(() => ({
    execAsync: jest.fn(),
  })),
  openDatabaseSync: jest.fn(),
}));

// Mock drizzle-orm
jest.mock("drizzle-orm/expo-sqlite", () => ({
  drizzle: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  })),
  useLiveQuery: jest.fn(() => ({
    data: [],
  })),
}));

// Mock expo-drizzle-studio-plugin
jest.mock("expo-drizzle-studio-plugin", () => ({
  useDrizzleStudio: jest.fn(),
}));

describe("useSettings", () => {
  it("should return settings object structure", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current).toHaveProperty("childName");
    expect(result.current).toHaveProperty("voiceId");
    expect(result.current).toHaveProperty("updateSettings");
  });

  it("should have updateSettings function", () => {
    const { result } = renderHook(() => useSettings());

    expect(typeof result.current.updateSettings).toBe("function");
  });
});
