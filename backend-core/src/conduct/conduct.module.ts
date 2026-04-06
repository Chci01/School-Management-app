import { Module } from '@nestjs/common';
import { ConductService } from './conduct.service';
import { ConductController } from './conduct.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConductController],
  providers: [ConductService],
})
export class ConductModule {}
