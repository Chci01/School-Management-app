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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let ReportsService = class ReportsService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async publishTerm(schoolId, academicYearId, classId, term, isPublished) {
        const publication = await this.prisma.termPublication.upsert({
            where: {
                schoolId_academicYearId_classId_term: {
                    schoolId,
                    academicYearId,
                    classId: classId || '',
                    term
                }
            },
            update: { isPublished },
            create: { schoolId, academicYearId, classId, term, isPublished }
        }).catch(async () => {
            const existing = await this.prisma.termPublication.findFirst({
                where: { schoolId, academicYearId, classId, term }
            });
            if (existing) {
                return this.prisma.termPublication.update({ where: { id: existing.id }, data: { isPublished } });
            }
            return this.prisma.termPublication.create({ data: { schoolId, academicYearId, classId, term, isPublished } });
        });
        if (isPublished) {
            this.eventEmitter.emit('bulletin.published', {
                schoolId,
                academicYearId,
                classId,
                term
            });
        }
        return publication;
    }
    async generateBulletin(schoolId, studentId, term, academicYearId) {
        const student = await this.prisma.user.findUnique({
            where: { id: studentId, schoolId },
            select: { id: true, matricule: true, firstName: true, lastName: true }
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const record = await this.prisma.academicRecord.findFirst({
            where: { studentId, schoolId, academicYearId },
            include: { class: true, academicYear: true }
        });
        if (!record) {
            throw new common_1.NotFoundException('Academic record not found for this year');
        }
        const publication = await this.prisma.termPublication.findFirst({
            where: {
                schoolId,
                academicYearId,
                term: Number(term),
                OR: [{ classId: null }, { classId: record.class.id }]
            }
        });
        if (!publication || !publication.isPublished) {
            throw new common_1.ForbiddenException('Le bulletin de ce trimestre n\'est pas encore publié par l\'administration.');
        }
        const grades = await this.prisma.grade.findMany({
            where: {
                studentId,
                schoolId,
                academicYearId,
                term: Number(term),
            },
            include: {
                subject: true
            }
        });
        const subjectAverages = {};
        let totalPoints = 0;
        let totalCoefficients = 0;
        grades.forEach(g => {
            const subId = g.subjectId;
            if (!subjectAverages[subId]) {
                subjectAverages[subId] = {
                    subjectName: g.subject.name,
                    coefficient: g.subject.coefficient,
                    grades: [],
                    average: 0
                };
            }
            subjectAverages[subId].grades.push(g.value);
        });
        const results = Object.values(subjectAverages).map((sub) => {
            const sum = sub.grades.reduce((a, b) => a + b, 0);
            const avg = sum / sub.grades.length;
            sub.average = parseFloat(avg.toFixed(2));
            totalPoints += (sub.average * sub.coefficient);
            totalCoefficients += sub.coefficient;
            return sub;
        });
        const globalAverage = totalCoefficients > 0 ? (totalPoints / totalCoefficients) : 0;
        return {
            student,
            class: record.class,
            academicYear: record.academicYear,
            term: Number(term),
            subjects: results,
            globalAverage: parseFloat(globalAverage.toFixed(2)),
            totalCoefficients,
            totalPoints: parseFloat(totalPoints.toFixed(2)),
            generatedAt: new Date()
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], ReportsService);
//# sourceMappingURL=reports.service.js.map