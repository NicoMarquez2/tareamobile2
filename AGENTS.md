# AGENTS.md

## Proyecto

Aplicación mobile para el laboratorio de Desarrollo de Aplicaciones Móviles 2026.

Tema elegido: Pokédex Interactivo.  
Framework: React Native CLI.  
Lenguaje: TypeScript.  
Plataforma principal: Android.  
API pública: PokeAPI.  
Persistencia local: SQLite.

## Objetivo de la app

Crear una app móvil funcional que permita:

- Listar Pokémon desde PokeAPI.
- Buscar Pokémon por nombre.
- Ver detalle de un Pokémon.
- Mostrar imagen, tipos, estadísticas y habilidades.
- Guardar Pokémon favoritos en SQLite.
- Ver lista de favoritos.
- Compartir información de un Pokémon usando un Intent nativo.
- Cumplir con requisitos Android: Activity, Service, Broadcast Receiver, Content Provider e Intents.

## Requisitos del laboratorio

La app debe incluir:

- Mínimo 3 rutas/pantallas.
- Navegación con paso de parámetros.
- Consumo de API pública.
- Persistencia local con SQLite.
- UI clara y adaptativa, preferentemente estilo Material Design.
- Código organizado.
- README con arquitectura, pasos para compilar, ejecutar y usar.
- Evidencia para defensa: capturas, video corto y explicación técnica.

## Pantallas esperadas

- HomeScreen: listado y búsqueda de Pokémon.
- PokemonDetailScreen: detalle del Pokémon seleccionado.
- FavoritesScreen: Pokémon favoritos guardados localmente.
- Opcional: SettingsScreen o AboutScreen.

## Estructura sugerida

src/
api/
pokemonApi.ts
components/
database/
database.ts
favoritesRepository.ts
navigation/
AppNavigator.tsx
routes.ts
screens/
HomeScreen.tsx
PokemonDetailScreen.tsx
FavoritesScreen.tsx
services/
types/
utils/

android/
app/
src/
main/
java/...

## Reglas de desarrollo

- No usar Expo.
- Usar React Native CLI.
- Usar TypeScript.
- Mantener componentes simples y fáciles de defender.
- Separar lógica de API, base de datos, navegación y pantallas.
- No mezclar consultas SQL directamente dentro de las pantallas.
- No guardar claves ni secretos.
- No implementar cambios enormes de una vez.
- Cada tarea debe dejar la app compilable.
- Antes de terminar una tarea, explicar qué archivos se modificaron y cómo probarlo.

## SQLite

Usar SQLite para guardar favoritos.

Tabla sugerida:

favorite_pokemon:

- id INTEGER PRIMARY KEY
- name TEXT NOT NULL
- image TEXT
- types TEXT
- created_at TEXT

La lógica de base de datos debe estar en `src/database/`.

## Navegación

Usar React Navigation.

Rutas mínimas:

- Home
- PokemonDetail
- Favorites

El detalle debe recibir como parámetro el `id` o `name` del Pokémon.

## API

Usar PokeAPI.

Endpoints sugeridos:

- Listado: https://pokeapi.co/api/v2/pokemon
- Detalle: https://pokeapi.co/api/v2/pokemon/{id-or-name}

Crear funciones reutilizables en `src/api/pokemonApi.ts`.

## Componentes Android nativos

Implementar o preparar evidencia de:

### Activity

Usar `MainActivity` como Activity principal que inicializa React Native.

### Service

Crear un servicio Android simple para sincronización o precarga de favoritos/datos.

Ejemplo justificable:

- `PokemonSyncService`: servicio que registra en logs una sincronización o prepara datos locales.

### Broadcast Receiver

Crear un receptor para detectar cambios de conectividad o evento del sistema.

Ejemplo justificable:

- `ConnectivityReceiver`: detecta recuperación de conexión y dispara una acción simple.

### Content Provider

Crear un Content Provider para exponer favoritos locales.

Ejemplo justificable:

- `FavoritePokemonProvider`: permite consultar favoritos guardados.

### Intents

Usar Intents para compartir un Pokémon.

Ejemplo:

- Desde `PokemonDetailScreen`, compartir nombre e información básica del Pokémon usando el menú nativo de Android.

## Estilo de código

- Usar nombres claros.
- Evitar lógica compleja dentro del JSX.
- Usar tipos TypeScript para respuestas importantes.
- Manejar estados de carga, error y vacío.
- Evitar código duplicado.
- Priorizar claridad sobre complejidad.

## Comandos habituales

Instalar dependencias:

```bash
npm install
```
