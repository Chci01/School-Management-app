import { Module } from '@nestjs/common';
import { AcademicRecordsService } from './academic-records.service';
import { AcademicRecordsController } from './academic-records.controller';

@Module({
  providers: [AcademicRecordsService],
  controllers: [AcademicRecordsController]
})
export class AcademicRecordsModule {}
