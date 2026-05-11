import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByMatricule(schoolId: string | null, identifier: string): Promise<any | null> {
    // Si schoolId est fourni, on cherche dans l'école, sinon on cherche globalement (pour le login mobile)
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
    const { id, password, ...rest } = data;
    
    // 1. Gestion du Mot de passe (défini par l'école ou par défaut)
    const rawPassword = password || 'kalan123';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    
    // 2. Génération automatique du Matricule s'il n'existe pas
    if (!rest.matricule) {
      const prefix = rest.role ? rest.role.substring(0, 3).toUpperCase() : 'USR';
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      rest.matricule = `KS-${prefix}-${year}-${random}`;
    }
    
    // 3. Nettoyage des données
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
