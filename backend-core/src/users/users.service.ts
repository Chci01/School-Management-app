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
      select: {
        id: true,
        schoolId: true,
        matricule: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async create(data: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
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
