<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Prime Calculator

Prime Calculator is a feature-packed calculator and utility suite built with React, Vite, TypeScript, and Capacitor for Android support. It combines mathematical capabilities with custom UI themes, Gemini AI insights, real-time currency conversion, interactive graph plotting, alarm features, and system diagnostic simulation.

## Features

- **Advanced Calculator:** Expression evaluation, operations, history tracking, and full undo/redo capabilities with keyboard shortcut support.
- **Gemini AI Insights:** Integrated with `@google/genai` to generate facts and mathematical insights on calculation results.
- **Real-Time Currency Converter:** Fast unit conversion across major fiat and crypto currencies.
- **Interactive Graph Plotter:** Plot functions (e.g. `sin(x)`, `cos(x)`, `x^2`, `log(x)`) with zooming support on HTML5 Canvas.
- **Alarm & Calendar Utilities:** Integrated calendar view and configurable alarms.
- **Custom Themes & Personalization:** Multiple theme modes (including Cyberpunk Neon, Verdan Meadow, Dark Cyber, Light Slate) and user personalization.
- **Android Platform Support:** Configured with Capacitor for Android native application deployment.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun

### Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (if required for Gemini AI features):
   Set `GEMINI_API_KEY` in `.env.local`.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for web production:
   ```bash
   npm run build
   ```

## Android APK Build & Artifacts

### Local APK Build

To build the Android APK locally, ensure you have Java JDK (17+) and Android SDK configured, then run:

```bash
npm run build:apk
```

The output debug APK will be generated under `android/app/build/outputs/apk/debug/`.

### Automated GitHub Actions Workflow

The repository includes a GitHub Actions workflow (`.github/workflows/build-apk.yml`) that automatically builds the Android APK on every push or pull request to the `main` or `master` branches.

#### Downloading Artifacts

1. Navigate to the **Actions** tab in your GitHub repository.
2. Select the latest workflow run for **Build Android APK**.
3. Scroll down to the **Artifacts** section at the bottom of the run summary page.
4. Click on `app-debug.apk` to download the generated APK artifact archive.
