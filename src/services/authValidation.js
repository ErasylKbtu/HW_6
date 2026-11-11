export function validateAuthForm({ email, password, confirmPassword }, signup = false) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.';
  if (!password) return 'Enter your password.';
  if (signup && password.length < 6) return 'Use at least 6 characters for your password.';
  if (signup && password !== confirmPassword) return 'Your passwords do not match.';
  return '';
}
