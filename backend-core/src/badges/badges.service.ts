import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  // Fetch or create the default template for the school
  async getTemplate(user: any) {
    let template = await this.prisma.badgeTemplate.findFirst({
        where: { schoolId: user.schoolId }
    });

    if (!template) {
        template = await this.prisma.badgeTemplate.create({
            data: { schoolId: user.schoolId }
        });
    }
    return template;
  }

  async updateTemplate(updateDto: any, user: any) {
    const template = await this.getTemplate(user);
    return this.prisma.badgeTemplate.update({
        where: { id: template.id },
        data: updateDto
    });
  }

  // Generate badge data for a given user belonging to this school
  async generateBadgeForUser(targetUserId: string, user: any) {
     const targetUser = await this.prisma.user.findFirst({
         where: { id: targetUserId, schoolId: user.schoolId },
         include: { school: true }
     });

     if (!targetUser) {
         throw new NotFoundException('Utilisateur introuvable dans cette école');
     }

     const template = await this.getTemplate(user);

     return {
         user: {
             firstName: targetUser.firstName,
             lastName: targetUser.lastName,
             role: targetUser.role,
             matricule: targetUser.matricule,
             photo: targetUser.photo,
         },
         school: {
             name: targetUser.school?.name,
             logo: targetUser.school?.logo,
         },
         template
     };
  }
}
