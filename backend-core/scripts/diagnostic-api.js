"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function test() {
    console.log('--- DIAGNOSTIC START ---');
    const publicSchools = await prisma.school.findMany({
        where: { isActive: true },
        select: { id: true, name: true, logo: true, isActive: true }
    });
    console.log('Public Schools Count:', publicSchools.length);
    console.log('Public Schools:', JSON.stringify(publicSchools, null, 2));
    const school = publicSchools[0];
    if (school) {
        const users = await prisma.user.findMany({
            where: { schoolId: school.id },
            select: { id: true, matricule: true, role: true }
        });
        console.log(`\nUsers for School ${school.name}:`, users.length);
    }
    const totalUsers = await prisma.user.count();
    console.log('\nTotal Users in DB:', totalUsers);
    console.log('--- DIAGNOSTIC END ---');
}
test().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=diagnostic-api.js.map