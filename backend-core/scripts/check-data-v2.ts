
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const schools = await prisma.school.findMany();
    console.log('--- SCHOOLS ---');
    console.log(JSON.stringify(schools, null, 2));

    const users = await prisma.user.findMany({
      include: { school: true }
    });
    console.log('\n--- USERS ---');
    console.log(JSON.stringify(users.map(u => ({
        id: u.id,
        matricule: u.matricule,
        role: u.role,
        schoolName: u.school?.name,
        schoolId: u.schoolId
    })), null, 2));
  } catch (err) {
    console.error('Error checking database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
