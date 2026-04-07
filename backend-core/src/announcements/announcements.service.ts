import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
    constructor(private prisma: PrismaService) {}

    async create(createDto: any, user: any) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_ECOLE') {
             throw new ForbiddenException('Only admins can create announcements');
        }

        const data: any = {
            title: createDto.title,
            content: createDto.content,
            target: createDto.target, // ALL, TEACHERS, STUDENTS, PARENTS, CLASSES
            schoolId: user.role === 'SUPER_ADMIN' && createDto.schoolId ? createDto.schoolId : user.schoolId
        };

        if (createDto.targetId) {
            data.targetId = createDto.targetId;
        }

        return this.prisma.announcement.create({ data });
    }

    async findAll(user: any) {
        if (user.role === 'SUPER_ADMIN') {
             return this.prisma.announcement.findMany();
        }

        return this.prisma.announcement.findMany({
            where: {
                 OR: [
                      { schoolId: user.schoolId }, // School specific
                      { schoolId: null }           // Global announcements
                 ]
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
