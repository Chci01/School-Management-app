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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SchedulesService = class SchedulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(schoolId, classId, teacherId) {
        const where = { schoolId };
        if (classId)
            where.classId = classId;
        if (teacherId)
            where.teacherId = teacherId;
        return this.prisma.schedule.findMany({
            where,
            include: {
                subject: true,
                teacher: { select: { id: true, firstName: true, lastName: true } },
                class: { select: { id: true, name: true, level: true } }
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
    }
    async create(schoolId, data) {
        const cls = await this.prisma.class.findFirst({ where: { id: data.classId, schoolId } });
        if (!cls)
            throw new common_1.BadRequestException('Class not found in this school');
        const subject = await this.prisma.subject.findFirst({ where: { id: data.subjectId, schoolId } });
        if (!subject)
            throw new common_1.BadRequestException('Subject not found in this school');
        const teacher = await this.prisma.user.findFirst({ where: { id: data.teacherId, schoolId, role: 'TEACHER' } });
        if (!teacher)
            throw new common_1.BadRequestException('Teacher not found in this school');
        return this.prisma.schedule.create({
            data: {
                schoolId,
                classId: data.classId,
                subjectId: data.subjectId,
                teacherId: data.teacherId,
                dayOfWeek: data.dayOfWeek,
                startTime: data.startTime,
                endTime: data.endTime,
                room: data.room,
            }
        });
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map