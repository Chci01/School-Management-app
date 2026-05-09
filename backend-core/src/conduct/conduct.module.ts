import { Module } from '@nestjs/common';
import { ConductService } from './conduct.service';
import { ConductController } from './conduct.controller';

@Module({
  controllers: [ConductController],
  providers: [ConductService],
})
export class ConductModule {}

