
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const usersCount = await prisma.user.count();
  const schoolsCount = await prisma.school.count();
  const users = await prisma.user.findMany({
    take: 5,
    include: { school: true }
  });

  console.log('--- DATABASE STATUS ---');
  console.log('Total Schools:', schoolsCount);
  console.log('Total Users:', usersCount);
  console.log('Recent Users:', JSON.stringify(users, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
