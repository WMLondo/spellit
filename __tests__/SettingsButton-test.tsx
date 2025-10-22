import { SettingsButton } from "@/features/shared/layout/settings-button";
import { render } from "@testing-library/react-native";

// Mock expo-router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock UI Kitten components
jest.mock("@ui-kitten/components", () => ({
  Button: "Button",
  Icon: "Icon",
}));

describe("<SettingsButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const component = render(<SettingsButton />);
    expect(component).toBeDefined();
  });

  it("should render component structure", () => {
    const { root } = render(<SettingsButton />);
    expect(root).toBeDefined();
  });
});
