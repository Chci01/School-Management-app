import { Controller, Post, Headers, ForbiddenException } from '@nestjs/common';
import { SeedService } from './seed.service';
@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
  ) {}

  private validateToken(headers: any) {
    if (process.env.NODE_ENV === 'production') {
      const expectedToken = process.env.SEED_SECRET || 'fallback-prod-seed-token-change-me';
      const actualToken = headers['x-seed-token'];
      if (!actualToken || actualToken !== expectedToken) {
        throw new ForbiddenException('Seeding is disabled or unauthorized in production.');
      }
    }
  }

  // In production, this route requires a valid secret token.
  // For development, it allows easily creating the first Super Admin.
  @Post('super-admin')
  seedSuperAdmin(@Headers() headers: any) {
    this.validateToken(headers);
    return this.seedService.seedSuperAdmin();
  }

}
