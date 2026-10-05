import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
  Auth,
} from 'firebase/auth';

// Safely import or fallback firebase config
let rawConfig: any = {};
try {
  // @ts-ignore
  rawConfig = await import('../../firebase-applet-config.json')
    .then((m) => m.default || m)
    .catch(() => ({}));
} catch (e) {
  rawConfig = {};
}

let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
let provider: GoogleAuthProvider | null = null;

try {
  const config =
    rawConfig && rawConfig.apiKey && rawConfig.projectId
      ? rawConfig
      : {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
          appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
        };

  if (config.apiKey && config.projectId) {
    app = !getApps().length ? initializeApp(config) : getApps()[0];
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/presentations');
  }
} catch (error) {
  console.warn('Firebase initialization skipped or failed:', error);
}

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }

  try {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (cachedAccessToken) {
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else if (!isSigningIn) {
          if (onAuthFailure) onAuthFailure();
        }
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    });
  } catch (err) {
    console.warn('Auth state change listener error:', err);
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!auth || !provider) {
    throw new Error(
      'Konfigurasi Firebase Auth belum tersedia di lingkungan ini. Pastikan kredensial Firebase telah diatur.'
    );
  }

  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal memperoleh token akses dari Google.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  if (auth) {
    await signOut(auth);
  }
  cachedAccessToken = null;
};
