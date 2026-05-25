# Pokedex Interactivo

Aplicacion movil desarrollada para el laboratorio de Desarrollo de Aplicaciones Moviles 2026.

La app permite consultar Pokemon desde PokeAPI, buscar por nombre, ver detalle, guardar favoritos en SQLite, compartir Pokemon mediante intents y demostrar componentes nativos Android integrados con React Native.

## Tecnologias

- React Native CLI
- TypeScript
- Android nativo con Kotlin
- React Navigation
- PokeAPI
- SQLite nativo Android
- Fastlane
- GitHub Actions
- AndroidX Test / JUnit

## Funcionalidades

- Listado de Pokemon desde PokeAPI.
- Carga paginada al llegar al final de la lista.
- Busqueda por nombre.
- Pantalla de detalle con imagen, tipos, habilidades y estadisticas.
- Guardado y eliminacion de favoritos.
- Pantalla de favoritos.
- Tema claro y oscuro.
- Banner visual de conexion perdida/restaurada.
- Compartir Pokemon con texto y deep link.
- Pagina simple en GitHub Pages para abrir un Pokemon en la app.
- Descarga de imagen del Pokemon a la galeria del dispositivo.
- Reporte de tests instrumentados Android.

## Pantallas

- `Home`: listado principal y busqueda.
- `PokemonDetail`: detalle del Pokemon seleccionado. Recibe `pokemonId` como parametro.
- `Favourites`: listado de Pokemon favoritos guardados localmente.
- `About`: informacion del proyecto.

## Arquitectura del proyecto

```txt
src/
  api/
    pokemonApi.ts
  assets/
  components/
    ConnectivityBanner.tsx
    PokeballLoader.tsx
    PokemonCard.tsx
    SideMenu.tsx
  database/
    favouritesRepository.ts
  navigation/
    AppNavigator.tsx
    routes.ts
  screens/
    HomeScreen.tsx
    PokemonDetailScreen.tsx
    FavouritesScreen.tsx
    AboutScreen.tsx
  theme/
    colors.ts
  types/
    pokemon.ts
  utils/

android/app/src/main/java/com/tareamobile2/
  MainActivity.kt
  MainApplication.kt
  providers/
    FavouritesDatabaseHelper.kt
    FavouritesModule.kt
    FavouritesPackage.kt
    PokemonInfoProvider.kt
  receivers/
    ConnectivityReceiver.kt
    ConnectivityModule.kt
    ConnectivityPackage.kt
  services/
    PokemonImageDownloadService.kt
    PokemonImageModule.kt
    PokemonImagePackage.kt
```

## API publica

La aplicacion consume PokeAPI:

- Listado: `https://pokeapi.co/api/v2/pokemon`
- Detalle: `https://pokeapi.co/api/v2/pokemon/{id}`

La logica de consumo esta centralizada en:

```txt
src/api/pokemonApi.ts
```

## Persistencia local

Los favoritos se guardan en SQLite nativo Android.

Base de datos:

```txt
pokemon.db
```

Tabla:

```sql
CREATE TABLE IF NOT EXISTS favourite_pokemon (
  id INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL
);
```

La app React Native no consulta SQL directamente. La pantalla llama a:

```txt
src/database/favouritesRepository.ts
```

Ese repositorio se comunica con el modulo nativo:

```txt
android/app/src/main/java/com/tareamobile2/providers/FavouritesModule.kt
```

La logica SQLite esta en:

```txt
android/app/src/main/java/com/tareamobile2/providers/FavouritesDatabaseHelper.kt
```

## Componentes Android requeridos

### Activity

`MainActivity` es la actividad principal de Android y carga la aplicacion React Native.

Archivo:

```txt
android/app/src/main/java/com/tareamobile2/MainActivity.kt
```

### Service

`PokemonImageDownloadService` descarga la imagen de un Pokemon en segundo plano, la guarda en la galeria del dispositivo y muestra una notificacion de estado.

Archivos:

```txt
android/app/src/main/java/com/tareamobile2/services/PokemonImageDownloadService.kt
android/app/src/main/java/com/tareamobile2/services/PokemonImageModule.kt
android/app/src/main/java/com/tareamobile2/services/PokemonImagePackage.kt
```

Justificacion: la descarga y guardado de imagen es una tarea del sistema Android que puede ejecutarse fuera de la UI de React Native y que se integra naturalmente con notificaciones y MediaStore.

