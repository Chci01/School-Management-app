import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  // Since we don't have a dedicated BadgeTemplate model yet, we can use the School model's theme/logo 
  // or return a mock template object that the frontend expects.
  async getTemplate(user: any) {
    const school = await this.prisma.school.findUnique({
      where: { id: user.schoolId }
    });

    return {
      id: school?.id,
      schoolId: school?.id,
      primaryColor: school?.primaryColor || '#000000',
      logo: school?.logo,
      theme: school?.theme || 'light'
    };
  }

  async updateTemplate(updateDto: any, user: any) {
    // Optional: we can save some template data back into the School model
    return this.prisma.school.update({
      where: { id: user.schoolId },
      data: {
        primaryColor: updateDto.primaryColor,
        theme: updateDto.theme
      }
    });
  }

  // Generate badge data for a given user belonging to this school
  async generateBadgeForUser(targetUserId: string, user: any) {
     const targetUser = await this.prisma.user.findUnique({
       where: { id: targetUserId }
     });

     if (!targetUser || targetUser.schoolId !== user.schoolId) {
         throw new NotFoundException('Utilisateur introuvable dans cette école');
     }

     const school = await this.prisma.school.findUnique({
       where: { id: targetUser.schoolId }
     });

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
             name: school?.name,
             logo: school?.logo,
         },
         template
     };
  }
}

