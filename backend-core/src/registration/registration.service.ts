import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(private prisma: PrismaService) {}

  async registerSchool(dto: any) {
    const { schoolName, email, password } = dto;

    // Check if school or user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    // Create school and its first admin
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.$transaction(async (tx) => {
      // Set up a 7-day free trial automatically on signup
      const trialExpiration = new Date();
      trialExpiration.setDate(trialExpiration.getDate() + 7);

      const school = await tx.school.create({
        data: {
          name: schoolName,
          email: email,
          isActive: true, // Active immediately with the trial
          licenseExpiresAt: trialExpiration,
        },
      });

      const admin = await tx.user.create({
        data: {
          schoolId: school.id,
          matricule: 'ADMIN-01', // Default matricule for the first school admin
          email: email,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: schoolName,
          role: 'ADMIN_ECOLE',
        },
      });

      return {
        message: 'Compte créé avec succès. Votre essai gratuit de 7 jours commence maintenant !',
        schoolId: school.id,
        adminMatricule: admin.matricule,
        trialExpiresAt: trialExpiration,
      };
    });
  }

  async activateLicense(licenseKey: string, schoolId?: string) {
    // Determine which school to activate
    let school;
    if (schoolId) {
      school = await this.prisma.school.findUnique({ where: { id: schoolId } });
    } else {
      // Fuzzy logic for backward compatibility/quick activation
      school = await this.prisma.school.findFirst({
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!school) {
      throw new BadRequestException('Aucun établissement trouvé pour l\'activation.');
    }

    // Verify against real LicenseVoucher
    const voucher = await this.prisma.licenseVoucher.findUnique({
      where: { code: licenseKey },
    });

    if (!voucher) {
      throw new BadRequestException('Format de clé de licence invalide ou clé introuvable.');
    }

    if (voucher.isUsed) {
      throw new BadRequestException('Cette clé de licence a déjà été utilisée.');
    }

    // Calculate new expiration
    // If the school already has a future expiration (trial), extend from there
    const currentExpiration = school.licenseExpiresAt ? new Date(school.licenseExpiresAt) : new Date();
    const baseDate = currentExpiration > new Date() ? currentExpiration : new Date();
    
    const newExpiration = new Date(baseDate);
    newExpiration.setDate(newExpiration.getDate() + voucher.days);

    return this.prisma.$transaction(async (tx) => {
      await tx.licenseVoucher.update({
        where: { id: voucher.id },
        data: {
          isUsed: true,
          usedAt: new Date(),
          schoolId: school.id,
        },
      });

      return tx.school.update({
        where: { id: school.id },
        data: {
          licenseKey: licenseKey,
          isActive: true,
          licenseExpiresAt: newExpiration,
        },
      });
    });
  }
}
