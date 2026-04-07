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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPaymentDto, user) {
        const { studentId, amount, tranche } = createPaymentDto;
        const student = await this.prisma.user.findUnique({ where: { id: studentId } });
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        if (!student.schoolId) {
            throw new common_1.ForbiddenException('Student is not assigned to any school');
        }
        return this.prisma.payment.create({
            data: {
                studentId,
                amount,
                tranche,
                schoolId: student.schoolId,
                receiptNumber
            }
        });
    }
    async findAll(user) {
        if (user.role === 'SUPER_ADMIN') {
            return this.prisma.payment.findMany({ include: { student: true } });
        }
        return this.prisma.payment.findMany({
            where: { schoolId: user.schoolId },
            include: { student: true }
        });
    }
    async findByStudent(studentId, user) {
        const student = await this.prisma.user.findUnique({ where: { id: studentId } });
        if (!student) {
            throw new common_1.ForbiddenException('Student not found');
        }
        if (user.role === 'SCHOOL_ADMIN' && student.schoolId !== user.schoolId)
            throw new common_1.ForbiddenException();
        if (user.role === 'STUDENT' && user.id !== studentId)
            throw new common_1.ForbiddenException();
        return this.prisma.payment.findMany({
            where: { studentId }
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map