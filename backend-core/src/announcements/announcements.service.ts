import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
    constructor(private prisma: PrismaService) {}

    async create(createDto: any, user: any) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_ECOLE') {
             throw new ForbiddenException('Only admins can create announcements');
        }

        const schoolId = user.role === 'SUPER_ADMIN' && createDto.schoolId ? createDto.schoolId : user.schoolId;

        const attachments = JSON.stringify({
            target: createDto.target,
            targetId: createDto.targetId || null
        });

        return this.prisma.communication.create({
            data: {
                senderId: user.id || user.userId,
                schoolId: schoolId,
                type: 'ANNOUNCEMENT',
                title: createDto.title,
                content: createDto.content,
                attachments: attachments,
            }
        });
    }

    async findAll(user: any) {
        if (user.role === 'SUPER_ADMIN') {
             return this.prisma.communication.findMany({
                 where: { type: 'ANNOUNCEMENT' },
                 orderBy: { createdAt: 'desc' }
             });
        }

        // Return school specific OR global
        return this.prisma.communication.findMany({
            where: {
                type: 'ANNOUNCEMENT',
                OR: [
                    { schoolId: user.schoolId },
                    { schoolId: null as any } 
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

