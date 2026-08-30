const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findFirst({ where: { email: 'admin@itc.com' } }).then(u => { console.log("User:", u); prisma.$disconnect(); }).catch(e => { console.error(e); prisma.$disconnect(); });
