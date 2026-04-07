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
exports.AcademicYearsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AcademicYearsService = class AcademicYearsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(schoolId, createAcademicYearDto) {
        if (createAcademicYearDto.isActive) {
            await this.prisma.academicYear.updateMany({
                where: { schoolId },
                data: { isActive: false },
            });
        }
        return this.prisma.academicYear.create({
            data: {
                ...createAcademicYearDto,
                schoolId,
            },
        });
    }
    async findAll(schoolId) {
        return this.prisma.academicYear.findMany({ where: { schoolId }, orderBy: { createdAt: 'desc' } });
    }
    async findActive(schoolId) {
        const activeYear = await this.prisma.academicYear.findFirst({
            where: { schoolId, isActive: true },
        });
        if (!activeYear)
            throw new common_1.NotFoundException('Aucune année académique active trouvée');
        return activeYear;
    }
    async findOne(schoolId, id) {
        const academicYear = await this.prisma.academicYear.findFirst({
            where: { id, schoolId },
        });
        if (!academicYear)
            throw new common_1.NotFoundException('Année académique non trouvée');
        return academicYear;
    }
    async update(schoolId, id, updateAcademicYearDto) {
        await this.findOne(schoolId, id);
        if (updateAcademicYearDto.isActive) {
            await this.prisma.academicYear.updateMany({
                where: { schoolId },
                data: { isActive: false },
            });
        }
        return this.prisma.academicYear.update({
            where: { id },
            data: updateAcademicYearDto,
        });
    }
    async remove(schoolId, id) {
        await this.findOne(schoolId, id);
        return this.prisma.academicYear.delete({ where: { id } });
    }
};
exports.AcademicYearsService = AcademicYearsService;
exports.AcademicYearsService = AcademicYearsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicYearsService);
//# sourceMappingURL=academic-years.service.js.map