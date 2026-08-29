const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Find School
    const school = await prisma.school.findFirst({
      where: {
        name: {
          contains: 'ITC FORM',
          mode: 'insensitive',
        },
      },
    });

    if (!school) {
        console.log('School ITC FORM not found');
        return;
    }

    console.log(`Found School: ${school.name} (ID: ${school.id})`);

    // 2. Find Admin User
    const adminUser = await prisma.user.findFirst({
      where: {
        schoolId: school.id,
        role: 'ADMIN_ECOLE',
      },
    });

    if (!adminUser) {
        console.log('Admin user not found for school');
        return;
    }

    console.log(`Found Admin User: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Matricule: ${adminUser.matricule}`);

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash('admin1234', 10);

    // 4. Update Admin User password
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword },
    });

    console.log('Password has been successfully changed to admin1234');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
