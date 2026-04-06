import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AiAgentService],
})
export class AiAgentModule {}
