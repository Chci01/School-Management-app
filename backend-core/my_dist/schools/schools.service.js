"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let SchoolsService = class SchoolsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSchoolDto) {
        const licenseKey = (0, uuid_1.v4)();
        return this.prisma.school.create({
            data: {
                ...createSchoolDto,
                licenseKey,
            },
        });
    }
    async findAll() {
        return this.prisma.school.findMany();
    }
    async findPublic() {
        return this.prisma.school.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                logo: true,
                slogan: true,
                isActive: true,
            }
        });
    }
    async findOne(id) {
        const school = await this.prisma.school.findUnique({ where: { id } });
        if (!school) {
            throw new common_1.NotFoundException(`School with ID ${id} not found`);
        }
        return school;
    }
    async update(id, updateSchoolDto) {
        await this.findOne(id);
        return this.prisma.school.update({
            where: { id },
            data: updateSchoolDto,
        });
    }
    async toggleActive(id) {
        const school = await this.findOne(id);
        return this.prisma.school.update({
            where: { id },
            data: { isActive: !school.isActive },
        });
    }
    async generateLicense(days, userId) {
        const generateSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `KALAN-${generateSegment()}-${generateSegment()}`;
        return this.prisma.licenseVoucher.create({
            data: {
                code,
                days,
                createdBy: userId,
            }
        });
    }
    async getAllLicenses() {
        return this.prisma.licenseVoucher.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async activateLicense(id, licenseKey, userId) {
        const school = await this.findOne(id);
        const voucher = await this.prisma.licenseVoucher.findUnique({
            where: { code: licenseKey },
        });
        if (!voucher) {
            throw new common_1.NotFoundException('Clé de licence invalide.');
        }
        if (voucher.isUsed) {
            throw new Error('Cette clé de licence a déjà été utilisée.');
        }
        const now = new Date();
        let newExpiration = now;
        if (school.licenseExpiresAt && school.licenseExpiresAt > now) {
            newExpiration = new Date(school.licenseExpiresAt);
        }
        newExpiration.setDate(newExpiration.getDate() + voucher.days);
        return this.prisma.$transaction(async (tx) => {
            await tx.licenseVoucher.update({
                where: { id: voucher.id },
                data: {
                    isUsed: true,
                    usedById: userId,
                    usedAt: now,
                    schoolId: id,
                },
            });
            return tx.school.update({
                where: { id },
                data: {
                    licenseExpiresAt: newExpiration,
                },
            });
        });
    }
};
exports.SchoolsService = SchoolsService;
exports.SchoolsService = SchoolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchoolsService);
//# sourceMappingURL=schools.service.js.map