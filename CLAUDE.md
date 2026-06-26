# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev
yarn start          # Expo dev server
yarn android        # Run on Android device/emulator
yarn ios            # Run on iOS simulator

# Builds (EAS)
eas build --profile development --platform android   # Debug APK
eas build --profile production --platform android    # Release APK
```

No test suite or linter is configured.

## Architecture

**oi-validator** is an Expo (SDK 52) React Native app for scanning and validating event tickets at the door. Validators scan QR codes; the app validates online first, falls back to local SQLite when offline, and syncs pending records on reconnect.

### State

Zustand store (`src/store/index.ts`) persisted to AsyncStorage. Slice reducers live in `src/store/reducers/` (User, Token, Common). Key state: `user`, `token`, `currentEvent`, `lastSync`, `mustSync`, `headerColor`.

### Navigation

Three-level stack:

```
AuthRoutes (NativeStack)
  ├── authLoading  →  AuthLoader  (reads persisted token, redirects)
  ├── signIn       →  SignIn
  └── appNavigator →  AppRoutes (Drawer)
                         ├── home         →  Home
                         ├── selectEvent  →  SelectEvent
                         ├── products     →  AvailableProducts
                         └── qrhistory    →  QrHistory
```

The drawer's "Sincronizar" item triggers `syncInfo()` defined in `app.routes.tsx`, which uploads pending SQLite records and pulls fresh data from the API.

### API

Axios instance at `src/api/index.ts` — base URL `https://api.oitickets.com.br/api/v1`, Bearer token injected via interceptor. Four sub-modules: `auth`, `validations`, `tickets`, `users`.

### Local Database (SQLite)

`expo-sqlite` via `src/services/sqlite/Database.ts`. Tables created on app startup in `App.tsx`. Models live in `src/services/sqlite/models/` (Validation, Product, Event, Combo, Order, Operations, WebstoreTicket, User). Each model folder has `operation_insert`, `operation_search`, `operation_update` files with raw SQL helpers.

### Validation Flow

Core logic: `src/utils/toolbox/auxFns/validateQR.ts`

1. Parse QR code → check if it belongs to the current event (`isTicketValidable`)
2. Check local SQLite for a prior validation (`checkLocallyValidation`)
3. If online: hit API to check status, then POST to validate
4. On success: write to local SQLite (`Validation.insertValidation`) and resolve
5. If product not found locally: trigger a silent sync (`onSync(false)`) and retry once
6. If offline: reject with a "no connection" message (offline-only validation is not yet implemented — see comment in `src/services/sync/validations.ts`)

### Path Aliases

Configured in `babel.config.js` via `babel-plugin-module-resolver`:

| Alias | Path |
|---|---|
| `@assets` | `src/assets` |
| `@components` | `src/components` |
| `@screens` | `src/screens` |
| `@utils` | `src/utils` |
| `@services` | `src/services` |
| `@routes` | `src/routes` |
| `@hooks`, `@contexts`, `@storage`, `@dtos` | configured but unused |
