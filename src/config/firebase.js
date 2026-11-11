import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const missingFirebaseFields = Object.entries(firebaseConfig)
  .filter(([, value]) => !value || value.startsWith('your-'))
  .map(([name]) => name);

export let auth = null;
export let firebaseSetupError = '';

if (missingFirebaseFields.length) {
  firebaseSetupError = 'Sign-in is being set up. Please try again later.';
} else {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Optional local integration testing. Production always uses Firebase.
    if (import.meta.env.DEV && import.meta.env.VITE_USE_AUTH_EMULATOR === 'true') {
      connectAuthEmulator(auth, import.meta.env.VITE_AUTH_EMULATOR_URL || 'http://127.0.0.1:9099');
    }
  } catch {
    firebaseSetupError = 'Sign-in could not start. Please try again later.';
  }
}
