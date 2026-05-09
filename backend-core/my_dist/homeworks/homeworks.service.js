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
exports.HomeworksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HomeworksService = class HomeworksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createHomeworkDto) {
        return this.prisma.homework.create({
            data: {
                ...createHomeworkDto,
                dueDate: new Date(createHomeworkDto.dueDate),
            },
        });
    }
    findByClass(schoolId, classId) {
        return this.prisma.homework.findMany({
            where: { schoolId, classId },
            include: {
                subject: { select: { id: true, name: true } },
                teacher: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    findByTeacher(teacherId) {
        return this.prisma.homework.findMany({
            where: { teacherId },
            include: {
                class: { select: { id: true, name: true } },
                subject: { select: { id: true, name: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    remove(id) {
        return this.prisma.homework.delete({ where: { id } });
    }
};
exports.HomeworksService = HomeworksService;
exports.HomeworksService = HomeworksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomeworksService);
//# sourceMappingURL=homeworks.service.js.map