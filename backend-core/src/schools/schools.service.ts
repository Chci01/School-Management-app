import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(createSchoolDto: CreateSchoolDto) {
    const licenseKey = uuidv4();
    return this.prisma.school.create({
      data: {
        ...createSchoolDto,
        licenseKey,
      },
    });
  }

  async findAll() {
    return this.prisma.school.findMany();
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
      }
    });
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) {
        throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    // Just verify existence first via findOne (will throw if absent)
    await this.findOne(id);
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
    const generateSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `KALAN-${generateSegment()}-${generateSegment()}`;
    
    return this.prisma.licenseVoucher.create({
      data: {
        code,
        days,
        createdBy: userId,
      }
    });
  }

  async getAllLicenses() {
    return this.prisma.licenseVoucher.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async activateLicense(id: string, licenseKey: string, userId: string) {
    // Verify school exists
    const school = await this.findOne(id);

    // Find the voucher
    const voucher = await this.prisma.licenseVoucher.findUnique({
      where: { code: licenseKey },
    });

    if (!voucher) {
      throw new NotFoundException('Clé de licence invalide.');
    }

    if (voucher.isUsed) {
      throw new Error('Cette clé de licence a déjà été utilisée.');
    }

    // Determine new expiration date
    const now = new Date();
    let newExpiration = now;
    if (school.licenseExpiresAt && school.licenseExpiresAt > now) {
      // Add days to the current valid expiration
      newExpiration = new Date(school.licenseExpiresAt);
    }
    
    // Add the days from the voucher
    newExpiration.setDate(newExpiration.getDate() + voucher.days);

    // Update the voucher and the school in a transaction
    return this.prisma.$transaction(async (tx) => {
      await tx.licenseVoucher.update({
        where: { id: voucher.id },
        data: {
          isUsed: true,
          usedById: userId,
          usedAt: now,
          schoolId: id,
        },
      });

      return tx.school.update({
        where: { id },
        data: {
          licenseExpiresAt: newExpiration,
        },
      });
    });
  }
}

