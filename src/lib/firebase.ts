
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Conditionally add measurementId if it exists
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && {
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }),
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

const criticalConfigParts: string[] = [];
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_") || firebaseConfig.apiKey.length < 10) {
  criticalConfigParts.push("apiKey is a placeholder or too short");
}
if (!firebaseConfig.authDomain || firebaseConfig.authDomain.includes("YOUR_")) {
  criticalConfigParts.push("authDomain is a placeholder");
}
if (!firebaseConfig.projectId || firebaseConfig.projectId.includes("YOUR_")) {
  criticalConfigParts.push("projectId is a placeholder");
}

if (criticalConfigParts.length === 0) {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e: any) {
      const context = typeof window === "undefined" ? "Server-Side" : "Client-Side";
      console.error(`[Firebase Setup Error - ${context}] Firebase initializeApp error:`, e.message || e);
    }
  } else {
    app = getApps()[0];
  }

  if (app) {
    try {
      auth = getAuth(app);
      db = getFirestore(app);
    } catch (e: any) {
      const context = typeof window === "undefined" ? "Server-Side" : "Client-Side";
      console.error(`[Firebase Setup Error - ${context}] Firebase getAuth/getFirestore error:`, e.message || e);
    }
  }
} else {
  const warningMsg = `Critical Firebase config (${criticalConfigParts.join(', ')}) is missing or a placeholder. Firebase initialization has been SKIPPED. The app will run, but authentication and database features will NOT work.`;
  const context = typeof window === "undefined" ? "Server-Side" : "Client-Side";
  // Use console.warn to be less alarming than console.error for configuration issues.
  console.warn(`[Firebase Config Warning - ${context}] ${warningMsg}`);
  console.warn(`[Firebase Config Warning - ${context}] Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env.local file and the server has been restarted.`);
}

export { app, auth, db };
