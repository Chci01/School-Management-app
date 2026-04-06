import { Injectable, ConflictException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UsersService } from '../users.service';

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService) {}

  async create(createAdminDto: CreateAdminDto) {
    const existing = await this.usersService.findByMatricule(
      createAdminDto.schoolId,
      createAdminDto.matricule,
    );
    if (existing) {
      throw new ConflictException('Ce matricule est déjà utilisé dans cette école.');
    }

    return this.usersService.create({
      ...createAdminDto,
      role: 'SCHOOL_ADMIN',
    });
  }

  // findAll (Super Admin request) or findAllBySchool (School Admin) can be added here
}
