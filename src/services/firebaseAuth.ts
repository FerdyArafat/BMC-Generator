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
let defaultProvider: GoogleAuthProvider | null = null;
let slidesProvider: GoogleAuthProvider | null = null;

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
    // Standard provider for normal login (NON-SENSITIVE: will NEVER trigger "Akses Diblokir")
    defaultProvider = new GoogleAuthProvider();

    // Dedicated provider requesting Google Slides write access
    slidesProvider = new GoogleAuthProvider();
    slidesProvider.addScope('https://www.googleapis.com/auth/presentations');
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
          if (onAuthSuccess) onAuthSuccess(user, '');
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

/**
 * Standard Google Login (Basic profile & email)
 * NEVER blocked by Google App Verification!
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!auth || !defaultProvider) {
    throw new Error(
      'Konfigurasi Firebase Auth belum tersedia di lingkungan ini. Pastikan kredensial Firebase telah diatur.'
    );
  }

  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, defaultProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // credential.accessToken might be present or not needed for basic auth
    const token = credential?.accessToken || '';
    cachedAccessToken = token;
    return { user: result.user, accessToken: token };
  } catch (error: any) {
    console.error('Sign in error:', error);
    if (error?.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'Netlify';
      throw new Error(
        `Domain ${currentHost} belum didaftarkan di Firebase Console. Silakan tambahkan "${currentHost}" ke Firebase Authentication > Settings > Authorized domains.`
      );
    }
    if (error?.code === 'auth/popup-blocked') {
      throw new Error('Jendela popup login diblokir peramban. Harap izinkan popup untuk situs ini.');
    }
    if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('Jendela login ditutup sebelum proses selesai.');
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Request Google Slides access specifically for presentation export
 */
export const requestSlidesAccess = async (): Promise<string> => {
  if (!auth || !slidesProvider) {
    throw new Error('Firebase Auth belum siap.');
  }

  try {
    const result = await signInWithPopup(auth, slidesProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan izin akses Google Slides dari Google.');
    }
    cachedAccessToken = credential.accessToken;
    return cachedAccessToken;
  } catch (error: any) {
    console.error('Slides permission error:', error);
    if (
      error?.message?.includes('verifikasi') ||
      error?.message?.includes('unverified') ||
      error?.code === 'auth/access-denied'
    ) {
      throw new Error(
        'Aplikasi ini belum menyelesaikan verifikasi Google untuk akses Slides. Silakan gunakan Ekspor PDF Eksekutif yang siap pakai tanpa memerlukan izin Google, atau tambahkan email Anda ke Test Users di Google Cloud Console.'
      );
    }
    throw error;
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
