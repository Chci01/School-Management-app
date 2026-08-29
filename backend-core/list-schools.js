const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    console.log('Schools in database:');
    schools.forEach(s => {
      console.log(`- ${s.name} (ID: ${s.id})`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
