# Sistema de Detección Automática de Fonemas

## 🎯 Descripción

Este sistema implementa la **detección automática de fonemas** para palabras en inglés, basado en los **44 fonemas estándar del inglés** según el International Phonetic Alphabet (IPA) y Reading Rockets.

## 📚 Conceptos Clave

### Phoneme (Fonema)

Un **fonema** es la unidad mínima de sonido que distingue una palabra de otra. Ejemplo: `/p/`, `/b/`, `/f/`

### Grapheme (Grafema)

Un **grafema** es la representación escrita de un fonema (una letra o grupo de letras). Ejemplo: "p", "ph", "gh" (todos representan `/f/`)

### Relación Many-to-Many

- Un grapheme puede representar múltiples fonemas: "c" → `/k/` (cat) o `/s/` (city)
- Un fonema puede tener múltiples graphemes: `/f/` → "f", "ff", "ph", "gh"

## 🗄️ Estructura de Base de Datos

```sql
phonemes (44 fonemas del inglés)
  ├── id
  ├── symbol (/p/, /b/, etc.)
  ├── type (consonant, short_vowel, long_vowel, r_controlled, digraph)
  └── description (ejemplo: "ball", "fan")

graphemes (letras individuales o combinaciones)
  ├── id
  ├── letters ("b", "bb", "ph", "igh", etc.)
  └── isCommon (true si es spelling común, false si es alternativo)

grapheme_phonemes (relación many-to-many)
  ├── grapheme_id
  └── phoneme_id

word_graphemes (graphemes de cada palabra)
  ├── word_id
  ├── grapheme_id
  ├── position (orden en la palabra)
  └── color (para visualización)
```

## 🚀 Cómo Usar

### 1. Ejecutar el Seed de Fonemas

**Opción A: Desde la UI**

```
1. Navega a /phonemes/seed
2. Presiona "Ejecutar Seed"
3. Espera a que termine (puede tomar unos segundos)
```

**Opción B: Desde código**

```typescript
import { seedPhonemes } from "@/scripts/seed-phonemes";
await seedPhonemes();
```

### 2. Agregar una Palabra

Cuando agregas una palabra en `/words/add`:

1. **Escribe la palabra**: Ejemplo: "plane"
2. **Los fonemas se detectan automáticamente**:
   - `p` → `/p/` (consonante)
   - `l` → `/l/` (consonante)
   - `a` → `/ā/` (vocal larga)
   - `n` → `/n/` (consonante)
   - `e` → (letra silenciosa)

3. **Visualización**:
   - Cada grapheme con su color
   - Punto naranja = spelling alternativo
   - Borde rojo = grapheme no reconocido

4. **Guardar**: Los graphemes se guardan con la palabra

## 🧠 Algoritmo de Detección

El sistema usa un algoritmo **greedy** que:

1. **Prioriza graphemes más largos** (ej: "ough" antes que "o")
2. **Prefiere spellings comunes** sobre alternativos
3. **Procesa de izquierda a derecha**

Ejemplo para "night":

```
n → /n/ (común)
igh → /ī/ (común para vocal larga)
t → /t/ (común)
```

## 📖 Los 44 Fonemas del Inglés

### Consonantes (19)

- `/b/` ball, `/d/` dog, `/f/` fan, `/g/` grapes
- `/h/` hat, `/j/` jellyfish, `/k/` kite, `/l/` leaf
- `/m/` monkey, `/n/` nest, `/ng/` ring, `/p/` pig
- `/r/` robot, `/s/` sun, `/t/` tap, `/v/` van
- `/w/` web, `/y/` yo-yo, `/z/` zebra

### Digraphs (5)

- `/zh/` treasure, `/ch/` cheese, `/sh/` shark
- `/th/` thongs (unvoiced), `/th/` feather (voiced)

### Vocales Cortas (6)

- `/a/` cat, `/e/` egg, `/i/` igloo
- `/o/` orange, `/u/` mug, `/oo/` book

### Vocales Largas (6)

- `/ā/` snail, `/ē/` bee, `/ī/` spider
- `/ō/` boat, `/ü/` moon, `/yü/` uniform

### R-Controlled (6)

- `/ã/` chair, `/ä/` car, `/û/` bird
- `/ô/` paw, `/ēә/` ear, `/üә/` cure

### Diptongos (2)

- `/oi/` coin, `/ow/` cow

### Schwa (1)

- `/ә/` ladder (sonido neutro)

## 🎨 Visualización de Colores

Los colores se asignan automáticamente a los graphemes:

```typescript
const PHONEME_COLORS = [
  { name: "Rojo", value: "#FF6B6B" },
  { name: "Azul", value: "#4ECDC4" },
  { name: "Verde", value: "#45B7D1" },
  { name: "Amarillo", value: "#FFA07A" },
  { name: "Morado", value: "#DDA0DD" },
  { name: "Naranja", value: "#FFB347" },
  { name: "Turquesa", value: "#40E0D0" },
  { name: "Rosa", value: "#FFB6C1" },
];
```

## 🔧 Hooks Disponibles

### `usePhonemeDetection()`

```typescript
const { detectGraphemes, isReady } = usePhonemeDetection();

// Detectar graphemes de una palabra
const graphemes = detectGraphemes("plane");
// [{letters: "p", phonemeId: 12, phonemeSymbol: "/p/", ...}, ...]
```

### `useWords()`

```typescript
const { addWord, isLoading } = useWords();

// Agregar palabra con graphemes detectados
await addWord({
  word: "plane",
  definition: "Un avión",
  imageUrl: "...",
  detectedGraphemes: [...],
});
```

## 📚 Referencias

- **Reading Rockets**: [The 44 Phonemes of English](https://www.readingrockets.org/sites/default/files/migrated/the-44-phonemes-of-english.pdf)
- **IPA**: International Phonetic Alphabet
- **DSF Literacy Resources**: Document source

## 🐛 Solución de Problemas

### Los fonemas no se detectan

- Asegúrate de haber ejecutado el seed: `/phonemes/seed`
- Verifica que `isReady` sea `true` en `usePhonemeDetection`

### Grapheme no reconocido (borde rojo)

- Es normal para palabras con spelling muy raro
- Puedes agregar manualmente el grapheme a la base de datos

### Spelling alternativo (punto naranja)

- Indica que se usó un spelling no común
- Ejemplo: "ph" en "phone" en lugar de "f"
- No es un error, solo información

## 🚧 Próximas Mejoras

1. **Sugerencias alternativas**: Mostrar diferentes formas de dividir una palabra
2. **Edición manual**: Permitir ajustar graphemes detectados
3. **Pronunciación**: Integrar audio para cada fonema
4. **Soporte multiidioma**: Agregar español y otros idiomas
5. **Machine Learning**: Mejorar detección con contexto

## 📝 Notas

- El sistema está basado en **inglés americano estándar**
- Algunos acentos pueden tener variaciones en los fonemas
- La detección es automática pero puede necesitar ajustes manuales en casos raros
