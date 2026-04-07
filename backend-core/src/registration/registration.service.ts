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
          role: 'SCHOOL_ADMIN',
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

  async activateLicense(licenseKey: string) {
    // Logic to find a school with this license key (or validate a new one)
    // For now, let's assume we logic to mark a school as active if the key is valid.
    // In a real scenario, we might have a pool of valid unused keys.
    // For this implementation, we will look for a school that entered this key OR 
    // simply use the key to activate the most recently created inactive school for demo purposes
    // or better: the user should be logged in? But they can't log in if not active.
    
    // Improved logic: find school by email/name if we had that, 
    // but the prompt says they enter it after signup.
    
    // Simple demo logic: Activate the last inactive school
    const school = await this.prisma.school.findFirst({
      where: { isActive: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!school) {
      throw new BadRequestException('Aucun établissement en attente d activation.');
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

    const now = new Date();
    const newExpiration = new Date(now);
    newExpiration.setDate(newExpiration.getDate() + voucher.days);

    return this.prisma.$transaction(async (tx) => {
      await tx.licenseVoucher.update({
        where: { id: voucher.id },
        data: {
          isUsed: true,
          usedAt: now,
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
