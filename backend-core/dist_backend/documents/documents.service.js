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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DocumentsService = class DocumentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDocumentDto, user) {
        const studentId = (user.role === 'SUPER_ADMIN' || user.role === 'SCHOOL_ADMIN')
            ? createDocumentDto.studentId
            : user.userId;
        return this.prisma.documentRequest.create({
            data: {
                type: createDocumentDto.type,
                reason: createDocumentDto.reason,
                studentId: studentId,
                schoolId: user.schoolId || createDocumentDto.schoolId,
                status: 'PENDING',
            },
        });
    }
    async findAll(user) {
        const whereClause = { schoolId: user.schoolId };
        if (user.role === 'STUDENT' || user.role === 'PARENT') {
            whereClause.studentId = user.userId;
        }
        return this.prisma.documentRequest.findMany({
            where: whereClause,
            include: {
                student: { select: { firstName: true, lastName: true, matricule: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateStatus(id, status, user) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'SCHOOL_ADMIN') {
            throw new common_1.ForbiddenException('Only administrators can update document status');
        }
        const doc = await this.prisma.documentRequest.findUnique({ where: { id } });
        if (!doc || doc.schoolId !== user.schoolId) {
            throw new common_1.NotFoundException('Document request not found');
        }
        return this.prisma.documentRequest.update({
            where: { id },
            data: { status }
        });
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map