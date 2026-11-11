// Optional integration check against the local Firebase Auth Emulator.
import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator, createUserWithEmailAndPassword, getAuth,
  inMemoryPersistence, onAuthStateChanged, setPersistence,
  signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import assert from 'node:assert/strict';

const app = initializeApp({ apiKey: 'demo-test-key', projectId: 'demo-studyflow-hw6' });
const auth = getAuth(app);
connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
await setPersistence(auth, inMemoryPersistence);
const email = `sdk-test-${Date.now()}@example.test`;
const created = await createUserWithEmailAndPassword(auth, email, 'test-pass-123');
const uid = created.user.uid;
assert.equal(created.user.email, email);
await signOut(auth);
assert.equal(auth.currentUser, null);
await assert.rejects(signInWithEmailAndPassword(auth, email, 'wrong-password'));
const signedIn = await signInWithEmailAndPassword(auth, email, 'test-pass-123');
assert.equal(signedIn.user.uid, uid);
await new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user?.uid === uid) { unsubscribe(); resolve(); }
  });
});
await signOut(auth);
console.log('Auth Emulator passed: signup, invalid password, login, observer and logout.');
process.exit(0);
