import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- TESTING LOGIN PAYLOAD ---');
  const matricule = 'ETU_EXC_001';
  const pass = 'password123';
  
  const user = await prisma.user.findFirst({
    where: { matricule }
  });

  if (!user) {
    console.log(`User ${matricule} NOT FOUND in DB.`);
    return;
  }
  
  console.log(`Found User: ${user.firstName} ${user.lastName}`);
  console.log(`Stored Hash: ${user.password}`);
  
  const isMatch = await bcrypt.compare(pass, user.password);
  console.log(`Bcrypt Match Result for 'password123': ${isMatch}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
