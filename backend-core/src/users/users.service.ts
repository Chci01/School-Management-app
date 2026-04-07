import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByMatricule(schoolId: string | null, identifier: string): Promise<User | null> {
    const whereClause: any = {
      OR: [
        { matricule: identifier },
        { email: identifier }
      ]
    };

    if (schoolId) {
       whereClause.schoolId = schoolId;
       return this.prisma.user.findFirst({
         where: whereClause
       });
    } else {
       // Super Admin login fallback
       whereClause.schoolId = null;
       return this.prisma.user.findFirst({
         where: whereClause,
       });
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Find all users (filtered by schoolId and optionally by role)
  async findAll(schoolId: string | null, role?: string, querySchoolId?: string): Promise<User[]> {
    const whereClause: any = {};
    const finalSchoolId = schoolId || querySchoolId;
    if (finalSchoolId) {
      whereClause.schoolId = finalSchoolId;
    }
    
    if (role) {
      whereClause.role = role;
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
         id: true,
         matricule: true,
         firstName: true,
         lastName: true,
         email: true,
         role: true,
         createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return users as any; // Cast list to satisfy strict User model checks
  }

  // Create user (password will be hashed here)
  async create(data: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Extract specialized profiles
    const { studentProfile, staffProfile, ...userData } = data;

    const createData: any = {
      ...userData,
      password: hashedPassword,
    };

    // If student, attach nested create
    if (userData.role === 'STUDENT' && studentProfile) {
      createData.studentProfile = { create: studentProfile };
    }

    // If staff, attach nested create
    if (['TEACHER', 'SCHOOL_ADMIN'].includes(userData.role) && staffProfile) {
      createData.staffProfile = { create: staffProfile };
    }

    const user = await this.prisma.user.create({
      data: createData,
      select: {
          id: true,
          matricule: true,
          firstName: true,
          lastName: true,
          role: true,
          schoolId: true,
          email: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          password: false, // Ensure password isn't returned
      }
    });

    return user as any; // Cast as User to satisfy strict types if needed, or update return type to Partial<User>
  }

  // Delete User
  async remove(schoolId: string, id: string): Promise<User> {
    // Only allow deletion if the user belongs to the requester's school
    return this.prisma.user.delete({
       where: { id, schoolId }
    });
  }
}
