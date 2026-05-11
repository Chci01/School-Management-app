import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByMatricule(schoolId: string | null, identifier: string): Promise<any | null> {
    return this.prisma.user.findFirst({
      where: {
        schoolId: schoolId || undefined,
        OR: [
          { matricule: identifier },
          { email: identifier },
        ],
      },
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(schoolId: string | null, role?: string, querySchoolId?: string): Promise<any[]> {
    const finalSchoolId = schoolId || querySchoolId;
    
    return this.prisma.user.findMany({
      where: {
        schoolId: finalSchoolId || undefined,
        role: role || undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any): Promise<any> {
    // Nettoyage des données pour éviter les erreurs Prisma si des champs sont en trop
    const { id, password, ...rest } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // On ne garde que les champs définis dans le modèle Prisma
    const validFields = [
      'schoolId', 'matricule', 'email', 'firstName', 'lastName', 'role', 
      'phone', 'address', 'gender', 'dateOfBirth', 'placeOfBirth', 'photo',
      'classId', 'parentName', 'parentPhone', 'isActive'
    ];

    const cleanData: any = {};
    validFields.forEach(field => {
      if (rest[field] !== undefined) cleanData[field] = rest[field];
    });

    return this.prisma.user.create({
      data: {
        ...cleanData,
        password: hashedPassword,
      },
    });
  }

  async remove(schoolId: string, id: string): Promise<any> {
    const user = await this.findById(id);
    if (user && user.schoolId === schoolId) {
      return this.prisma.user.delete({
        where: { id },
      });
    }
    throw new UnauthorizedException('Unauthorized or user not found');
  }
}
