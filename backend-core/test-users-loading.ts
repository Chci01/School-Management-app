
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'super-secret-key-change-in-production';

async function main() {
  try {
    // Find a school admin
    const user = await prisma.user.findFirst({
        where: { role: 'SCHOOL_ADMIN' }
    });

    if (!user) {
        console.log('No SCHOOL_ADMIN found in DB');
        return;
    }

    console.log('Using User:', user.firstName, user.lastName, 'School:', user.schoolId);

    const payload = {
        sub: user.id,
        matricule: user.matricule,
        role: user.role,
        schoolId: user.schoolId
    };

    const token = jwt.sign(payload, JWT_SECRET);
    console.log('Generated Token:', token);

    // Now check what usersService.findAll would return
    // Since we don't want to run the whole NestJS app here, we just check the service logic
    const whereClause: any = {};
    const finalSchoolId = user.schoolId; // Simulation of req.user.schoolId
    if (finalSchoolId) {
      whereClause.schoolId = finalSchoolId;
    }
    
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
         id: true,
         matricule: true,
         firstName: true,
         lastName: true,
         email: true,
         role: true,
         createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('\nResults for schoolId:', finalSchoolId);
    console.log('Count:', users.length);
    console.log(JSON.stringify(users, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
