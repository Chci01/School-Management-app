"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jwt = __importStar(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = 'super-secret-key-change-in-production';
async function main() {
    try {
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
        const whereClause = {};
        const finalSchoolId = user.schoolId;
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
    }
    catch (err) {
        console.error('Error:', err);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test-users-loading.js.map