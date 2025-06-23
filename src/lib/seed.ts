
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
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    if(!querySnapshot.empty){
        await batch.commit();
        console.log(`  - Cleared all documents from '${collectionName}' collection.`);
    } else {
        console.log(`  - '${collectionName}' collection is already empty.`);
    }
}


async function seedFirestore() {
  const db = getFirestoreInstance();
  if (!db) {
    throw new Error("\n\n❌ Firestore is not initialized. Please check your Firebase config in .env.local and ensure the server has restarted.\n\n");
  }
  
  console.log('🔄 Starting Firestore seed process...');
  
  try {
    // Clear existing data to ensure a fresh start
    console.log('  - Clearing existing data...');
    await clearCollection('tickets');
    await clearCollection('projects');
    await clearCollection('job_codes');
    await clearCollection('employees');
    await clearCollection('supervisors');

    const batch = writeBatch(db);

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
    
    console.log(`  - Preparing to seed ${mockTickets.length} tickets...`);
    mockTickets.forEach(ticket => {
        const docRef = doc(db, "tickets", ticket.id);
        const { attachments, ...ticketData } = ticket;
        batch.set(docRef, ticketData);
        if (attachments) {
            attachments.forEach(att => {
                const attDocRef = doc(db, `tickets/${ticket.id}/attachments`, att.id);
                batch.set(attDocRef, att);
            });
        }
    });

    console.log('  - Committing batch write to Firestore... (This may take a moment)');
    await batch.commit();
    console.log('✅ Firestore seeding complete!');
    console.log(`   - ${mockProjects.length} projects`);
    console.log(`   - ${mockJobCodes.length} job codes`);
    console.log(`   - ${mockEmployees.length} employees`);
    console.log(`   - ${mockSupervisors.length} supervisors`);
    console.log(`   - ${mockTickets.length} tickets`);
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
