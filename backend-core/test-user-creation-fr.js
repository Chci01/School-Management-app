const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const schoolId = 'ecbc8957-336c-4949-a029-3646222414ae'; // KALIFA DOUMBIA
  
  console.log('🚀 Testing ELEVE creation with French roles...');
  try {
    const pupil = await prisma.user.create({
      data: {
        schoolId,
        matricule: 'EL-TEST-' + Date.now(),
        firstName: 'Test-FR',
        lastName: 'Eleve',
        role: 'ELEVE',
        password: 'password',
        studentProfile: {
          create: {
            birthDate: new Date('2010-01-01'),
            address: 'Test Address'
          }
        }
      }
    });
    console.log('✅ Successfully created ELEVE:', pupil.id);
  } catch (err) {
    console.error('❌ Failed to create ELEVE:', err.message);
  }

  console.log('🚀 Testing ENSEIGNANT creation...');
  try {
    const teacher = await prisma.user.create({
      data: {
        schoolId,
        matricule: 'ENS-TEST-' + Date.now(),
        firstName: 'Test-FR',
        lastName: 'Enseignant',
        role: 'ENSEIGNANT',
        password: 'password',
        staffProfile: {
          create: {
            position: 'Professeur'
          }
        }
      }
    });
    console.log('✅ Successfully created ENSEIGNANT:', teacher.id);
  } catch (err) {
    console.error('❌ Failed to create ENSEIGNANT:', err.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
