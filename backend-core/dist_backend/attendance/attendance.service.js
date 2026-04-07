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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBatch(createAttendanceDto) {
        const { schoolId, classId, date, records } = createAttendanceDto;
        const attendances = records.map((record) => ({
            schoolId,
            classId,
            studentId: record.studentId,
            date: new Date(date),
            status: record.status,
            reason: record.reason,
        }));
        return this.prisma.attendance.createMany({
            data: attendances,
        });
    }
    async findByClassAndDate(schoolId, classId, date) {
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(searchDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return this.prisma.attendance.findMany({
            where: {
                schoolId,
                classId,
                date: {
                    gte: searchDate,
                    lt: nextDate,
                },
            },
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true, matricule: true }
                }
            }
        });
    }
    async findByStudent(studentId) {
        return this.prisma.attendance.findMany({
            where: { studentId },
            orderBy: { date: 'desc' }
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map