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
exports.AcademicRecordsController = void 0;
const common_1 = require("@nestjs/common");
const academic_records_service_1 = require("./academic-records.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const license_guard_1 = require("../auth/license.guard");
let AcademicRecordsController = class AcademicRecordsController {
    academicRecordsService;
    constructor(academicRecordsService) {
        this.academicRecordsService = academicRecordsService;
    }
    createOrUpdate(data, req) {
        return this.academicRecordsService.createOrUpdate(data, req.user);
    }
    findByStudent(studentId, req) {
        return this.academicRecordsService.findByStudent(studentId, req.user);
    }
    findByClassAndYear(classId, yearId, req) {
        return this.academicRecordsService.findByClassAndYear(classId, yearId, req.user);
    }
};
exports.AcademicRecordsController = AcademicRecordsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SCHOOL_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AcademicRecordsController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Get)('student/:id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SCHOOL_ADMIN, roles_decorator_1.Role.TEACHER, roles_decorator_1.Role.PARENT, roles_decorator_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AcademicRecordsController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('class/:classId/year/:yearId'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SCHOOL_ADMIN, roles_decorator_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('yearId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AcademicRecordsController.prototype, "findByClassAndYear", null);
exports.AcademicRecordsController = AcademicRecordsController = __decorate([
    (0, common_1.Controller)('academic-records'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, license_guard_1.LicenseGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [academic_records_service_1.AcademicRecordsService])
], AcademicRecordsController);
//# sourceMappingURL=academic-records.controller.js.map