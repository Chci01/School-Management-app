import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createNewsDto: any) {
    const news = await this.prisma.newsItem.create({
      data: {
        schoolId: createNewsDto.schoolId || null,
        title: createNewsDto.title,
        content: createNewsDto.content,
        // Accept arrays of URLs and JSON stringify them for Sqlite storage
        images: JSON.stringify(createNewsDto.images || []),
        videos: JSON.stringify(createNewsDto.videos || []),
        publishedAt: createNewsDto.publishedAt ? new Date(createNewsDto.publishedAt) : new Date(),
      },
    });

    // Fire event for the AI Agent to process the announcement
    this.eventEmitter.emit('announcement.created', {
      id: news.id,
      title: news.title,
      target: 'ALL', 
    });

    return news;
  }

  findAll() {
    return this.prisma.newsItem.findMany({
      orderBy: { publishedAt: 'desc' }
    });
  }

  findBySchool(schoolId: string) {
    return this.prisma.newsItem.findMany({
      where: { schoolId },
      orderBy: { publishedAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const news = await this.prisma.newsItem.findUnique({
      where: { id },
    });
    if (!news) throw new NotFoundException('News Item not found');
    return news;
  }

  update(id: string, updateNewsDto: any) {
    const updateData: any = { ...updateNewsDto };
    
    if (updateData.images) updateData.images = JSON.stringify(updateData.images);
    if (updateData.videos) updateData.videos = JSON.stringify(updateData.videos);
    if (updateData.publishedAt) updateData.publishedAt = new Date(updateData.publishedAt);

    return this.prisma.newsItem.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: string) {
    return this.prisma.newsItem.delete({
      where: { id },
    });
  }
}
