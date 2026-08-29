const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ 
    where: { email: 'admin@itc.com' },
    select: { email: true, password: true, matricule: true } 
  });
  console.log('Users found:', users);
  
  if (users.length > 0) {
    const match = await bcrypt.compare('itc123456789', users[0].password);
    console.log('Password match for itc123456789?', match);
  } else {
    console.log('No user with admin@itc.com found.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
