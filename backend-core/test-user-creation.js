const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const schoolId = 'ecbc8957-336c-4949-a029-3646222414ae'; // KALIFA DOUMBIA
  
  console.log('Testing Pupil (Student) creation...');
  try {
    const pupil = await prisma.user.create({
      data: {
        schoolId,
        matricule: 'ST-TEST-' + Date.now(),
        firstName: 'Test',
        lastName: 'Student',
        role: 'STUDENT',
        password: 'password',
        studentProfile: {
          create: {
            birthDate: new Date(),
            address: 'Test Address'
          }
        }
      }
    });
    console.log('Successfully created student:', pupil.id);
  } catch (err) {
    console.error('Failed to create student:', err.message);
  }

  console.log('Testing Teacher creation...');
  try {
    const teacher = await prisma.user.create({
      data: {
        schoolId,
        matricule: 'TC-TEST-' + Date.now(),
        firstName: 'Test',
        lastName: 'Teacher',
        role: 'TEACHER',
        password: 'password',
        staffProfile: {
          create: {
            position: 'Math Teacher'
          }
        }
      }
    });
    console.log('Successfully created teacher:', teacher.id);
  } catch (err) {
    console.error('Failed to create teacher:', err.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
