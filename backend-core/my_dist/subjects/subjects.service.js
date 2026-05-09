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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubjectsService = class SubjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(schoolId, createSubjectDto) {
        return this.prisma.subject.create({
            data: {
                ...createSubjectDto,
                schoolId,
            },
        });
    }
    async findAll(schoolId) {
        return this.prisma.subject.findMany({
            where: { schoolId },
            orderBy: { name: 'asc' }
        });
    }
    async findOne(schoolId, id) {
        const subject = await this.prisma.subject.findFirst({
            where: { id, schoolId },
        });
        if (!subject)
            throw new common_1.NotFoundException('Matière non trouvée');
        return subject;
    }
    async update(schoolId, id, updateSubjectDto) {
        await this.findOne(schoolId, id);
        return this.prisma.subject.update({
            where: { id },
            data: updateSubjectDto,
        });
    }
    async remove(schoolId, id) {
        await this.findOne(schoolId, id);
        return this.prisma.subject.delete({ where: { id } });
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map