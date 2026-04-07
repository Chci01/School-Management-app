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
exports.ConductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConductService = class ConductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitTeacherConduct(createConductDto, user) {
        if (user.role !== 'TEACHER')
            throw new common_1.BadRequestException('Only teachers can submit this');
        const existing = await this.prisma.conductGrade.findFirst({
            where: {
                studentId: createConductDto.studentId,
                teacherId: user.id,
                month: createConductDto.month,
                year: createConductDto.year,
            }
        });
        if (existing) {
            return this.prisma.conductGrade.update({
                where: { id: existing.id },
                data: { grade: createConductDto.grade, appreciation: createConductDto.appreciation }
            });
        }
        return this.prisma.conductGrade.create({
            data: {
                ...createConductDto,
                teacherId: user.id,
            }
        });
    }
    async calculateGlobalConduct(dto, user) {
        const students = await this.prisma.user.findMany({
            where: { schoolId: user.schoolId, role: 'STUDENT' }
        });
        let processedCount = 0;
        for (const student of students) {
            const grades = await this.prisma.conductGrade.findMany({
                where: { studentId: student.id, month: dto.month, year: dto.year }
            });
            if (grades.length === 0)
                continue;
            const sum = grades.reduce((acc, curr) => acc + curr.grade, 0);
            const average = sum / grades.length;
            let appreciation = 'Passable';
            if (average >= 16)
                appreciation = 'Félicitations';
            else if (average >= 14)
                appreciation = 'Très Bien';
            else if (average >= 12)
                appreciation = 'Assez Bien';
            else if (average < 10)
                appreciation = 'Avertissement Conduct';
            await this.prisma.globalConduct.upsert({
                where: {
                    studentId_month_year: {
                        studentId: student.id,
                        month: dto.month,
                        year: dto.year,
                    }
                },
                update: {
                    grade: average,
                    appreciation,
                },
                create: {
                    schoolId: user.schoolId,
                    studentId: student.id,
                    month: dto.month,
                    year: dto.year,
                    grade: average,
                    appreciation,
                }
            });
            processedCount++;
        }
        return { message: `Calculated Global Conduct for ${processedCount} students.` };
    }
    async getGlobalConduct(studentId, month, year) {
        return this.prisma.globalConduct.findUnique({
            where: {
                studentId_month_year: {
                    studentId,
                    month,
                    year,
                }
            }
        });
    }
};
exports.ConductService = ConductService;
exports.ConductService = ConductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConductService);
//# sourceMappingURL=conduct.service.js.map