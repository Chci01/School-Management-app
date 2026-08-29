const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      include: {
        school: true
      }
    });

    console.log('Users in database:');
    users.forEach(u => {
      console.log(`- ${u.firstName} ${u.lastName} | Role: ${u.role} | Matricule: ${u.matricule} | Email: ${u.email} | School: ${u.school ? u.school.name : 'N/A'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
