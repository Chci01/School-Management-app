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
exports.HomeworksController = void 0;
const common_1 = require("@nestjs/common");
const homeworks_service_1 = require("./homeworks.service");
const create_homework_dto_1 = require("./dto/create-homework.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let HomeworksController = class HomeworksController {
    homeworksService;
    constructor(homeworksService) {
        this.homeworksService = homeworksService;
    }
    create(createHomeworkDto) {
        return this.homeworksService.create(createHomeworkDto);
    }
    findByClass(schoolId, classId) {
        return this.homeworksService.findByClass(schoolId, classId);
    }
    findByTeacher(teacherId) {
        return this.homeworksService.findByTeacher(teacherId);
    }
    remove(id) {
        return this.homeworksService.remove(id);
    }
};
exports.HomeworksController = HomeworksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_homework_dto_1.CreateHomeworkDto]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('class/:schoolId/:classId'),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    __param(0, (0, common_1.Param)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "findByTeacher", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "remove", null);
exports.HomeworksController = HomeworksController = __decorate([
    (0, common_1.Controller)('homeworks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [homeworks_service_1.HomeworksService])
], HomeworksController);
//# sourceMappingURL=homeworks.controller.js.map