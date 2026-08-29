const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testRegistration() {
  try {
    console.log('Testing Registration...');
    const hashedPassword = await bcrypt.hash('secretPass123', 10);
    const trialExpiration = new Date();
    trialExpiration.setDate(trialExpiration.getDate() + 7);

    const result = await prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: 'Test School',
          email: 'test@school.com',
          isActive: true,
          licenseExpiresAt: trialExpiration,
        }
      });
      console.log('School created:', school.id);

      await tx.user.create({
        data: {
          schoolId: school.id,
          matricule: 'ADMIN-' + school.id.substring(0, 5).toUpperCase() + Math.floor(Math.random() * 1000).toString(),
          email: 'test@school.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Test School',
          role: 'ADMIN_ECOLE',
        }
      });
      return school;
    });
    console.log('Success!', result);
  } catch (err) {
    console.error('Registration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}
testRegistration();
