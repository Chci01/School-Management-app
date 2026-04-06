import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user (e.g., public route like login) or user is SUPER_ADMIN
    if (!user || user.role === 'SUPER_ADMIN') {
      return true;
    }

    if (!user.schoolId) {
       throw new ForbiddenException('Utilisateur non rattaché à une école.');
    }

    const school = await this.prisma.school.findUnique({
      where: { id: user.schoolId },
      select: { isActive: true, licenseExpiresAt: true }
    });

    if (!school) {
      throw new ForbiddenException('École introuvable.');
    }

    if (!school.isActive) {
      throw new ForbiddenException('Le compte de cette école est inactif. Veuillez contacter le support.');
    }

    if (school.licenseExpiresAt && new Date() > new Date(school.licenseExpiresAt)) {
      throw new ForbiddenException('La licence de cette école a expiré. Veuillez renouveler l\'abonnement.');
    }

    return true;
  }
}
