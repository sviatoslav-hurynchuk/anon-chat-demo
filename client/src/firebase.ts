import { initializeApp } from 'firebase/app';
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock-auth-domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-project-id',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'mock-db-url',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock-storage-bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'mock-app-id'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Ensure each tab gets a new anonymous session
setPersistence(auth, browserSessionPersistence);
export const db = getDatabase(app);
