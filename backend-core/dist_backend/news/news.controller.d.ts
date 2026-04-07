import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    create(createNewsDto: any): Promise<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        images: string;
        videos: string;
        publishedAt: Date | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        images: string;
        videos: string;
        publishedAt: Date | null;
    }[]>;
    findBySchool(schoolId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        images: string;
        videos: string;
        publishedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        images: string;
        videos: string;
        publishedAt: Date | null;
    }>;
    update(id: string, updateNewsDto: any): import("@prisma/client").Prisma.Prisma__NewsItemClient<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        images: string;
        videos: string;
        publishedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__NewsItemClient<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        images: string;
        videos: string;
        publishedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
