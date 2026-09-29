import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Initialize Firebase Admin SDK.
 *
 * Automatically resolves service-account.json from project root
 * or GOOGLE_APPLICATION_CREDENTIALS / FIREBASE_SERVICE_ACCOUNT env.
 */
function initFirebaseAdmin() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
    return initializeApp({
      credential: cert(serviceAccount),
      databaseURL,
    });
  }

  // Check if service-account.json exists in project root or custom path
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const possiblePaths = [
    credPath ? path.resolve(process.cwd(), credPath) : '',
    path.resolve(__dirname, '../../service-account.json'),
    path.resolve(process.cwd(), 'service-account.json')
  ].filter(Boolean);

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return initializeApp({
        credential: cert(p),
        databaseURL,
      });
    }
  }

  // Fallback to ADC
  return initializeApp({ databaseURL });
}

const app = initFirebaseAdmin();

/** Firebase Auth Admin instance for verifying ID tokens */
export const auth = getAuth(app);

/** Firebase Realtime Database Admin instance */
export const db = getDatabase(app);
