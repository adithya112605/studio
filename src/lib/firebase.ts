
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// --- Log raw environment variables (for debugging purposes ONLY) ---
// Server-side logging
if (typeof window === "undefined") {
  console.log("--- Firebase Server-Side: Raw Environment Variables (process.env) ---");
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
} else {
  // Client-side logging (variables prefixed with NEXT_PUBLIC_ should be available)
  console.log("--- Firebase Client-Side: Raw Environment Variables (process.env) ---");
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  console.log("Raw process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// --- Log constructed firebaseConfig object ---
const contextForConfigLog = typeof window === "undefined" ? "Server-Side" : "Client-Side";
console.log(`--- Firebase ${contextForConfigLog}: Constructed firebaseConfig Object ---`);
console.log(`firebaseConfig.apiKey:`, firebaseConfig.apiKey ? (firebaseConfig.apiKey.substring(0,5) + "...") : "MISSING/UNDEFINED");
console.log(`firebaseConfig.authDomain:`, firebaseConfig.authDomain);
console.log(`firebaseConfig.projectId:`, firebaseConfig.projectId);
console.log(`firebaseConfig.storageBucket:`, firebaseConfig.storageBucket);
console.log(`firebaseConfig.messagingSenderId:`, firebaseConfig.messagingSenderId);
console.log(`firebaseConfig.appId:`, firebaseConfig.appId);
console.log(`firebaseConfig.measurementId:`, firebaseConfig.measurementId);


let app: FirebaseApp;
let auth: Auth;

// Robust check for critical Firebase configuration
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


if (criticalConfigParts.length > 0) {
  const errorMsg = `Critical Firebase config (${criticalConfigParts.join(', ')}) is missing or a placeholder. Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env.local file and the server has been restarted.`;
  const context = typeof window === "undefined" ? "Server-Side" : "Client-Side";
  
  console.error(`[Firebase Setup Error - ${context}] ${errorMsg}`);
  console.error(`[Firebase Setup Error - ${context}] Problematic Config Values Being Used:`, {
    apiKeyStatus: firebaseConfig.apiKey ? (firebaseConfig.apiKey.includes("YOUR_") || firebaseConfig.apiKey.length < 10 ? "PLACEHOLDER_OR_SHORT" : "VALID_FORMAT") : "MISSING_OR_UNDEFINED",
    authDomainStatus: firebaseConfig.authDomain ? (firebaseConfig.authDomain.includes("YOUR_") ? "PLACEHOLDER" : "VALID_FORMAT") : "MISSING_OR_UNDEFINED",
    projectIdStatus: firebaseConfig.projectId ? (firebaseConfig.projectId.includes("YOUR_") ? "PLACEHOLDER" : "VALID_FORMAT") : "MISSING_OR_UNDEFINED",
  });
  
  throw new Error("Firebase Initialization Blocked: " + errorMsg);
}

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== "undefined") {
        console.log("[CLIENT-SIDE SUCCESS] Firebase App initialized successfully.");
    } else {
        console.log("[SERVER-SIDE SUCCESS] Firebase App initialized successfully.");
    }
  } catch (e: any) {
    const context = typeof window === "undefined" ? "Server-Side" : "Client-Side";
    console.error(`[Firebase Setup Error - ${context}] Firebase initializeApp error:`, e.message || e);
    console.error(`[Firebase Setup Error - ${context}] Config used at time of error:`, {
        apiKey: firebaseConfig.apiKey ? (firebaseConfig.apiKey.substring(0,5) + "...") : "MISSING/UNDEFINED",
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId
    });
    throw new Error(`Firebase could not be initialized during initializeApp (${context}). Check console for details. Ensure all .env.local variables are correct and the server was restarted.`);
  }
} else {
  app = getApps()[0];
   if (typeof window !== "undefined") {
        console.log("[CLIENT-SIDE INFO] Firebase App already initialized, using existing instance.");
    } else {
        console.log("[SERVER-SIDE INFO] Firebase App already initialized, using existing instance.");
    }
}

try {
  auth = getAuth(app);
  if (typeof window !== "undefined") {
      console.log("[CLIENT-SIDE SUCCESS] Firebase Auth initialized successfully.");
  } else {
      console.log("[SERVER-SIDE SUCCESS] Firebase Auth initialized successfully.");
  }
} catch (e: any) {
  const context = typeof window === "undefined" ? "Server-Side" : "Client-Side";
  console.error(`[Firebase Setup Error - ${context}] Firebase getAuth error:`, e.message || e);
   console.error(`[Firebase Setup Error - ${context}] Config used at time of error:`, {
        apiKey: firebaseConfig.apiKey ? (firebaseConfig.apiKey.substring(0,5) + "...") : "MISSING/UNDEFINED",
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId
    });
  throw new Error(`Firebase Auth could not be initialized during getAuth (${context}). Check console for details. Ensure all .env.local variables are correct and the server was restarted. Specific Firebase error: ${e.message}`);
}

export { app, auth };

