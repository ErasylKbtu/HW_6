import { createContext, useEffect, useRef, useState } from 'react';
import * as authService from '../services/authService.js';
import { firebaseSetupError } from '../config/firebase.js';
import { invalidateCache } from '../services/cache.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState({ user: null, loading: true, error: '' });
  const [pending, setPending] = useState(false);
  const operationInProgress = useRef(false);

  useEffect(() => {
    if (firebaseSetupError) {
      setSession({ user: null, loading: false, error: firebaseSetupError });
      return;
    }
    return authService.observeAuth(
      (user) => {
        invalidateCache(['assignments']);
        setSession({ user, loading: false, error: '' });
      },
      (error) => setSession({ user: null, loading: false, error: authService.authErrorMessage(error) }),
    );
  }, []);

  async function run(action) {
    if (operationInProgress.current) throw new Error('Please wait for the current sign-in action.');
    operationInProgress.current = true;
    setPending(true);
    try { return await action(); }
    finally { operationInProgress.current = false; setPending(false); }
  }

  const value = {
    ...session,
    pending,
    signup: (email, password) => run(() => authService.signup(email, password)),
    login: (email, password) => run(() => authService.login(email, password)),
    loginWithGoogle: () => run(authService.loginWithGoogle),
    logout: () => run(authService.logout),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
