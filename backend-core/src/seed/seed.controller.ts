import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // Note: In production, this route should be highly secured or completely removed.
  // For development, it allows easily creating the first Super Admin.
  @Post('super-admin')
  seedSuperAdmin() {
    return this.seedService.seedSuperAdmin();
  }
}
