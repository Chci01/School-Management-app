const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seed() {
  console.log('🚀 Démarrage du peuplement de la base de données (kalansira-v1-app / default)...');
  
  try {
    const serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    // Get default database
    const db = getFirestore(app);

    // 1. Créer une école par défaut (CSKD)
    const schoolId = 'school_cskd_01';
    const schoolRef = db.collection('schools').doc(schoolId);
    
    console.log('--- Création de l\'école ---');
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    await schoolRef.set({
      name: 'Groupe Scolaire CSKD',
      email: 'admin@cskd.ml',
      isActive: true,
      licenseKey: 'KALAN-DEMO-2026',
      licenseExpiresAt: admin.firestore.Timestamp.fromDate(expirationDate),
      theme: 'light',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      logo: 'https://firebasestorage.googleapis.com/v0/b/kalan-sira.appspot.com/o/demo%2Flogo_cskd.jpg?alt=media',
      slogan: 'L\'excellence au service de l\'éducation',
    });
    console.log('✅ École CSKD créée.');

    // 2. Créer une année académique
    console.log('--- Création de l\'année académique ---');
    const yearId = 'year_2025_2026';
    await db.collection('academic_years').doc(yearId).set({
      schoolId: schoolId,
      name: '2025-2026',
      startDate: admin.firestore.Timestamp.fromDate(new Date('2025-09-01')),
      endDate: admin.firestore.Timestamp.fromDate(new Date('2026-06-30')),
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Année académique 2025-2026 créée.');

    // 3. Créer un administrateur d'école
    console.log('--- Création de l\'administrateur ---');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.collection('users').doc('user_admin_01').set({
      schoolId: schoolId,
      matricule: 'CSKD-ADMIN',
      email: 'admin@cskd.ml',
      password: hashedPassword,
      firstName: 'Administrateur',
      lastName: 'CSKD',
      role: 'ADMIN_ECOLE',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Compte Admin CSKD créé (Pass: admin123).');

    // 4. Créer quelques classes
    console.log('--- Création des classes ---');
    const classes = [
      { id: 'class_6eme', name: '6ème Année', level: 'Primaire', capacity: 50 },
      { id: 'class_9eme', name: '9ème Année', level: 'Fondamental', capacity: 45 },
      { id: 'class_terminale', name: 'Terminale', level: 'Lycée', capacity: 40 },
    ];

    for (const cls of classes) {
      await db.collection('classes').doc(cls.id).set({
        ...cls,
        schoolId: schoolId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log('✅ Classes de base créées.');

    console.log('\n✨ Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error);
    process.exit(1);
  }
}

seed();
