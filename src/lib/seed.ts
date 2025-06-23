
'use server';

import { db } from './firebase';
import { mockEmployees, mockSupervisors, mockTickets, mockProjects, mockJobCodes } from '@/data/mockData';
import { doc, writeBatch } from "firebase/firestore";

async function seedFirestore() {
  if (!db) {
    console.error("\n\n❌ Firestore is not initialized. Please check your Firebase config in .env.local and ensure the server has restarted.\n\n");
    process.exit(1);
  }
  console.log('🔄 Starting Firestore seed process...');
  const batch = writeBatch(db);

  try {
    // Note: We are not deleting old data. Seeding is an additive process here.
    // For a production app, you might want a separate script to clear collections.
    console.log('  - Preparing Projects...');
    mockProjects.forEach(p => {
      const docRef = doc(db, 'projects', p.id);
      batch.set(docRef, p);
    });

    console.log('  - Preparing Job Codes...');
    mockJobCodes.forEach(jc => {
      const docRef = doc(db, 'job_codes', jc.id);
      batch.set(docRef, jc);
    });

    console.log('  - Preparing Employees...');
    mockEmployees.forEach(emp => {
      const docRef = doc(db, 'employees', emp.psn.toString());
      batch.set(docRef, { ...emp, businessEmail: emp.businessEmail?.toLowerCase() });
    });

    console.log('  - Preparing Supervisors...');
    mockSupervisors.forEach(sup => {
      const docRef = doc(db, 'supervisors', sup.psn.toString());
      batch.set(docRef, { ...sup, businessEmail: sup.businessEmail?.toLowerCase() });
    });
    
    console.log('  - Preparing Tickets...');
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
