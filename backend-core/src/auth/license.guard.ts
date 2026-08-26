import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Public routes (no user) or SUPER_ADMIN always pass
    if (!user || user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_SYSTEM') {
      return true;
    }

    if (!user.schoolId) {
      throw new ForbiddenException('Utilisateur non rattaché à une école.');
    }

    const school = await this.prisma.school.findUnique({
      where: { id: user.schoolId }
    });

    if (!school) {
      throw new ForbiddenException('École introuvable.');
    }

    if (!school.isActive) {
      throw new ForbiddenException('Le compte de cette école est inactif. Contactez le support.');
    }

    // Check license expiration if set
    if (school.licenseExpiresAt) {
      const expiration = new Date(school.licenseExpiresAt);
      if (new Date() > expiration) {
        throw new ForbiddenException('La licence a expiré. Veuillez renouveler votre abonnement.');
      }
    }

    return true;
  }
}
