<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Prime Calculator

Prime Calculator is a modern, responsive cross-platform web application optimized for Web, Android, iOS, Windows, and macOS. Built with React, Vite, TypeScript, and Capacitor.

## Multi-Platform Compatibility & Features

- **Web App**: Universal responsive web application ready for deployment on any static hosting platform.
- **Android & iOS Support**: Native Capacitor runtime integration allowing direct Android APK generation (`android/`) and Xcode iOS project building (`ios/`).
- **Windows & macOS Bundles**: Desktop web distribution bundles designed for webview/electron wrappers or web environments.
- **Automated CI/CD Workflow**: Automated GitHub Actions pipeline building, archiving, and releasing for all platforms with dynamic tag/version resolution.

---

## Release Downloads & Artifact Specifications

Automated GitHub Action builds generate full binary packages and workflow artifacts:

### Binary & Asset Package Reference

| Platform | Package Name Template | Description | Size (Bytes) | Estimated Size |
| --- | --- | --- | --- | --- |
| **Android** | `prime-calculator-{VERSION}.apk` | Android Native Debug APK Package | ~4,266,500+ | ~4.1 MB |
| **Windows** | `prime-calculator-windows-web-{VERSION}.zip` | Windows Desktop Distribution Web Bundle | ~118,000+ | ~115 KB |
| **macOS** | `prime-calculator-macos-web-{VERSION}.zip` | macOS Desktop Distribution Web Bundle | ~118,000+ | ~115 KB |
| **iOS** | `prime-calculator-ios-project-{VERSION}.zip` | iOS Capacitor Native Xcode Project Archive | ~118,000+ | ~115 KB |
| **Web** | `prime-calculator-web-{VERSION}.zip` | Universal Static Production Web Bundle | ~118,000+ | ~115 KB |

### How to Download Artifacts

- **GitHub Release Assets**: Go to the repository **Releases** section (`/releases`) to download full binary packages attached to version tags (e.g., `v1.0.1`).
- **GitHub Actions Artifacts**: Navigate to the **Actions** tab on GitHub, select the latest `Build, Artifacts & Release` workflow run, and download generated target artifacts (`android-apk-{VERSION}`, `windows-app-{VERSION}`, `macos-app-{VERSION}`, `ios-project-{VERSION}`, `web-build-{VERSION}`).

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
- **Android SDK & JDK 21** (for Android APK local compilation)
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
2. Dynamically calculates version names based on tag releases or commit hashes.
3. Compiles TypeScript and runs Vite production build.
4. Syncs native Capacitor assets and compiles the Android APK using Gradle in JDK 21 environment.
5. Generates distribution archives for Android, iOS, Windows, macOS, and Web.
6. Logs full exact file sizes into GitHub Action Job Summaries.
7. Uploads artifacts to GitHub Actions with 90-day retention.
8. Automatically publishes a GitHub Release with full download binary attachments when a version tag is pushed.