### Broadcast Receiver

`ConnectivityReceiver` detecta cambios de conectividad y envia eventos hacia React Native. La app muestra un banner cuando se pierde o recupera la conexion.

Archivos:

```txt
android/app/src/main/java/com/tareamobile2/receivers/ConnectivityReceiver.kt
android/app/src/main/java/com/tareamobile2/receivers/ConnectivityModule.kt
android/app/src/main/java/com/tareamobile2/receivers/ConnectivityPackage.kt
src/components/ConnectivityBanner.tsx
```

### Content Provider

`PokemonInfoProvider` expone informacion de solo lectura sobre la app y los favoritos guardados en SQLite.

Archivo:

```txt
android/app/src/main/java/com/tareamobile2/providers/PokemonInfoProvider.kt
```

URIs disponibles:

```txt
content://com.tareamobile2.provider/info
content://com.tareamobile2.provider/favorites
```

El provider es de solo lectura. Las operaciones `insert`, `update` y `delete` no estan permitidas.

### Intents

La app usa intents para:

- Compartir informacion de un Pokemon desde `PokemonDetailScreen`.
- Abrir la app mediante deep link:

```txt
tareamobile2://pokemon/{pokemonId}
```

El intent filter esta declarado en:

```txt
android/app/src/main/AndroidManifest.xml
```

## Deep links y pagina web

La carpeta `docs/` contiene una pagina simple para GitHub Pages. Esa pagina muestra informacion basica del Pokemon y tiene un boton para abrir la app con el deep link:

```txt
docs/index.html
```

Ejemplo de deep link:

```txt
tareamobile2://pokemon/25
```

## Instalacion

Instalar dependencias:

```bash
npm install
```

Instalar dependencias Ruby/Fastlane:

```bash
cd android
bundle install
```

## Ejecutar la app

Iniciar Metro:

```bash
npm start
```

En otra terminal, instalar y abrir Android:

```bash
npm run android
```

Tambien se puede ejecutar directamente con Gradle:

```bash
android\gradlew.bat app:installDebug -p android
```

## Tests

El proyecto incluye tests instrumentados para la base de datos de favoritos.

Archivo:

```txt
android/app/src/androidTest/java/com/tareamobile2/providers/FavouritesDatabaseHelperTest.kt
```

Ejecutar tests con Gradle:

```bash
android\gradlew.bat connectedDebugAndroidTest -p android
```

Ejecutar tests con Fastlane:

```bash
cd android
bundle exec fastlane tests
```

Reporte HTML:

```txt
android/app/build/reports/androidTests/connected/debug/index.html
```

## Fastlane

Lanes disponibles:

```txt
release: compila APK release
tests: ejecuta tests instrumentados Android
clean: limpia Android
```

Comandos:

```bash
cd android
bundle exec fastlane release
bundle exec fastlane tests
bundle exec fastlane clean
```

## GitHub Actions

El workflow de GitHub Actions genera un APK release cuando se pushea un tag con formato `v*`.

Archivo:

```txt
.github/workflows/android-apk.yml
```

Secrets necesarios:

```txt
ANDROID_KEYSTORE_BASE64
ANDROID_KEY_ALIAS
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_PASSWORD
```

Crear un tag y subirlo:

```bash
git tag v1.0.0
git push origin v1.0.0
```

El APK queda disponible como artifact del workflow:

```txt
app-release.apk
```

## Verificar Content Provider

Con la app instalada, se puede consultar desde ADB:

```bash
adb shell content query --uri content://com.tareamobile2.provider/info
adb shell content query --uri content://com.tareamobile2.provider/favorites
```

## Verificar deep link

Con la app instalada:

```bash
adb shell am start -a android.intent.action.VIEW -d "tareamobile2://pokemon/25"
```

Esto debe abrir el detalle de Pikachu.

## Verificar descarga de imagen

1. Abrir el detalle de un Pokemon.
2. Tocar `Descargar imagen`.
3. Aceptar permiso de notificaciones si Android lo solicita.
4. Ver la notificacion de descarga.
5. Revisar la galeria, carpeta `Pictures/Pokedex`.

## Notas de seguridad

- No se guardan secretos en el repositorio.
- La firma release se configura mediante GitHub Secrets.
- El Content Provider esta pensado para evidencia academica y expone datos de solo lectura.
- Para una version productiva, se podria restringir el provider con permisos o marcarlo como no exportado si no se necesita acceso externo.
