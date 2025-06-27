
// This file is no longer used for database connection.
// All database operations are now handled through Firebase Firestore.
// The queries are in 'src/lib/queries.ts' and the Firebase initialization is in 'src/lib/firebase.ts'.
// This file is kept to prevent breaking imports in any files that might have been missed,
// but it should be considered deprecated and can be removed in the future.

const DeprecationWarning = () => {
    console.warn("DEPRECATION WARNING: 'src/lib/db.ts' is deprecated. All database logic has been moved to Firebase/Firestore related files ('src/lib/firebase.ts', 'src/lib/queries.ts').");
}

DeprecationWarning();

export {};
