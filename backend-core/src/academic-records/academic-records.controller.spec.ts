import { Test, TestingModule } from '@nestjs/testing';
import { AcademicRecordsController } from './academic-records.controller';

describe('AcademicRecordsController', () => {
  let controller: AcademicRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicRecordsController],
    }).compile();

    controller = module.get<AcademicRecordsController>(AcademicRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
