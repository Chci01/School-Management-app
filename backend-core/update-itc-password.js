const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'local_admin_3@itc.com',
      },
    });

    if (!adminUser) {
        console.log('User not found');
        return;
    }

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword },
    });

    console.log('Password changed successfully for local_admin_3@itc.com to admin1234');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
