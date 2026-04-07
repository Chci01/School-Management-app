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
exports.AcademicYearsController = void 0;
const common_1 = require("@nestjs/common");
const academic_years_service_1 = require("./academic-years.service");
const create_academic_year_dto_1 = require("./dto/create-academic-year.dto");
const update_academic_year_dto_1 = require("./dto/update-academic-year.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const license_guard_1 = require("../auth/license.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let AcademicYearsController = class AcademicYearsController {
    academicYearsService;
    constructor(academicYearsService) {
        this.academicYearsService = academicYearsService;
    }
    create(req, createAcademicYearDto) {
        return this.academicYearsService.create(req.user.schoolId, createAcademicYearDto);
    }
    findAll(req) {
        return this.academicYearsService.findAll(req.user.schoolId);
    }
    findActive(req) {
        return this.academicYearsService.findActive(req.user.schoolId);
    }
    findOne(req, id) {
        return this.academicYearsService.findOne(req.user.schoolId, id);
    }
    update(req, id, updateAcademicYearDto) {
        return this.academicYearsService.update(req.user.schoolId, id, updateAcademicYearDto);
    }
    remove(req, id) {
        return this.academicYearsService.remove(req.user.schoolId, id);
    }
};
exports.AcademicYearsController = AcademicYearsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SCHOOL_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_academic_year_dto_1.CreateAcademicYearDto]),
    __metadata("design:returntype", void 0)
], AcademicYearsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SCHOOL_ADMIN, roles_decorator_1.Role.TEACHER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicYearsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SCHOOL_ADMIN, roles_decorator_1.Role.TEACHER, roles_decorator_1.Role.STUDENT, roles_decorator_1.Role.PARENT),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicYearsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SCHOOL_ADMIN, roles_decorator_1.Role.TEACHER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AcademicYearsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SCHOOL_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_academic_year_dto_1.UpdateAcademicYearDto]),
    __metadata("design:returntype", void 0)
], AcademicYearsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SCHOOL_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AcademicYearsController.prototype, "remove", null);
exports.AcademicYearsController = AcademicYearsController = __decorate([
    (0, common_1.Controller)('academic-years'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, license_guard_1.LicenseGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [academic_years_service_1.AcademicYearsService])
], AcademicYearsController);
//# sourceMappingURL=academic-years.controller.js.map