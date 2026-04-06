import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SchoolsModule } from './schools/schools.module';
import { SeedModule } from './seed/seed.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { ClassesModule } from './classes/classes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GradesModule } from './grades/grades.module';
import { PaymentsModule } from './payments/payments.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AcademicRecordsModule } from './academic-records/academic-records.module';
import { DocumentsModule } from './documents/documents.module';
import { HealthModule } from './health/health.module';
import { BadgesModule } from './badges/badges.module';
import { ReportsModule } from './reports/reports.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AttendanceModule } from './attendance/attendance.module';
import { HomeworksModule } from './homeworks/homeworks.module';
import { SuppliesModule } from './supplies/supplies.module';
import { ConductModule } from './conduct/conduct.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { NewsModule } from './news/news.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RegistrationModule } from './registration/registration.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    SchoolsModule,
    AcademicYearsModule,
    AnnouncementsModule,
    GradesModule,
    PaymentsModule,
    AcademicRecordsModule,
    DocumentsModule,
    HealthModule,
    BadgesModule,
    ReportsModule,
    RegistrationModule,
    SchedulesModule,
    HomeworksModule,
    AttendanceModule,
    SuppliesModule,
    ConductModule,
    AiAgentModule,
    NewsModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
