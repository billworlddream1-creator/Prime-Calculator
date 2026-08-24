<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Prime Calculator (Version 1.0.1)

Prime Calculator is a cross-platform React, Vite, TypeScript, and Capacitor application designed for Android, Windows, macOS, iOS, and Web platforms.

## Release V1.0.1 & Downloads

Release **V1.0.1** introduces automated CI/CD builds, full binary download file sizes, GitHub Artifacts downloads, and cross-platform releases for Android, Windows, macOS, iOS, and Web.

### Full Binary Download File Sizes

| Platform | Binary / Package Name | Description | Estimated Size |
| --- | --- | --- | --- |
| **Android** | `prime-calculator-v1.0.1.apk` | Android APK package | ~4.1 MB (4,260,000+ bytes) |
| **Windows** | `prime-calculator-windows-web-v1.0.1.zip` | Windows desktop web distribution bundle | ~115 KB (118,000+ bytes) |
| **macOS** | `prime-calculator-macos-web-v1.0.1.zip` | macOS desktop web distribution bundle | ~115 KB (118,000+ bytes) |
| **iOS** | `prime-calculator-ios-web-v1.0.1.zip` | iOS Capacitor web assets bundle | ~115 KB (118,000+ bytes) |
| **Web** | `prime-calculator-web-v1.0.1.zip` | Universal static dist archive | ~115 KB (118,000+ bytes) |

### Downloading Artifacts & Binaries

- **GitHub Release V1.0.1**: Download full binary release assets directly from the repository's [Releases](../../releases/tag/v1.0.1) tab.
- **GitHub Actions Artifacts**: Go to the **Actions** tab in GitHub, select the latest workflow run for `Build, Artifacts & Release V1.0.1`, and download the generated build artifacts (`android-apk-v1.0.1`, `windows-app-v1.0.1`, `macos-app-v1.0.1`, `ios-app-v1.0.1`, `web-build-v1.0.1`).

---

## Local Development & Building

### Prerequisites

- **Node.js**: v18 or later
- **npm** or **bun**
- **Android SDK & JDK 17** (for building Android APK locally)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (optional for AI features).

### Development Server

Run the development server locally:
```bash
npm run dev
```

### Platform Building Instructions

- **Web / Universal Static Build**:
  ```bash
  npm run build
  ```

- **Android (APK Build)**:
  ```bash
  npm run build:apk
  ```
  *Output APK location:* `android/app/build/outputs/apk/debug/app-debug.apk`

- **iOS / macOS / Windows Web Bundles**:
  ```bash
  npm run build
  npx cap copy
  ```

---

## GitHub Actions CI/CD Workflow

The automated GitHub workflow `.github/workflows/build-and-release.yml`:
- Triggers on pushes to `main`/`master`, pull requests, tag pushes (`v*`), or manual dispatch (`workflow_dispatch`).
- Compiles the React/TypeScript app and builds the Capacitor native Android APK.
- Bundles release archives for Web, Windows, macOS, and iOS.
- Calculates and logs full binary download file sizes in step summaries and release descriptions.
- Uploads workflow build artifacts to GitHub Actions for easy retrieval.
- Automatically creates GitHub Release V1.0.1 with attached binary files.
