import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'schools';

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

    const school = await this.firestore.findOne(this.collection, user.schoolId) as any;

    if (!school) {
      throw new ForbiddenException('École introuvable.');
    }

    if (!school.isActive) {
      throw new ForbiddenException('Le compte de cette école est inactif. Veuillez contacter le support.');
    }

    const expiration = school.licenseExpiresAt?.toDate ? school.licenseExpiresAt.toDate() : new Date(school.licenseExpiresAt);

    if (expiration && new Date() > expiration) {
      throw new ForbiddenException('La licence de cette école a expiré. Veuillez renouveler l\'abonnement.');
    }

    return true;
  }
}

