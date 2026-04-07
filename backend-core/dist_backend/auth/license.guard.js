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
exports.LicenseGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LicenseGuard = class LicenseGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || user.role === 'SUPER_ADMIN') {
            return true;
        }
        if (!user.schoolId) {
            throw new common_1.ForbiddenException('Utilisateur non rattaché à une école.');
        }
        const school = await this.prisma.school.findUnique({
            where: { id: user.schoolId },
            select: { isActive: true, licenseExpiresAt: true }
        });
        if (!school) {
            throw new common_1.ForbiddenException('École introuvable.');
        }
        if (!school.isActive) {
            throw new common_1.ForbiddenException('Le compte de cette école est inactif. Veuillez contacter le support.');
        }
        if (school.licenseExpiresAt && new Date() > new Date(school.licenseExpiresAt)) {
            throw new common_1.ForbiddenException('La licence de cette école a expiré. Veuillez renouveler l\'abonnement.');
        }
        return true;
    }
};
exports.LicenseGuard = LicenseGuard;
exports.LicenseGuard = LicenseGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LicenseGuard);
//# sourceMappingURL=license.guard.js.map