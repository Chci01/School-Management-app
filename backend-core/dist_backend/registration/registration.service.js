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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let RegistrationService = class RegistrationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerSchool(dto) {
        const { schoolName, email, password } = dto;
        const existingUser = await this.prisma.user.findFirst({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.$transaction(async (tx) => {
            const trialExpiration = new Date();
            trialExpiration.setDate(trialExpiration.getDate() + 7);
            const school = await tx.school.create({
                data: {
                    name: schoolName,
                    email: email,
                    isActive: true,
                    licenseExpiresAt: trialExpiration,
                },
            });
            const admin = await tx.user.create({
                data: {
                    schoolId: school.id,
                    matricule: 'ADMIN-01',
                    email: email,
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: schoolName,
                    role: 'SCHOOL_ADMIN',
                },
            });
            return {
                message: 'Compte créé avec succès. Votre essai gratuit de 7 jours commence maintenant !',
                schoolId: school.id,
                adminMatricule: admin.matricule,
                trialExpiresAt: trialExpiration,
            };
        });
    }
    async activateLicense(licenseKey) {
        const school = await this.prisma.school.findFirst({
            where: { isActive: false },
            orderBy: { createdAt: 'desc' },
        });
        if (!school) {
            throw new common_1.BadRequestException('Aucun établissement en attente d activation.');
        }
        const voucher = await this.prisma.licenseVoucher.findUnique({
            where: { code: licenseKey },
        });
        if (!voucher) {
            throw new common_1.BadRequestException('Format de clé de licence invalide ou clé introuvable.');
        }
        if (voucher.isUsed) {
            throw new common_1.BadRequestException('Cette clé de licence a déjà été utilisée.');
        }
        const now = new Date();
        const newExpiration = new Date(now);
        newExpiration.setDate(newExpiration.getDate() + voucher.days);
        return this.prisma.$transaction(async (tx) => {
            await tx.licenseVoucher.update({
                where: { id: voucher.id },
                data: {
                    isUsed: true,
                    usedAt: now,
                    schoolId: school.id,
                },
            });
            return tx.school.update({
                where: { id: school.id },
                data: {
                    licenseKey: licenseKey,
                    isActive: true,
                    licenseExpiresAt: newExpiration,
                },
            });
        });
    }
};
exports.RegistrationService = RegistrationService;
exports.RegistrationService = RegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegistrationService);
//# sourceMappingURL=registration.service.js.map