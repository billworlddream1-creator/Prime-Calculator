<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Prime Calculator (Version 1.0.1)

Prime Calculator is a modern, responsive cross-platform web application optimized for Web, Android, iOS, Windows, and macOS. Built with React, Vite, TypeScript, and Capacitor.

## Multi-Platform Compatibility & Features

- **Web App**: Universal responsive web application ready for deployment on any static hosting platform.
- **Android & iOS Support**: Native Capacitor runtime integration allowing direct Android APK generation (`android/`) and Xcode iOS project building (`ios/`).
- **Windows & macOS Bundles**: Pre-packaged optimized web bundles designed for desktop electron/webview wrappers or browser environments.
- **Automated CI/CD Workflow**: Automated GitHub Actions pipeline building, archiving, and releasing for all platforms.

---

## Release Downloads & Full File Size Specifications

Automated GitHub Action builds generate full binary packages and workflow artifacts:

### Binary Package File Size Reference

| Platform | Binary / Package Name | Description | Size (Bytes) | Estimated Size |
| --- | --- | --- | --- | --- |
| **Android** | `prime-calculator-v1.0.1.apk` | Android Native Debug APK Package | ~4,266,500+ | ~4.1 MB |
| **Windows** | `prime-calculator-windows-web-v1.0.1.zip` | Windows Desktop Distribution Bundle | ~118,000+ | ~115 KB |
| **macOS** | `prime-calculator-macos-web-v1.0.1.zip` | macOS Desktop Distribution Bundle | ~118,000+ | ~115 KB |
| **iOS** | `prime-calculator-ios-web-v1.0.1.zip` | iOS Capacitor Native Bundle | ~118,000+ | ~115 KB |
| **Web** | `prime-calculator-web-v1.0.1.zip` | Universal Static Production Bundle | ~118,000+ | ~115 KB |

### How to Download Artifacts

- **GitHub Release Assets**: Go to the repository **Releases** section (`/releases`) to download full binary packages attached to version tags (e.g. `v1.0.1`).
- **GitHub Actions Artifacts**: Navigate to the **Actions** tab on GitHub, choose the latest `Build, Artifacts & Release V1.0.1` run, and download any of the target artifacts (`android-apk-v1.0.1`, `windows-app-v1.0.1`, `macos-app-v1.0.1`, `ios-app-v1.0.1`, `web-build-v1.0.1`).

---

## Build Optimizations

The Vite build process (`vite.config.ts`) incorporates key performance optimizations:
- **Vendor Code Splitting**: Splitting React and React-DOM into a dedicated `vendor` chunk (`vendor-*.js`) for efficient long-term browser caching.
- **ESBuild Minification**: Lightning-fast minification and dead-code elimination targeting `ES2020`.
- **CSS Code Splitting**: Modularized stylesheet loading to reduce initial render blocking.
- **Clean Build Pipeline**: `emptyOutDir: true` guarantees fresh distribution artifacts on each compilation.

---

## Local Development & Platform Commands

### Prerequisites

- **Node.js**: v18 or later (v22 recommended)
- **npm** or **bun**
- **Android SDK & JDK 17** (for Android APK local compilation)
- **Xcode & CocoaPods** (for iOS native development on macOS)

### Installation

```bash
npm install
```

### Available Scripts

- **Development Server**:
  ```bash
  npm run dev
  ```

- **Optimized Web Build**:
  ```bash
  npm run build
  ```

- **Android APK Build**:
  ```bash
  npm run build:apk
  ```
  *Generated APK path:* `android/app/build/outputs/apk/debug/app-debug.apk`

- **iOS Build**:
  ```bash
  npm run build:ios
  ```

- **Capacitor Sync**:
  ```bash
  npm run cap:sync
  ```

---

## GitHub Actions CI/CD Pipeline

The `.github/workflows/build-and-release.yml` workflow:
1. Triggers on pushes to `main`/`master`, tag pushes (`v*`), PRs, or manual dispatch.
2. Compiles TypeScript and runs Vite production build.
3. Syncs native Capacitor assets and compiles the Android APK using Gradle in JDK 17 environment.
4. Generates distribution archives for Android, iOS, Windows, macOS, and Web.
5. Logs full exact file sizes into GitHub Action Job Summaries.
6. Uploads artifacts to GitHub Actions with 90-day retention.
7. Automatically publishes a GitHub Release with full download binary attachments when a version tag is pushed.
