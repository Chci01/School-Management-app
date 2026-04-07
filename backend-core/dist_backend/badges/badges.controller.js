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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgesController = void 0;
const common_1 = require("@nestjs/common");
const badges_service_1 = require("./badges.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const license_guard_1 = require("../auth/license.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let BadgesController = class BadgesController {
    badgesService;
    constructor(badgesService) {
        this.badgesService = badgesService;
    }
    getTemplate(req) {
        return this.badgesService.getTemplate(req.user);
    }
    updateTemplate(updateDto, req) {
        return this.badgesService.updateTemplate(updateDto, req.user);
    }
    generateBadgeForUser(targetUserId, req) {
        return this.badgesService.generateBadgeForUser(targetUserId, req.user);
    }
};
exports.BadgesController = BadgesController;
__decorate([
    (0, common_1.Get)('template'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SCHOOL_ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BadgesController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Patch)('template'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SCHOOL_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BadgesController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Get)('generate/:userId'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SCHOOL_ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BadgesController.prototype, "generateBadgeForUser", null);
exports.BadgesController = BadgesController = __decorate([
    (0, common_1.Controller)('badges'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, license_guard_1.LicenseGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [badges_service_1.BadgesService])
], BadgesController);
//# sourceMappingURL=badges.controller.js.map