import { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { authErrorMessage } from '../services/authService.js';

export default function LogoutButton({ className = 'button secondary' }) {
  const { logout, pending } = useAuth();
  const [error, setError] = useState('');
  async function handleLogout() {
    setError('');
    try { await logout(); }
    catch (failure) { setError(authErrorMessage(failure)); }
  }
  return <div className="logout-control">
    <button className={className} disabled={pending} onClick={handleLogout}>Log out</button>
    {error && <p className="auth-inline-error" role="alert">{error}</p>}
  </div>;
}
