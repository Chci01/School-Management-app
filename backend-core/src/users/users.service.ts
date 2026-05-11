import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByMatricule(schoolId: string | null, identifier: string): Promise<any | null> {
    console.log(`[AUTH] findByMatricule called - schoolId: "${schoolId}", identifier: "${identifier}"`);
    
    if (!identifier || identifier.trim() === '') {
      console.log('[AUTH] Empty identifier, returning null');
      return null;
    }

    const trimmedId = identifier.trim();

    // Build where clause - search by matricule OR email, case-insensitive
    const whereClause: any = {
      OR: [
        { matricule: { equals: trimmedId, mode: 'insensitive' } },
        { email: { equals: trimmedId, mode: 'insensitive' } },
      ],
    };

    // Only filter by schoolId if explicitly provided
    if (schoolId) {
      whereClause.schoolId = schoolId;
    }

    const user = await this.prisma.user.findFirst({
      where: whereClause,
      include: { 
        school: true,
        children: true,
        parent: true
      }
    });

    console.log(`[AUTH] findByMatricule result: ${user ? `Found user ${user.id} (${user.firstName} ${user.lastName}, role: ${user.role})` : 'NOT FOUND'}`);
    return user;
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { school: true, children: true, parent: true }
    });
  }

  async findAll(schoolId: string | null, role?: string, querySchoolId?: string): Promise<any[]> {
    const finalSchoolId = schoolId || querySchoolId;
    
    return this.prisma.user.findMany({
      where: {
        schoolId: finalSchoolId || undefined,
        role: role || undefined,
      },
      include: { parent: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any): Promise<any> {
    const { id, password, createdAt, updatedAt, ...rest } = data;
    const rawPassword = password || 'kalan123';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    
    if (!rest.matricule) {
      const prefix = rest.role ? rest.role.substring(0, 3).toUpperCase() : 'USR';
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      rest.matricule = `KS-${prefix}-${year}-${random}`;
    }
    
    const validFields = [
      'schoolId', 'matricule', 'email', 'firstName', 'lastName', 'role', 
      'phone', 'address', 'gender', 'placeOfBirth', 'photo', 'expertise',
      'classId', 'parentId', 'parentName', 'parentPhone', 'isActive'
    ];

    const cleanData: any = {};
    validFields.forEach(field => {
      if (rest[field] !== undefined && rest[field] !== '') {
        cleanData[field] = rest[field];
      }
    });

    if (rest.dateOfBirth) {
      try { cleanData.dateOfBirth = new Date(rest.dateOfBirth); } catch (e) {}
    }

    return this.prisma.user.create({
      data: {
        ...cleanData,
        password: hashedPassword,
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    const { password, createdAt, updatedAt, id: _, schoolId, ...rest } = data;
    
    const validFields = [
      'matricule', 'email', 'firstName', 'lastName', 'role', 
      'phone', 'address', 'gender', 'placeOfBirth', 'photo', 'expertise',
      'classId', 'parentId', 'parentName', 'parentPhone', 'isActive'
    ];

    const cleanData: any = {};
    validFields.forEach(field => {
      if (rest[field] !== undefined) {
        cleanData[field] = rest[field];
      }
    });

    if (password && password !== '') {
      cleanData.password = await bcrypt.hash(password, 10);
    }

    if (rest.dateOfBirth) {
      try { cleanData.dateOfBirth = new Date(rest.dateOfBirth); } catch (e) {}
    }

    return this.prisma.user.update({
      where: { id },
      data: cleanData,
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
