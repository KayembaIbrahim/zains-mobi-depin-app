# Zain Mobi (Uganda) — DePIN Internet Sharing App

React Native app (Expo) for hotspot/node sharing and data resale with a wallet using Nsimbi tokens.

## Features
- Splash screen with Zain Mobi logo and theme (orange #FF8000, dark gray #30353A, dark green-blue #0E5E6F)
- Register/login with phone or email (local AsyncStorage)
- Wallet dashboard: Nsimbi balance, manual top-up/withdraw using payment TX IDs (MoMo or USDT Polygon). Conversion: 1 Nsimbi = 2 UGX
- Become a Node (phone hotspot or router/MiFi), set 24h price
- Node Discovery list with price in Nsimbi and UGX
- Buy Access: deduct Nsimbi and issue secure 8-char token for 24h access
- Access Token validator + connection instructions; no router password exposed
- Router List (admin): manage routers/MiFis and pricing
- Transaction History
- Settings and Logout
- Admin Dashboard: manual credits/payouts approvals, end active sessions

Admin role is granted automatically if email contains `admin` or the phone ends with `0000`.

## Project Structure
- `App.js`: Navigation and main tabs
- `assets/`: logo and optional fonts
- `constants/`: theme and colors
- `screens/`: UI screens
- `services/`: AsyncStorage-based services (auth, wallet, nodes, tokens, transactions)

## Assets
- Put your provided logo at `assets/logo.png` (used for app icon and splash)
- Optional font: place `assets/fonts/SimSun.ttf` to use SimSun. Without it, system font is used.

## Local Development
1. Install Node LTS and Yarn/NPM
2. Install dependencies
   ```bash
   npm i -g expo-cli eas-cli
   npm install
   ```
3. Start the app
   ```bash
   npm run start
   ```
4. Run on Android emulator or device
   ```bash
   npm run android
   ```

## Build Android APK (Expo EAS)
- Create an Expo account and log in: `eas login`
- Configure the project if prompted: `eas build:configure`
- Build a universal APK for testing:
  ```bash
  eas build -p android --profile preview --local
  ```
  Or build on Expo servers:
  ```bash
  eas build -p android --profile preview
  ```
- After completion, download the APK from the provided link or from `dist/` if local.

To generate a Play Store AAB:
```bash
EAS_NO_VCS=1 eas build -p android --profile production
```

## Notes
- Data is stored locally using AsyncStorage; no backend is required for the demo.
- All credit/withdrawals are created as `pending` and must be approved in the Admin tab.
- Pricing shows Nsimbi and UGX (1 Nsimbi = 2 UGX).
- Colors: Orange `#FF8000`, Dark Gray `#30353A`, Dark Green-Blue `#0E5E6F`.
- Fonts: The app asks for SimSun; include `assets/fonts/SimSun.ttf` if you own a license.

## Troubleshooting
- If fonts are added, you can optionally load them with `expo-font` in `App.js`.
- If `assets/logo.png` is missing, the splash/icon may fail; add the image and rebuild.
