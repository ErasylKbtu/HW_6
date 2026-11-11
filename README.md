# StudyFlow — React Homework 06

**Karas Yerassyl · Information Systems · KBTU**

StudyFlow extends my Homework 05 React Router assignment planner with Firebase Authentication and API caching. It includes email/password signup and login, Google sign-in, persistent sessions, a protected profile, and conditional account navigation. The previous assignment list, detail pages, search, filters, sorting, pagination, dashboard, CRUD actions, and API playground are preserved.

## Setup and run

Use Node.js 22.12+ or Node.js 24.

```bash
npm ci
```

Copy `.env.example` to `.env.local`, replace all six values with your Firebase Web App settings, and then start the application.

PowerShell:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Restart Vite after editing `.env.local`. For step-by-step Firebase and GitHub instructions, open **SETUP_RU.md**.

The code can be reviewed and the planner can be used before Firebase configuration. Authentication becomes available after the Firebase project and providers are configured. `npm run check:config` detects missing/example environment values before deployment.

## Firebase configuration

1. Create a Firebase project in the Firebase Console and register a Web App.
2. Open Authentication and enable **Email/Password** and **Google** under Sign-in method. Select the required project support email for Google.
3. Copy the Web App configuration from Project settings → General → Your apps into `.env.local`.
4. In Authentication → Settings → Authorized domains, add `localhost`, `127.0.0.1`, and your deployed hostname, for example `erasylkbtu.github.io`. Enter a hostname without a scheme or repository path.
5. Run `npm run check:config`, restart Vite, and test both providers.

| Firebase Web App property | Environment variable |
| --- | --- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

The client configuration uses the public Firebase Web App values. Vite embeds `VITE_` values into the browser bundle at build time. Keep administrator credentials, service-account JSON and private keys out of this application. `.env.local` is ignored by Git; `.env.example` is committed with placeholders.

## Authentication implementation

- `src/config/firebase.js` initializes Firebase from environment variables.
- `src/services/authService.js` owns Firebase SDK calls, error messages, and local session persistence.
- `src/auth/AuthContext.jsx` exports `AuthContext` and `AuthProvider`. It uses `onAuthStateChanged` through the auth service to track the current user and the initial loading state.
- `src/hooks/useAuth.js` exposes the authentication context to components.
- `src/components/AuthForm.jsx` provides the shared form for `/login` and `/signup`, including matching-password validation, errors, and Google sign-in.
- `src/auth/ProtectedRoute.jsx` waits for session restoration, redirects guests to `/login`, and returns them to their requested route after login.
- `/profile` displays the Firebase email, UID, provider, and logout button.
- NavBar displays Login/Signup for guests and Profile/Logout for authenticated users.

Firebase uses `browserLocalPersistence` through `setPersistence`. Refresh restores the session via the SDK; the protected route waits for `onAuthStateChanged` before deciding whether to redirect. Passwords stay in the form and are passed to Firebase Authentication. Firebase manages session storage.

The assignment dataset remains the browser-local fake API from HW_5. It is shared by visits on the same origin. Authentication protects the profile page. Account-specific cloud task storage would require additional backend work outside this assignment.

## Caching strategy and invalidation

The custom cache is implemented in `src/services/cache.js` and used at the API boundary in `src/services/service.js`.

| Query key | Cached resource |
| --- | --- |
| `["assignments", "list"]` | Full unfiltered list of assignment summaries |
| `["assignments", "detail", id]` | Full details of one assignment |

**Expiration / revalidation:** successful results stay in an in-memory Map for **60 seconds**, measured from completion of the request. A fresh result is returned as a copy without another simulated network request. An expired result is fetched again on the next read. The cache clears on page refresh, while the underlying assignment database persists in localStorage.

Search, status/priority/course filters, sorting and pagination are applied to the cached full summary list inside `getAssignments()`. The raw list is independent of those parameters, so one list key can safely serve different URLs. Each detail uses its own ID in the query key. Dashboard reads the complete list and calculates its filtered statistics.

**Invalidation:** successful create, update, complete/reopen and delete operations invalidate every `assignments` cache entry. RootLayout then increments `revision`, making the active data view read fresh data. Failed writes leave the last successful cache intact. Reload and Try again clear the assignment cache and make a new request. Authentication changes, storage changes from another tab, network-profile changes and fail-next-request demo buttons also clear this cache.

