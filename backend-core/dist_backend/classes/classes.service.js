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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClassesService = class ClassesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(schoolId, createClassDto) {
        const academicYear = await this.prisma.academicYear.findFirst({
            where: { id: createClassDto.academicYearId, schoolId }
        });
        if (!academicYear)
            throw new common_1.NotFoundException('Année académique invalide ou non trouvée pour cette école');
        return this.prisma.class.create({
            data: {
                ...createClassDto,
                schoolId,
            },
        });
    }
    async findAll(schoolId, academicYearId) {
        const whereClause = { schoolId };
        if (academicYearId) {
            whereClause.academicYearId = academicYearId;
        }
        return this.prisma.class.findMany({
            where: whereClause,
            include: { academicYear: true },
            orderBy: [{ level: 'asc' }, { name: 'asc' }]
        });
    }
    async findOne(schoolId, id) {
        const c = await this.prisma.class.findFirst({
            where: { id, schoolId },
            include: { academicYear: true },
        });
        if (!c)
            throw new common_1.NotFoundException('Classe non trouvée');
        return c;
    }
    async update(schoolId, id, updateClassDto) {
        await this.findOne(schoolId, id);
        return this.prisma.class.update({
            where: { id },
            data: updateClassDto,
        });
    }
    async remove(schoolId, id) {
        await this.findOne(schoolId, id);
        return this.prisma.class.delete({ where: { id } });
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map