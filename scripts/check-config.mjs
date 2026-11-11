import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_');
const names = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];
const invalid = names.filter((name) => {
  const value = env[name];
  return !value || value.startsWith('your-') || value.startsWith('demo-');
});
if (invalid.length || env.VITE_USE_AUTH_EMULATOR === 'true') {
  console.error('Firebase setup is required before deployment. Follow SETUP_RU.md.');
  if (invalid.length) console.error(`Missing or example values: ${invalid.join(', ')}`);
  if (env.VITE_USE_AUTH_EMULATOR === 'true') console.error('Use production Firebase settings for deployment.');
  process.exitCode = 1;
} else {
  console.log('All six Firebase environment variables are present.');
}
