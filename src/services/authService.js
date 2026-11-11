import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, firebaseSetupError } from '../config/firebase.js';

let persistenceReady;

function requireAuth() {
  if (!auth || firebaseSetupError) {
    throw new Error(firebaseSetupError || 'Sign-in is currently unavailable.');
  }
  return auth;
}

function prepareAuth() {
  const instance = requireAuth();
  persistenceReady ??= setPersistence(instance, browserLocalPersistence);
  return persistenceReady;
}

export function observeAuth(onUser, onError) {
  let active = true;
  let unsubscribe = () => {};
  prepareAuth().then(() => {
    if (active) unsubscribe = onAuthStateChanged(requireAuth(), onUser, onError);
  }).catch((error) => { if (active) onError(error); });
  return () => { active = false; unsubscribe(); };
}

export async function signup(email, password) {
  await prepareAuth();
  return createUserWithEmailAndPassword(requireAuth(), email.trim(), password);
}

export async function login(email, password) {
  await prepareAuth();
  return signInWithEmailAndPassword(requireAuth(), email.trim(), password);
}

export async function loginWithGoogle() {
  await prepareAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(requireAuth(), provider);
}

export async function logout() {
  return signOut(requireAuth());
}

export function authErrorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/user-not-found': 'The email or password is incorrect.',
    'auth/wrong-password': 'The email or password is incorrect.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/email-already-in-use': 'An account with this email already exists. Try logging in.',
    'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
    'auth/password-does-not-meet-requirements': 'This password does not meet the account requirements.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/network-request-failed': 'Could not connect. Check your connection and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled. You can try again.',
    'auth/cancelled-popup-request': 'Another Google sign-in window was opened. Please use that window.',
    'auth/popup-blocked': 'Allow the sign-in popup in your browser, then try again.',
    'auth/account-exists-with-different-credential': 'This email uses another sign-in method. Log in with that method.',
    'auth/unauthorized-domain': 'Sign-in is unavailable on this website address. Please contact the site owner.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled yet.',
    'auth/web-storage-unsupported': 'Allow browser storage to keep your session signed in.',
    'auth/invalid-api-key': 'Sign-in settings need attention. Please contact the site owner.',
    'auth/configuration-not-found': 'Sign-in settings need attention. Please contact the site owner.',
  };
  if (messages[error?.code]) return messages[error.code];
  return error?.code ? 'Sign-in failed. Please try again.' : error?.message || 'Something went wrong. Please try again.';
}
