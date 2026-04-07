const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const schools = await prisma.school.findMany({
    where: {
      name: { contains: 'KALIFA', mode: 'insensitive' }
    }
  });
  console.log('Schools matching "KALIFA":', schools.map(s => ({ id: s.id, name: s.name })));

  const cskdSchools = await prisma.school.findMany({
    where: {
      name: { contains: 'cskd', mode: 'insensitive' }
    }
  });
  console.log('Schools matching "cskd":', cskdSchools.map(s => ({ id: s.id, name: s.name })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
