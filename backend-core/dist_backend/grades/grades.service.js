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
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GradesService = class GradesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(schoolId, createGradeDto) {
        const subject = await this.prisma.subject.findFirst({ where: { id: createGradeDto.subjectId, schoolId } });
        if (!subject)
            throw new common_1.NotFoundException('Matière invalide');
        const classEntity = await this.prisma.class.findFirst({ where: { id: createGradeDto.classId, schoolId } });
        if (!classEntity)
            throw new common_1.NotFoundException('Classe invalide');
        return this.prisma.grade.create({
            data: {
                ...createGradeDto,
                schoolId,
            },
            include: { subject: true }
        });
    }
    async findAllByStudent(schoolId, studentId, academicYearId) {
        const whereClause = { schoolId, studentId };
        if (academicYearId)
            whereClause.academicYearId = academicYearId;
        return this.prisma.grade.findMany({
            where: whereClause,
            include: { subject: true }
        });
    }
    async calculateStudentAverage(schoolId, studentId, academicYearId) {
        const grades = await this.findAllByStudent(schoolId, studentId, academicYearId);
        if (grades.length === 0)
            return 0;
        let totalPoints = 0;
        let totalCoefficients = 0;
        grades.forEach(g => {
            const coef = g.subject.coefficient || 1;
            totalPoints += g.value * coef;
            totalCoefficients += coef;
        });
        return totalCoefficients > 0 ? (totalPoints / totalCoefficients) : 0;
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradesService);
//# sourceMappingURL=grades.service.js.map