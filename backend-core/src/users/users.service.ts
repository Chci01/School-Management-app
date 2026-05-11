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
      include: { school: true }
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { school: true }
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
    // 1. Extraction et nettoyage
    const { id, password, createdAt, updatedAt, ...rest } = data;
    
    // 2. Mot de passe
    const rawPassword = password || 'kalan123';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    
    // 3. Matricule automatique
    if (!rest.matricule) {
      const prefix = rest.role ? rest.role.substring(0, 3).toUpperCase() : 'USR';
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      rest.matricule = `KS-${prefix}-${year}-${random}`;
    }
    
    // 4. Liste stricte des champs autorisés dans Prisma
    const validFields = [
      'schoolId', 'matricule', 'email', 'firstName', 'lastName', 'role', 
      'phone', 'address', 'gender', 'placeOfBirth', 'photo',
      'classId', 'parentName', 'parentPhone', 'isActive'
    ];

    const cleanData: any = {};
    validFields.forEach(field => {
      if (rest[field] !== undefined && rest[field] !== '') {
        cleanData[field] = rest[field];
      }
    });

    // 5. Gestion spéciale de la date de naissance (conversion string -> Date)
    if (rest.dateOfBirth) {
      try {
        cleanData.dateOfBirth = new Date(rest.dateOfBirth);
      } catch (e) {
        console.error('Format de date invalide:', rest.dateOfBirth);
      }
    }

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
