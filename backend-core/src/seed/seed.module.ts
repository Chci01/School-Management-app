import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsersModule } from '../users/users.module';
import { FirestoreSeedService } from './firestore-seed.service';

@Module({
  imports: [UsersModule],
  controllers: [SeedController],
  providers: [SeedService, FirestoreSeedService],
  exports: [FirestoreSeedService]
})
export class SeedModule {}

