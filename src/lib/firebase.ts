
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && {
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }),
};

// This function checks if the essential Firebase config values are present and not placeholders.
function isFirebaseConfigured(): boolean {
  if (
    !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("YOUR_") ||
    !firebaseConfig.projectId || firebaseConfig.projectId.startsWith("YOUR_")
  ) {
    const context = typeof window === "undefined" ? "Server-Side" : "Client-Side";
    console.warn(`[Firebase Config Warning - ${context}] Critical Firebase config (apiKey or projectId) is missing or a placeholder. Firebase will not be initialized. Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env.local file and the server has been restarted.`);
    return false;
  }
  return true;
}

// Singleton pattern to get the Firebase app instance
const getAppInstance = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) return null;
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
};

// Singleton pattern to get the Auth instance
const getAuthInstance = (): Auth | null => {
  const app = getAppInstance();
  return app ? getAuth(app) : null;
};

// Singleton pattern to get the Firestore instance
const getFirestoreInstance = (): Firestore | null => {
  const app = getAppInstance();
  return app ? getFirestore(app) : null;
};

// Export the singleton getter functions
export { getAppInstance, getAuthInstance, getFirestoreInstance };
