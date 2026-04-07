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
exports.ConductController = void 0;
const common_1 = require("@nestjs/common");
const conduct_service_1 = require("./conduct.service");
const create_conduct_dto_1 = require("./dto/create-conduct.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const license_guard_1 = require("../auth/license.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let ConductController = class ConductController {
    conductService;
    constructor(conductService) {
        this.conductService = conductService;
    }
    submitTeacherConduct(createConductDto, req) {
        return this.conductService.submitTeacherConduct(createConductDto, req.user);
    }
    calculateGlobalConduct(dto, req) {
        return this.conductService.calculateGlobalConduct(dto, req.user);
    }
    getGlobalConduct(studentId, month, year) {
        return this.conductService.getGlobalConduct(studentId, parseInt(month), parseInt(year));
    }
};
exports.ConductController = ConductController;
__decorate([
    (0, common_1.Post)('teacher'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.TEACHER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conduct_dto_1.CreateConductDto, Object]),
    __metadata("design:returntype", void 0)
], ConductController.prototype, "submitTeacherConduct", null);
__decorate([
    (0, common_1.Post)('admin/calculate'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SCHOOL_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conduct_dto_1.CalculateConductDto, Object]),
    __metadata("design:returntype", void 0)
], ConductController.prototype, "calculateGlobalConduct", null);
__decorate([
    (0, common_1.Get)('global/:studentId'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SCHOOL_ADMIN, roles_decorator_1.Role.TEACHER, roles_decorator_1.Role.STUDENT, roles_decorator_1.Role.PARENT),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ConductController.prototype, "getGlobalConduct", null);
exports.ConductController = ConductController = __decorate([
    (0, common_1.Controller)('conduct'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, license_guard_1.LicenseGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [conduct_service_1.ConductService])
], ConductController);
//# sourceMappingURL=conduct.controller.js.map