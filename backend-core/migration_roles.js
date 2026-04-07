const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Data Migration & Cleanup...');

  // 1. Delete duplicate schools named "CSKD" or "cskd"
  // Keep the main one: "COMPLEXE SCOLAIRE KALIFA DOUMBIA"
  const schoolsToDelete = await prisma.school.findMany({
    where: {
      OR: [
        { name: { equals: 'CSKD', mode: 'insensitive' } },
        { name: { equals: 'cskd', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Found ${schoolsToDelete.length} duplicate CSKD schools to delete.`);

  for (const school of schoolsToDelete) {
    try {
      // Delete dependent data first to satisfy constraints
      await prisma.user.deleteMany({ where: { schoolId: school.id } });
      await prisma.school.delete({ where: { id: school.id } });
      console.log(`✅ Deleted school: ${school.name} (${school.id})`);
    } catch (err) {
      console.error(`❌ Failed to delete school ${school.id}:`, err.message);
    }
  }

  // 2. Update existing User roles from English to French
  console.log('🔄 Updating User roles to French...');
  
  const roleMap = {
    'SCHOOL_ADMIN': 'ADMIN_ECOLE',
    'TEACHER': 'ENSEIGNANT',
    'STUDENT': 'ELEVE',
    'PARENT': 'PARENT',
    'SUPER_ADMIN': 'SUPER_ADMIN'
  };

  for (const [oldRole, newRole] of Object.entries(roleMap)) {
    const updateResult = await prisma.user.updateMany({
      where: { role: oldRole },
      data: { role: newRole }
    });
    console.log(`✅ Updated ${updateResult.count} users from ${oldRole} to ${newRole}`);
  }

  console.log('✨ Data Migration & Cleanup Complete!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
