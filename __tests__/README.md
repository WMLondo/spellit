# Testing con Jest y Expo

Este proyecto utiliza Jest junto con `jest-expo` y `@testing-library/react-native` para los tests unitarios.

## 📚 Configuración

La configuración de Jest se encuentra en `package.json`:

```json
{
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [...],
    "collectCoverage": true,
    "collectCoverageFrom": [...]
  }
}
```

## 🚀 Comandos Disponibles

### Ejecutar tests en modo watch

```bash
npm test
```

### Ejecutar tests una vez (CI)

```bash
npm run test:ci
```

### Ejecutar tests con reporte de cobertura

```bash
npm run test:coverage
```

## 📝 Estructura de Tests

Los tests se organizan en el directorio `__tests__/` en la raíz del proyecto:

```
__tests__/
├── README.md                       # Esta documentación
│
├── Utilidades
│   └── capitalize-test.tsx         # Test de función capitalize (7 tests)
│
├── Schemas (Validación Zod)
│   ├── settings-schema-test.tsx    # Validación de settings (5 tests)
│   └── add-word-schema-test.tsx    # Validación de agregar palabras (23 tests)
│
├── Hooks
│   └── useSettings-test.tsx        # Hook de configuración (2 tests)
│
└── Componentes
    └── SettingsButton-test.tsx     # Botón de configuración (2 tests)
```

## ✅ Tipos de Tests

### 1. Tests de Utilidades (Pure Functions)

```typescript
import { capitalize } from "@/features/shared/utils/capitalize";

describe("capitalize", () => {
  it("should capitalize the first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
});
```

### 2. Tests de Schemas (Zod Validation)

```typescript
import { settingsSchema } from "@/features/settings/schemas/settings.schema";

describe("settingsSchema", () => {
  it("should validate valid data", () => {
    const result = settingsSchema.safeParse({ childName: "Alaya" });
    expect(result.success).toBe(true);
  });
});
```

### 3. Tests de Hooks

```typescript
import { renderHook } from "@testing-library/react-native";
import { useSettings } from "@/features/words/hooks/useSettings";

describe("useSettings", () => {
  it("should return settings object structure", () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current).toHaveProperty("childName");
  });
});
```

### 4. Tests de Componentes

```typescript
import { render } from "@testing-library/react-native";
import { SettingsButton } from "@/features/shared/layout/settings-button";

describe("<SettingsButton />", () => {
  it("should render correctly", () => {
    const component = render(<SettingsButton />);
    expect(component).toBeDefined();
  });
});
```

## 🔧 Mocking

### Mock de Expo Modules

```typescript
jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(),
  openDatabaseSync: jest.fn(),
}));
```

### Mock de Expo Router

```typescript
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));
```

### Mock de UI Kitten

```typescript
jest.mock("@ui-kitten/components", () => ({
  Button: "Button",
  Icon: "Icon",
}));
```

## 📊 Reporte de Cobertura

Después de ejecutar `npm run test:coverage`, encontrarás el reporte en:

```
coverage/
├── lcov-report/
│   └── index.html  # Abre este archivo en el navegador
└── lcov.info
```

El reporte HTML muestra:

- Porcentaje de cobertura por archivo
- Líneas cubiertas vs no cubiertas
- Ramas, funciones y statements

## 🎯 Mejores Prácticas

1. **Organización**: Mantén los tests cerca del código que testean
2. **Nombres descriptivos**: Usa nombres claros para los `describe` e `it`
3. **Arrange-Act-Assert**: Estructura tus tests en 3 secciones
4. **Mocking selectivo**: Mock solo lo necesario
5. **Tests independientes**: Cada test debe ser independiente
6. **Coverage razonable**: Apunta a ~80% de cobertura, no 100%

## 📖 Referencias

- [Guía oficial de Expo Testing](https://docs.expo.dev/develop/unit-testing/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)

## 🐛 Troubleshooting

### Error: "Cannot find module"

Verifica que `transformIgnorePatterns` incluya el módulo problemático.

### Warning: "act(...)"

Los warnings de `act()` generalmente indican actualizaciones de estado asíncronas. Usa `waitFor` de `@testing-library/react-native` si es necesario.

### Tests lentos

- Usa `test:ci` en lugar de `test` para ejecución única
- Considera desactivar `collectCoverage` durante desarrollo
