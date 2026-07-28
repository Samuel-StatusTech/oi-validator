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

## Como rodar local

No `.env` / env-var configuration is needed or supported — the project has no `.env` files and no `process.env`/`EXPO_PUBLIC_*` usage. The API base URL is hardcoded in `src/api/index.ts` (see API section below), so `yarn start` works out of the box against the production API (`https://api.oitickets.com.br/api/v1`) with just `yarn install` (or `npm install --legacy-peer-deps`, per `eas-build-pre-install`). To point at a different backend, edit the `baseURL` in `src/api/index.ts` directly.

## Architecture

**oi-validator** is an Expo (SDK 52) React Native app for scanning and validating event tickets at the door. Validators scan QR codes; the app validates online first, falls back to local SQLite when offline, and syncs pending records on reconnect.

### State

Zustand store (`src/store/index.ts`) persisted to AsyncStorage (key `oi-validator-store`, via `partialize`). Slice reducers live in `src/store/reducers/` (User, Token, Common). State shape (`src/utils/@types/store.ts`): `user`, `token`, `currentEvent`, `lastSync`, `mustSync`, `headerColor`, plus device/UX preferences `cameraFacing` (`"front" | "back"`), `feedbackDuration`, `screenLockTimeout`, `screenLockEnabled` — all set via `Common` reducer actions (`setCameraFacing`, `setFeedbackDuration`, `setScreenLockTimeout`, `setScreenLockEnabled`) and persisted.

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
                         ├── qrhistory    →  QrHistory
                         └── settings     →  Settings  (hidden from drawer list, opened via a dedicated "Configurações" DrawerItem)
```

The drawer's "Sincronizar informações" item triggers `syncInfo()` defined in `src/routes/app.routes.tsx`, which uploads pending SQLite records (operations, orders, products) and pulls fresh data from the API (`Api.users.syncUser`, `Api.users.getValidatorData`, `Api.users.uploadData`).

### API

Axios instance at `src/api/index.ts` — base URL **hardcoded** to `https://api.oitickets.com.br/api/v1` (no env var), Bearer token injected via request interceptor reading `useStore.getState().token`. Four sub-modules: `auth`, `validations`, `tickets`, `users`.

### Local Database (SQLite)

`expo-sqlite` via `src/services/sqlite/Database.ts`. Tables created on app startup in `App.tsx` (`createTables()`). Models live in `src/services/sqlite/models/`: `Product`, `Event`, `Combo`, `WebstoreTicket`, `ProductsList` (each a folder with `index.ts` + `operation_insert`/`operation_search`/`operation_update` raw-SQL helper files), plus flat single-file models `Validation.ts`, `Order.ts`, `Operations.ts`, `User.ts`.

### Validation Flow

Core logic: `src/utils/toolbox/auxFns/validateQR.ts` (`validateQR`)

1. Parse QR code → check if it belongs to the current event (`isTicketValidable`); retries with an `eventId/code` prefix if the first check fails.
2. Check local SQLite for a prior validation (`checkLocallyValidation`). If already validated locally and not yet synced, push the validation to the API and reject with the "already validated" message.
3. Otherwise resolve the product: look it up among the user's synced products (`getTicketName`/`getUserProducts`), and if it's not a known event ticket, fall back to checking the webstore-ticket API (`Api.tickets.getWebstoreTicketDetails`) — handles cancelled/unpaid webstore orders and combo products (`getComboForProduct`).
4. If the product isn't in the user's locally synced product list at all: trigger a silent sync (`onSync(false)`) and retry once (`retries` param caps this at one retry).
5. If online: re-check validation status via `Api.validations.checkTicketValidation`, re-check local SQLite, then POST via `Api.validations.validateTicket`. Response codes: `1` = success (writes to local SQLite via `Validation.insertValidation`, resolves, and opportunistically triggers a throttled background sync — 30s cooldown), `2` = already validated, `3` = unable to validate, other = cancelled ticket.
6. If offline: reject with a "no connection" message (offline-only validation is not yet implemented — see comment in `src/services/sync/validations.ts`).

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
