const admin = require('firebase-admin');
require('dotenv').config();

async function debug() {
  console.log('Debugging Service Account...');
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    console.log('Raw string length:', raw ? raw.length : 0);
    
    const serviceAccount = JSON.parse(raw);
    console.log('Parsed project_id:', serviceAccount.project_id);
    console.log('Parsed client_email:', serviceAccount.client_email);
    
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    const db = app.firestore();
    console.log('Firestore instance created.');
    
    // Try to get collections
    console.log('Attempting to list collections...');
    const collections = await db.listCollections();
    console.log('Collections found:', collections.map(c => c.id));
    
    process.exit(0);
  } catch (error) {
    console.error('Debug failed:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

debug();
