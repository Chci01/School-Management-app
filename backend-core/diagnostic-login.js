const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'CSKDML2@gmail.com' },
    include: { school: true }
  });
  
  if (user) {
    console.log('User found:');
    console.log('ID:', user.id);
    console.log('Matricule:', user.matricule);
    console.log('Role:', user.role);
    console.log('School Name:', user.school?.name);
    console.log('School ID:', user.schoolId);
    console.log('School Active:', user.school?.isActive);
    console.log('License Expires:', user.school?.licenseExpiresAt);
  } else {
    console.log('User not found with email CSKDML2@gmail.com');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
