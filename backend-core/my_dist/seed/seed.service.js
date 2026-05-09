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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
let SeedService = SeedService_1 = class SeedService {
    usersService;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(usersService) {
        this.usersService = usersService;
    }
    async seedSuperAdmin() {
        const existingSuperAdmin = await this.usersService.findByMatricule(null, 'SUPER_ADMIN_01');
        if (existingSuperAdmin) {
            this.logger.log('Super Admin already exists.');
            return { message: 'Super Admin already exists.' };
        }
        const superAdmin = await this.usersService.create({
            schoolId: null,
            matricule: 'SUPER_ADMIN_01',
            password: 'password123!',
            firstName: 'System',
            lastName: 'Administrator',
            role: 'SUPER_ADMIN',
        });
        this.logger.log('Super Admin created successfully.');
        return { message: 'Super Admin created successfully.', admin: superAdmin };
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], SeedService);
//# sourceMappingURL=seed.service.js.map