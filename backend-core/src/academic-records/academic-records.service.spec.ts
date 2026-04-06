import { Test, TestingModule } from '@nestjs/testing';
import { AcademicRecordsService } from './academic-records.service';

describe('AcademicRecordsService', () => {
  let service: AcademicRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicRecordsService],
    }).compile();

    service = module.get<AcademicRecordsService>(AcademicRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
