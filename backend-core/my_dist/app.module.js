"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const schools_module_1 = require("./schools/schools.module");
const academic_years_module_1 = require("./academic-years/academic-years.module");
const grades_module_1 = require("./grades/grades.module");
const payments_module_1 = require("./payments/payments.module");
const announcements_module_1 = require("./announcements/announcements.module");
const academic_records_module_1 = require("./academic-records/academic-records.module");
const documents_module_1 = require("./documents/documents.module");
const health_module_1 = require("./health/health.module");
const badges_module_1 = require("./badges/badges.module");
const reports_module_1 = require("./reports/reports.module");
const schedules_module_1 = require("./schedules/schedules.module");
const attendance_module_1 = require("./attendance/attendance.module");
const homeworks_module_1 = require("./homeworks/homeworks.module");
const supplies_module_1 = require("./supplies/supplies.module");
const conduct_module_1 = require("./conduct/conduct.module");
const ai_agent_module_1 = require("./ai-agent/ai-agent.module");
const news_module_1 = require("./news/news.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const registration_module_1 = require("./registration/registration.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            schools_module_1.SchoolsModule,
            academic_years_module_1.AcademicYearsModule,
            announcements_module_1.AnnouncementsModule,
            grades_module_1.GradesModule,
            payments_module_1.PaymentsModule,
            academic_records_module_1.AcademicRecordsModule,
            documents_module_1.DocumentsModule,
            health_module_1.HealthModule,
            badges_module_1.BadgesModule,
            reports_module_1.ReportsModule,
            registration_module_1.RegistrationModule,
            schedules_module_1.SchedulesModule,
            homeworks_module_1.HomeworksModule,
            attendance_module_1.AttendanceModule,
            supplies_module_1.SuppliesModule,
            conduct_module_1.ConductModule,
            ai_agent_module_1.AiAgentModule,
            news_module_1.NewsModule,
            event_emitter_1.EventEmitterModule.forRoot(),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map