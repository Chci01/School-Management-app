const admin = require('firebase-admin');
require('dotenv').config();

async function testConnection() {
  console.log('Testing Firestore connection for project: kalansira-mali');
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    // Ensure no suffix in the JSON if I missed it
    serviceAccount.project_id = 'kalansira-mali';
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    const db = admin.firestore();
    const snapshot = await db.collection('schools').limit(1).get();
    console.log('Connection successful!');
    console.log('Number of schools found:', snapshot.size);
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
