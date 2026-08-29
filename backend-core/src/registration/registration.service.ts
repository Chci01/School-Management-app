import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(private prisma: PrismaService) {}

  async registerSchool(dto: any) {
    const { schoolName, email, password } = dto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const trialExpiration = new Date();
    trialExpiration.setDate(trialExpiration.getDate() + 7);

    // Prisma Transaction
    return this.prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: schoolName,
          email: email,
          isActive: true,
          licenseExpiresAt: trialExpiration,
        }
      });

      await tx.user.create({
        data: {
          schoolId: school.id,
          matricule: 'ADMIN-' + school.id.substring(0, 5).toUpperCase() + Math.floor(Math.random() * 1000).toString(),
          email: email,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: schoolName,
          role: 'ADMIN_ECOLE',
        }
      });

      return {
        message: 'Compte créé avec succès. Votre essai gratuit de 7 jours commence maintenant !',
        schoolId: school.id,
        adminMatricule: 'ADMIN-' + school.id.substring(0, 5).toUpperCase(),
        trialExpiresAt: trialExpiration,
      };
    });
  }

  async activateLicense(licenseKey: string, schoolId?: string) {
    return this.prisma.$transaction(async (tx) => {
      // Find school
      let school;
      if (schoolId) {
        school = await tx.school.findUnique({ where: { id: schoolId } });
        if (!school) throw new BadRequestException('Établissement introuvable.');
      } else {
        school = await tx.school.findFirst({ orderBy: { createdAt: 'desc' } });
        if (!school) throw new BadRequestException('Aucun établissement trouvé.');
      }

      // Find voucher
      const voucher = await tx.licenseVoucher.findUnique({
        where: { code: licenseKey }
      });

      if (!voucher) throw new BadRequestException('Clé de licence invalide.');
      if (voucher.isUsed) throw new BadRequestException('Clé déjà utilisée.');

      // Calculate expiration
      const currentExpiration = school.licenseExpiresAt || new Date();
      const baseDate = currentExpiration > new Date() ? currentExpiration : new Date();
      
      const newExpiration = new Date(baseDate);
      newExpiration.setDate(newExpiration.getDate() + voucher.days);

      await tx.licenseVoucher.update({
        where: { id: voucher.id },
        data: {
          isUsed: true,
          usedAt: new Date(),
          schoolId: school.id,
        }
      });

      const updatedSchool = await tx.school.update({
        where: { id: school.id },
        data: {
          licenseKey: licenseKey,
          isActive: true,
          licenseExpiresAt: newExpiration,
        }
      });

      return { ...updatedSchool, licenseExpiresAt: newExpiration };
    });
  }
}

