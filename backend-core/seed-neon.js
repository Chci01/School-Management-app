const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Démarrage du peuplement Neon PostgreSQL...');

  try {
    // 1. Créer une école par défaut (CSKD)
    console.log('--- Création de l\'école ---');
    const school = await prisma.school.upsert({
      where: { email: 'admin@cskd.ml' },
      update: {},
      create: {
        name: 'Groupe Scolaire CSKD',
        email: 'admin@cskd.ml',
        isActive: true,
        licenseKey: 'KALAN-DEMO-2026',
        licenseExpiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        theme: 'light',
        logo: 'https://firebasestorage.googleapis.com/v0/b/kalan-sira.appspot.com/o/demo%2Flogo_cskd.jpg?alt=media',
        slogan: 'L\'excellence au service de l\'éducation',
      },
    });
    console.log(`✅ École CSKD créée (ID: ${school.id})`);

    // 2. Créer une année académique
    console.log('--- Création de l\'année académique ---');
    await prisma.academicYear.create({
      data: {
        schoolId: school.id,
        name: '2025-2026',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-06-30'),
        isActive: true,
      },
    });
    console.log('✅ Année académique 2025-2026 créée.');

    // 3. Créer un administrateur d'école
    console.log('--- Création de l\'administrateur ---');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { matricule: 'CSKD-ADMIN' },
      update: {},
      create: {
        schoolId: school.id,
        matricule: 'CSKD-ADMIN',
        email: 'admin@cskd.ml',
        password: hashedPassword,
        firstName: 'Administrateur',
        lastName: 'CSKD',
        role: 'ADMIN_ECOLE',
        isActive: true,
      },
    });
    console.log('✅ Compte Admin CSKD créé (Pass: admin123).');

    // 4. Créer quelques classes
    console.log('--- Création des classes ---');
    const classes = [
      { name: '6ème Année', level: 'Primaire', capacity: 50 },
      { name: '9ème Année', level: 'Fondamental', capacity: 45 },
      { name: 'Terminale', level: 'Lycée', capacity: 40 },
    ];

    for (const cls of classes) {
      await prisma.class.create({
        data: {
          ...cls,
          schoolId: school.id,
        },
      });
    }
    console.log('✅ Classes de base créées.');

    console.log('\n✨ Neon PostgreSQL initialisé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding SQL :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
