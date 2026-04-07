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
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let HealthService = class HealthService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async create(createHealthDto, user) {
        const record = await this.prisma.healthRecord.create({
            data: {
                ...createHealthDto,
                schoolId: user.schoolId,
            },
        });
        this.eventEmitter.emit('health.added', {
            studentId: record.studentId,
            symptoms: record.symptoms,
            severity: record.severity,
        });
        return record;
    }
    async findAll(user) {
        const whereClause = { schoolId: user.schoolId };
        if (user.role === 'STUDENT' || user.role === 'PARENT') {
            whereClause.studentId = user.userId;
        }
        return this.prisma.healthRecord.findMany({
            where: whereClause,
            include: {
                student: { select: { firstName: true, lastName: true, matricule: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], HealthService);
//# sourceMappingURL=health.service.js.map