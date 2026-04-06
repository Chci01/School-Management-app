import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private usersService: UsersService) {}

  async seedSuperAdmin() {
    const existingSuperAdmin = await this.usersService.findByMatricule(null, 'SUPER_ADMIN_01');
    if (existingSuperAdmin) {
      this.logger.log('Super Admin already exists.');
      return { message: 'Super Admin already exists.' };
    }

    const superAdmin = await this.usersService.create({
      schoolId: null,
      matricule: 'SUPER_ADMIN_01',
      password: 'password123!', // In production, this should be an env variable or securely generated
      firstName: 'System',
      lastName: 'Administrator',
      role: 'SUPER_ADMIN',
    });

    this.logger.log('Super Admin created successfully.');
    return { message: 'Super Admin created successfully.', admin: superAdmin };
  }
}
