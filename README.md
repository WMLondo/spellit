# SpellIt 📚

Una aplicación React Native para aprender fonemas y pronunciación en inglés, con detección automática de fonemas basada en los 44 fonemas estándar del inglés.

## ✨ Características

- **Detección automática de fonemas** para palabras en inglés
- **Sistema de práctica** con pasos guiados
- **Base de datos local** con SQLite y Drizzle ORM
- **Síntesis de voz** integrada
- **Interfaz moderna** con NativeWind y GluestackUI
- **Navegación por archivos** con expo-router

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- Expo CLI
- Android Studio (para Android) o Xcode (para iOS)

### Instalación

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar base de datos**

   ```bash
   # Ejecutar migraciones
   npx drizzle-kit push

   # Seed de fonemas (opcional)
   # Navega a /phonemes/seed en la app
   ```

3. **Iniciar la aplicación**
   ```bash
   npx expo start
   ```

## 🏗️ Estructura del Proyecto

```
app/                    # Rutas con expo-router
├── _layout.tsx        # Layout raíz
├── index.tsx          # Pantalla principal
├── words/             # Gestión de palabras
│   ├── add.tsx        # Agregar palabra
│   └── practice/      # Práctica de palabras
├── settings/          # Configuraciones
└── phonemes/          # Sistema de fonemas

features/              # Lógica de negocio
├── words/            # Funcionalidad de palabras
├── phonemes/         # Detección de fonemas
├── speech/           # Síntesis de voz
├── settings/         # Configuraciones
└── shared/           # Utilidades compartidas

db/                   # Base de datos
├── schema.ts         # Esquemas de Drizzle
└── migrations/       # Migraciones
```

## 🎯 Funcionalidades Principales

### 1. Detección Automática de Fonemas

El sistema detecta automáticamente los fonemas de palabras en inglés usando los 44 fonemas estándar:

```typescript
// Ejemplo: "plane" se divide en:
// p → /p/ (consonante)
// l → /l/ (consonante)
// a → /ā/ (vocal larga)
// n → /n/ (consonante)
// e → (letra silenciosa)
```

### 2. Práctica de Palabras

- **Paso 1**: Visualización de fonemas con colores
- **Paso 2**: Práctica de pronunciación
- **Paso 3**: Ejercicios de escritura
- **Paso 4**: Evaluación final

### 3. Gestión de Palabras

- Agregar palabras personalizadas
- Definiciones y ejemplos
- Imágenes asociadas
- Historial de práctica

## 🛠️ Stack Tecnológico

- **React Native 0.81.4** con React 19
- **Expo ~54** con nueva arquitectura
- **TypeScript** con modo strict
- **expo-router** para navegación
- **NativeWind** para estilos (Tailwind CSS)
- **GluestackUI** para componentes
- **Drizzle ORM** con SQLite
- **expo-speech** para síntesis de voz
- **React Hook Form** con validación Zod

## 📱 Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar Expo
npm run android        # Ejecutar en Android
npm run ios           # Ejecutar en iOS
npm run web           # Ejecutar en web

# Calidad de código
npm run lint          # ESLint
npm run test          # Tests con Jest
npm run test:coverage # Cobertura de tests

# Base de datos
npx drizzle-kit push  # Aplicar migraciones
npx drizzle-kit studio # Abrir Drizzle Studio
```

## 🧪 Testing

El proyecto incluye tests unitarios con Jest y Testing Library:

```bash
npm test              # Tests en modo watch
npm run test:ci       # Tests para CI/CD
npm run test:coverage # Con reporte de cobertura
```

## 📚 Documentación Adicional

- [Sistema de Fonemas](PHONEME_SYSTEM.md) - Documentación completa del sistema de detección
- [Configuración de ESLint](eslint.config.js) - Reglas de calidad de código
- [Configuración de Tailwind](tailwind.config.js) - Estilos y temas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
