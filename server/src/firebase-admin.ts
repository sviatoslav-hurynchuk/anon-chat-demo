import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

/**
 * Initialize Firebase Admin SDK.
 *
 * For local dev, set GOOGLE_APPLICATION_CREDENTIALS env to path of
 * your service-account.json file, OR set FIREBASE_SERVICE_ACCOUNT
 * env to the JSON string of the service account.
 *
 * For Google Cloud (Cloud Run / Cloud Functions), ADC is automatic.
 */
function initFirebaseAdmin() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  const databaseURL = process.env.FIREBASE_DATABASE_URL || 'https://YOUR_PROJECT_ID.firebaseio.com';

  if (serviceAccountJson) {
    // Parse JSON string from env variable
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
    return initializeApp({
      credential: cert(serviceAccount),
      databaseURL,
    });
  }

  // Falls back to GOOGLE_APPLICATION_CREDENTIALS env or ADC
  return initializeApp({ databaseURL });
}

const app = initFirebaseAdmin();

/** Firebase Auth Admin instance for verifying ID tokens */
export const auth = getAuth(app);

/** Firebase Realtime Database Admin instance */
export const db = getDatabase(app);