**Outdated requests:** the cache tracks the latest request for each key. An invalidation or newer request prevents an older response from populating the cache. `useApi` uses AbortController, an active flag and a request identity so an obsolete response cannot replace current UI results. Cancelled and failed responses are never cached. Cached records are cloned before they are returned.

There is no polling or background timer. Revalidation happens on the next read after expiration or after explicit invalidation. This keeps the strategy easy to follow and avoids unnecessary requests.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | Project and author |
| `/assignments` | Search, filters, sorting and pagination |
| `/assignments/:id` | Details, edit, complete/reopen and remove |
| `/dashboard` | Four statistics, two breakdowns and course filter |
| `/login` | Email/password and Google login |
| `/signup` | Signup with password confirmation and validation |
| `/profile` | Protected profile with email, UID and logout |
| `*` | Custom 404 |

HashRouter keeps direct links and refresh working on static GitHub Pages. Example: `https://your-host/#/assignments?priority=High&page=2`. Seven page modules use React.lazy/Suspense.

## Project structure

| Location | Responsibility |
| --- | --- |
| `src/App.jsx` | Routing, AuthProvider, lazy imports and Suspense |
| `src/layouts/RootLayout.jsx` | Shared shell, Outlet and task actions |
| `src/auth/` | Authentication context and protected route |
| `src/config/firebase.js` | Firebase initialization |
| `src/services/authService.js` | Firebase operations and persistence |
| `src/services/authValidation.js` | Login/signup validation |
| `src/services/service.js` | Fake API, validation and task persistence |
| `src/services/cache.js` | Query keys, TTL and invalidation |
| `src/hooks/` | useAuth and useApi |
| `src/pages/` | Route pages |
| `src/components/` | Shared UI, cards, forms and states |
| `src/styles/main.css` | Responsive styling |

UI components do not access localStorage or call Firebase/network APIs directly. They use services and hooks. The original storage key `studyflow-assignments-v1` preserves existing valid HW_5 records on the same origin.

## Checks

```bash
npm test
npm run lint
npm run build
npm run check:config
```

Unit tests cover CRUD, URL-style filtering, cancellation, failed writes, cache reuse, expiration, invalidation after mutations, out-of-order responses, cloned cache data, and signup validation.

`npm run build` checks that production code compiles. `npm run check:config` checks the six Firebase values and rejects placeholders/emulator configuration. The final acceptance check requires your own Firebase project, enabled providers, authorized hostname, and both sign-in methods tested on the deployed site.

### Optional Auth Emulator check

```bash
npx --yes firebase-tools emulators:exec --only auth --project demo-studyflow-hw6 --config firebase.test.json "node tests/auth-emulator.mjs"
```

This isolated SDK integration test uses a temporary demo project and verifies signup, wrong-password errors, login, the auth observer and logout. It uses Node in-memory persistence. Browser session persistence and the real Google provider are verified against your configured project during the final browser check.

## Deploy from PowerShell

After configuring your Firebase project and creating the intended GitHub repository:

```powershell
npm run check:config
npm run deploy -- -r https://github.com/ErasylKbtu/HW_6.git
```

The `predeploy` script checks configuration and builds `dist` before gh-pages publishes it. Set GitHub Settings → Pages → Source to **Deploy from a branch**, branch **gh-pages**, folder **/(root)**. This command publishes the built site; push source files to `main` as described in SETUP_RU.md.

## Alternative: GitHub Actions deployment

The included workflow builds on GitHub. Add all six `VITE_FIREBASE_*` values as **Repository secrets** under Settings → Secrets and variables → Actions. Select Settings → Pages → Source → **GitHub Actions**. Then push main or run the workflow manually.

GitHub Actions cannot read your ignored local `.env.local`; its build receives the six values from repository secrets. It validates those values before publishing.

## Submission and defense

Submit the GitHub repository URL containing this README and `.env.example`, plus the working deployed URL. Press Turn In before the deadline. Demonstrate signup, email/password login, Google sign-in, session restoration after refresh, protected profile, logout, and the existing assignment functions.

For caching, explain the two key types, 60-second TTL and mutation invalidation above. Demonstrate that returning to a recently visited task reuses its response, while Reload and saving changes fetch fresh data. API playground can demonstrate loading and error recovery.

## Documentation

- Firebase Authentication: https://firebase.google.com/docs/auth/web/start
- Google sign-in: https://firebase.google.com/docs/auth/web/google-signin
- Session persistence: https://firebase.google.com/docs/auth/web/auth-state-persistence
- Vite environment variables: https://vite.dev/guide/env-and-mode
