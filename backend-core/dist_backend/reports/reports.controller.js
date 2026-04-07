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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const license_guard_1 = require("../auth/license.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    generateBulletin(req, studentId, term, academicYearId) {
        const schoolId = req.user.schoolId;
        return this.reportsService.generateBulletin(schoolId, studentId, term, academicYearId);
    }
    publishTerm(req, academicYearId, term, isPublished, classId) {
        const schoolId = req.user.schoolId;
        return this.reportsService.publishTerm(schoolId, academicYearId, classId || null, term, isPublished);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('bulletin/:studentId'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SCHOOL_ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.TEACHER, roles_decorator_1.Role.STUDENT, roles_decorator_1.Role.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Query)('term')),
    __param(3, (0, common_1.Query)('academicYearId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateBulletin", null);
__decorate([
    (0, common_1.Patch)('publish'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SCHOOL_ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('academicYearId')),
    __param(2, (0, common_1.Body)('term')),
    __param(3, (0, common_1.Body)('isPublished')),
    __param(4, (0, common_1.Body)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Boolean, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "publishTerm", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, license_guard_1.LicenseGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map