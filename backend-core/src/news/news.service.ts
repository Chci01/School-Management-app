import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createNewsDto: any, user?: any) {
    // If no user is passed in (like in original codebase), try to find an admin to be the sender
    let senderId = user?.userId || user?.id;

    if (!senderId && createNewsDto.schoolId) {
      const admin = await this.prisma.user.findFirst({
        where: { schoolId: createNewsDto.schoolId, role: 'ADMIN_ECOLE' }
      });
      senderId = admin?.id;
    }

    if (!senderId) {
       const systemAdmin = await this.prisma.user.findFirst();
       senderId = systemAdmin?.id;
    }

    const news = await this.prisma.communication.create({
      data: {
        schoolId: createNewsDto.schoolId,
        senderId: senderId,
        type: 'NEWS',
        title: createNewsDto.title,
        content: createNewsDto.content,
        attachments: JSON.stringify({
          images: createNewsDto.images || [],
          videos: createNewsDto.videos || []
        }),
        createdAt: createNewsDto.publishedAt ? new Date(createNewsDto.publishedAt) : new Date(),
      }
    });

    // Fire event for the AI Agent to process the announcement
    this.eventEmitter.emit('announcement.created', {
      id: news.id,
      title: news.title,
      target: 'ALL', 
    });

    return news;
  }

  async findAll() {
    return this.prisma.communication.findMany({
      where: { type: 'NEWS' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findBySchool(schoolId: string) {
    return this.prisma.communication.findMany({
      where: { schoolId, type: 'NEWS' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const news = await this.prisma.communication.findUnique({ where: { id } });
    if (!news || news.type !== 'NEWS') throw new NotFoundException('News Item not found');
    return news;
  }

  async update(id: string, updateNewsDto: any) {
    return this.prisma.communication.update({
      where: { id },
      data: {
        title: updateNewsDto.title,
        content: updateNewsDto.content,
        createdAt: updateNewsDto.publishedAt ? new Date(updateNewsDto.publishedAt) : undefined
      }
    });
  }

  async remove(id: string) {
    await this.prisma.communication.delete({ where: { id } });
    return { id };
  }
}
