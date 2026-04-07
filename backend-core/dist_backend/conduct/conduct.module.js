"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConductModule = void 0;
const common_1 = require("@nestjs/common");
const conduct_service_1 = require("./conduct.service");
const conduct_controller_1 = require("./conduct.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let ConductModule = class ConductModule {
};
exports.ConductModule = ConductModule;
exports.ConductModule = ConductModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [conduct_controller_1.ConductController],
        providers: [conduct_service_1.ConductService],
    })
], ConductModule);
//# sourceMappingURL=conduct.module.js.map