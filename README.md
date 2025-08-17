# Hello World Android Template

Template Android sederhana menggunakan Kotlin untuk aplikasi Hello World.

## Struktur Project

```
HelloWorld/
├── app/
│   ├── build.gradle           # Konfigurasi build aplikasi
│   ├── src/main/
│   │   ├── AndroidManifest.xml # Manifest aplikasi
│   │   ├── java/com/ryucode/helloworld/
│   │   │   └── MainActivity.kt # Activity utama
│   │   └── res/
│   │       ├── layout/
│   │       │   └── activity_main.xml # Layout Hello World
│   │       ├── values/
│   │       │   ├── colors.xml # Warna
│   │       │   ├── strings.xml # String resources
│   │       │   └── themes.xml # Tema aplikasi
│   │       └── mipmap-*/      # Icon aplikasi
├── build.gradle              # Konfigurasi build project
├── settings.gradle           # Settings project
└── gradlew                   # Gradle wrapper
```

## Fitur

- ✅ Template Hello World sederhana
- ✅ Material Design 3
- ✅ Target SDK 35 (Android 15)
- ✅ Minimum SDK 21 (Android 5.0)
- ✅ Kotlin

## Build & Run

### Build Debug APK
```bash
./gradlew assembleDebug
```

### Clean Project
```bash
./gradlew clean
```

### Build Release APK
```bash
./gradlew assembleRelease
```

## Konfigurasi

### Mengubah Nama Aplikasi
Edit file `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Nama Aplikasi Anda</string>
```

### Mengubah Package Name
1. Edit `namespace` di `app/build.gradle`
2. Edit `applicationId` di `app/build.gradle`
3. Pindahkan MainActivity ke folder package yang sesuai
4. Update package declaration di MainActivity.kt

### Mengubah Icon
Ganti file-file di folder `app/src/main/res/mipmap-*/` dengan icon Anda.

## Target SDK

- **Compile SDK**: 35 (Android 15)
- **Target SDK**: 35 (Android 15)  
- **Minimum SDK**: 21 (Android 5.0)

## Dependencies

- Kotlin
- AndroidX Core
- AppCompat
- Material Design 3
- ConstraintLayout

## Template Siap Pakai

Template ini sudah dibersihkan dan siap digunakan sebagai starting point untuk aplikasi Android baru. Semua konfigurasi WebView, permissions yang tidak perlu, dan kode kompleks sudah dihapus.

---

*Template dibuat sebagai base project untuk pengembangan aplikasi Android sederhana.*