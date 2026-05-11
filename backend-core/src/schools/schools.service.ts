import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(createSchoolDto: CreateSchoolDto) {
    // Clean fields that might be sent but are not in Prisma model
    const { id, createdAt, updatedAt, isActive, theme, ...rest } = createSchoolDto as any;
    
    return this.prisma.school.create({
      data: {
        ...rest,
        licenseKey: Math.random().toString(36).substring(2, 10).toUpperCase(),
        isActive: isActive !== undefined ? isActive : true,
        theme: theme || 'light',
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
    const { id: _, createdAt, updatedAt, ...rest } = updateSchoolDto as any;
    return this.prisma.school.update({
      where: { id },
      data: rest,
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
    return { success: true, code: 'KALAN-' + Math.random().toString(36).substring(2, 6).toUpperCase() };
  }

  async activateLicense(id: string, licenseKey: string, userId: string) {
    return { success: true, newExpiration: new Date() };
  }

  async requestLicense(schoolId: string, userId: string) {
    return { success: true };
  }

  async getAllLicenses() {
    return [];
  }
}
