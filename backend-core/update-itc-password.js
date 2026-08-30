const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'local_admin_3@itc.com' },
          { email: 'admin@itc.com' },
          { role: 'ADMIN_ECOLE' }
        ]
      },
    });

    if (!adminUser) {
        console.log('User not found');
        return;
    }

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    const updated = await prisma.user.update({
      where: { id: adminUser.id },
      data: { 
        email: 'admin@itc.com',
        password: hashedPassword 
      },
    });

    console.log('Password and email changed successfully for user ID:', updated.id);
    console.log('New Email:', updated.email);
    console.log('Matricule:', updated.matricule);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
