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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnnouncementsService = class AnnouncementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, user) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'SCHOOL_ADMIN') {
            throw new common_1.ForbiddenException('Only admins can create announcements');
        }
        const data = {
            title: createDto.title,
            content: createDto.content,
            target: createDto.target,
            schoolId: user.role === 'SUPER_ADMIN' && createDto.schoolId ? createDto.schoolId : user.schoolId
        };
        if (createDto.targetId) {
            data.targetId = createDto.targetId;
        }
        return this.prisma.announcement.create({ data });
    }
    async findAll(user) {
        if (user.role === 'SUPER_ADMIN') {
            return this.prisma.announcement.findMany();
        }
        return this.prisma.announcement.findMany({
            where: {
                OR: [
                    { schoolId: user.schoolId },
                    { schoolId: null }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map