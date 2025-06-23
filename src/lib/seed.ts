
'use server';

import { config } from 'dotenv';
config(); // Load environment variables from .env.local

import { getFirestoreInstance } from './firebase';
import { mockEmployees, mockSupervisors, mockTickets, mockProjects, mockJobCodes } from '@/data/mockData';
import { doc, writeBatch, deleteDoc, collection, getDocs, query } from "firebase/firestore";

async function clearCollection(collectionName: string) {
    const db = getFirestoreInstance();
    if (!db) throw new Error("Firestore not initialized for clearing collection.");

    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log(`  - '${collectionName}' collection is already empty.`);
        return;
    }

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`  - Cleared all ${querySnapshot.size} documents from '${collectionName}' collection.`);
}


async function seedFirestore() {
  const db = getFirestoreInstance();
  if (!db) {
    throw new Error("\n\n❌ Firestore is not initialized. Please check your Firebase config in .env.local and ensure the server has restarted.\n\n");
  }
  
  console.log('🔄 Starting Firestore seed process...');
  
  try {
    // Clear existing data to ensure a fresh start
    console.log('--- Clearing Existing Data ---');
    // Clear ticket subcollections first if they exist, before clearing tickets
    const ticketsSnapshot = await getDocs(collection(db, 'tickets'));
    for (const ticketDoc of ticketsSnapshot.docs) {
        await clearCollection(`tickets/${ticketDoc.id}/attachments`);
    }
    await clearCollection('tickets');
    await clearCollection('projects');
    await clearCollection('job_codes');
    await clearCollection('employees');
    await clearCollection('supervisors');
    console.log('--- Data Cleared Successfully ---\n');

    const batch = writeBatch(db);

    console.log('--- Seeding New Data ---');
    console.log(`  - Preparing to seed ${mockProjects.length} projects...`);
    mockProjects.forEach(p => {
      const docRef = doc(db, 'projects', p.id);
      batch.set(docRef, p);
    });

    console.log(`  - Preparing to seed ${mockJobCodes.length} job codes...`);
    mockJobCodes.forEach(jc => {
      const docRef = doc(db, 'job_codes', jc.id);
      batch.set(docRef, jc);
    });

    console.log(`  - Preparing to seed ${mockEmployees.length} employees...`);
    mockEmployees.forEach(emp => {
      const docRef = doc(db, 'employees', emp.psn.toString());
      batch.set(docRef, { ...emp, businessEmail: emp.businessEmail?.toLowerCase() });
    });

    console.log(`  - Preparing to seed ${mockSupervisors.length} supervisors...`);
    mockSupervisors.forEach(sup => {
      const docRef = doc(db, 'supervisors', sup.psn.toString());
      batch.set(docRef, { ...sup, businessEmail: sup.businessEmail?.toLowerCase() });
    });
    
    console.log(`  - Preparing to seed ${mockTickets.length} tickets (with attachments)...`);
    mockTickets.forEach(ticket => {
        const { attachments, ...ticketData } = ticket;
        const docRef = doc(db, "tickets", ticket.id);
        batch.set(docRef, ticketData);
        
        if (attachments && attachments.length > 0) {
            attachments.forEach(att => {
                const attDocRef = doc(db, `tickets/${ticket.id}/attachments`, att.id);
                batch.set(attDocRef, att);
            });
        }
    });

    console.log('  - Committing batch write to Firestore... (This may take a moment)');
    await batch.commit();
    console.log('\n✅ Firestore seeding complete!');
    console.log(`   - Seeded ${mockProjects.length} projects`);
    console.log(`   - Seeded ${mockJobCodes.length} job codes`);
    console.log(`   - Seeded ${mockEmployees.length} employees`);
    console.log(`   - Seeded ${mockSupervisors.length} supervisors`);
    console.log(`   - Seeded ${mockTickets.length} tickets`);
    console.log('\nFirestore is now populated. Your application should be ready.');

  } catch (error) {
    console.error('❌ A critical error occurred during the Firestore seeding process:', error);
    throw error; // Re-throw the error to ensure the calling process knows it failed
  }
}

// This guard ensures the seed script ONLY runs when you
// explicitly execute `npm run db:seed` from the terminal.
if (require.main === module) {
  seedFirestore().catch(err => {
    console.error("Seeding script failed to execute:", err);
    process.exit(1);
  });
}
