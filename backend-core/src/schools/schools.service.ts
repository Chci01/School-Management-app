import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(createSchoolDto: CreateSchoolDto) {
    return this.prisma.school.create({
      data: {
        ...createSchoolDto,
        licenseKey: Math.random().toString(36).substring(2, 10).toUpperCase(),
        isActive: true,
        theme: 'light',
      },
    });
  }

  async findAll() {
    return this.prisma.school.findMany({
      include: {
        _count: {
          select: { users: true, classes: true }
        }
      }
    });
  }

  async findPublic() {
    return this.prisma.school.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        logo: true,
        slogan: true,
        isActive: true,
      },
    });
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
    });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    return this.prisma.school.update({
      where: { id },
      data: updateSchoolDto,
    });
  }

  async toggleActive(id: string) {
    const school = await this.findOne(id);
    return this.prisma.school.update({
      where: { id },
      data: { isActive: !school.isActive },
    });
  }

  async generateLicense(days: number, userId: string) {
    // Simplified for now
    return { success: true, code: 'KALAN-' + Math.random().toString(36).substring(2, 6).toUpperCase() };
  }

  async activateLicense(id: string, licenseKey: string, userId: string) {
    // Simplified for now
    return { success: true, newExpiration: new Date() };
  }

  async requestLicense(schoolId: string, userId: string) {
    // Simplified for now
    return { success: true };
  }

  async getAllLicenses() {
    return [];
  }
}
