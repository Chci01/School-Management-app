import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { FirestoreSeedService } from './firestore-seed.service';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
    private readonly firestoreSeedService: FirestoreSeedService
  ) {}

  // Note: In production, this route should be highly secured or completely removed.
  // For development, it allows easily creating the first Super Admin.
  @Post('super-admin')
  seedSuperAdmin() {
    return this.seedService.seedSuperAdmin();
  }

  @Post('firestore')
  seedFirestore() {
    return this.firestoreSeedService.seedAll();
  }
}

