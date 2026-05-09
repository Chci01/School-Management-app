import { Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NewsService {
  constructor(
    private firestore: FirestoreService,
    private eventEmitter: EventEmitter2
  ) {}

  private readonly collection = 'news_items';

  async create(createNewsDto: any) {
    const newsData = {
      schoolId: createNewsDto.schoolId || null,
      title: createNewsDto.title,
      content: createNewsDto.content,
      images: createNewsDto.images || [],
      videos: createNewsDto.videos || [],
      publishedAt: createNewsDto.publishedAt ? new Date(createNewsDto.publishedAt) : new Date(),
    };

    const news = await this.firestore.create(this.collection, newsData);

    // Fire event for the AI Agent to process the announcement
    this.eventEmitter.emit('announcement.created', {
      id: news.id,
      title: news.title,
      target: 'ALL', 
    });

    return news;
  }

  async findAll() {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .orderBy('publishedAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findBySchool(schoolId: string) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('schoolId', '==', schoolId)
      .orderBy('publishedAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(id: string) {
    const news = await this.firestore.findOne(this.collection, id);
    if (!news) throw new NotFoundException('News Item not found');
    return news;
  }

  async update(id: string, updateNewsDto: any) {
    const updateData: any = { ...updateNewsDto };
    if (updateData.publishedAt) updateData.publishedAt = new Date(updateData.publishedAt);

    return this.firestore.update(this.collection, id, updateData);
  }

  async remove(id: string) {
    await this.firestore.delete(this.collection, id);
    return { id };
  }
}
