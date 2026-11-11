import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth.js';
import { authErrorMessage } from '../services/authService.js';
import { validateAuthForm } from '../services/authValidation.js';
import { Loading } from './StateViews.jsx';
import Icon from './Icon.jsx';

export default function AuthForm({ signup = false }) {
  const auth = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const requestedPath = location.state?.from;
  const destination = typeof requestedPath === 'string' && /^\/(?!\/)/.test(requestedPath)
    ? requestedPath : '/profile';

  function change(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    const message = validateAuthForm(form, signup);
    if (message) { setError(message); return; }
    setError('');
    try {
      if (signup) await auth.signup(form.email, form.password);
      else await auth.login(form.email, form.password);
    } catch (failure) { setError(authErrorMessage(failure)); }
  }

  async function googleSignIn() {
    setError('');
    try { await auth.loginWithGoogle(); }
    catch (failure) { setError(authErrorMessage(failure)); }
  }

  if (auth.loading) return <Loading text="Checking your session…" />;
  if (auth.user) return <Navigate to={destination} replace />;
  const disabled = auth.pending || Boolean(auth.error);

  return <section className="auth-page">
    <div className="auth-story">
      <p className="eyebrow">A LITTLE STRUCTURE. MORE FOCUS.</p>
      <h1>{signup ? 'A fresh start.' : 'Welcome back.'}<br /><span>A clearer day.</span></h1>
      <p>Your next step is waiting. Sign in to your StudyFlow profile and keep moving at your own pace.</p>
      <div className="auth-illustration" aria-hidden="true"><span className="auth-orbit" /><span className="auth-book"><Icon name="book" size={48} /></span><span className="auth-check"><Icon name="check" size={22} /></span></div>
      <p className="auth-story-caption">ONE TASK AT A TIME.</p>
    </div>
    <div className="panel auth-card">
      <span className="auth-label">YOUR STUDENT WORKSPACE</span>
      <h2>{signup ? 'Create your account' : 'Log in to StudyFlow'}</h2>
      <p className="auth-intro">{signup ? 'Make a little space for your next step.' : 'Good to see you. Let’s pick up where you left off.'}</p>
      {auth.error && <div className="inline-error" role="alert">{auth.error}</div>}
      {import.meta.env.DEV && auth.error && <p className="auth-dev-note">Project setup: copy .env.example to .env.local, add your Firebase Web App settings, then restart Vite. See SETUP_RU.md.</p>}
      {error && <div className="inline-error" role="alert">{error}</div>}
      <form onSubmit={submit} noValidate>
        <fieldset disabled={disabled}>
          <label htmlFor="auth-email">Email address</label>
          <input id="auth-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={form.email} onChange={change} />
          <label htmlFor="auth-password">Password</label>
          <input id="auth-password" name="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? 6 : undefined} placeholder={signup ? 'At least 6 characters' : 'Your password'} value={form.password} onChange={change} />
          {signup && <><label htmlFor="auth-confirm">Confirm password</label><input id="auth-confirm" name="confirmPassword" type="password" autoComplete="new-password" required placeholder="Enter your password again" value={form.confirmPassword} onChange={change} /><p className="auth-hint">Use at least 6 characters. Both passwords must match.</p></>}
          <button className="button primary auth-submit" type="submit">{auth.pending ? 'Please wait…' : signup ? 'Create account' : 'Log in'}<Icon name="arrow" size={17} /></button>
        </fieldset>
      </form>
      <div className="auth-divider"><span>or continue with</span></div>
      <button className="button secondary google-button" disabled={disabled} onClick={googleSignIn}><span className="google-mark" aria-hidden="true">G</span>Continue with Google</button>
      <p className="auth-switch">{signup ? 'Already have an account?' : 'New to StudyFlow?'} <Link to={signup ? '/login' : '/signup'} state={location.state}>{signup ? 'Log in' : 'Create an account'}</Link></p>
      <Link className="auth-back" to="/assignments">← Back to assignments</Link>
    </div>
  </section>;
}
