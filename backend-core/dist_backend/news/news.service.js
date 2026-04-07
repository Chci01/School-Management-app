"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let NewsService = class NewsService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async create(createNewsDto) {
        const news = await this.prisma.newsItem.create({
            data: {
                schoolId: createNewsDto.schoolId || null,
                title: createNewsDto.title,
                content: createNewsDto.content,
                images: JSON.stringify(createNewsDto.images || []),
                videos: JSON.stringify(createNewsDto.videos || []),
                publishedAt: createNewsDto.publishedAt ? new Date(createNewsDto.publishedAt) : new Date(),
            },
        });
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
    findBySchool(schoolId) {
        return this.prisma.newsItem.findMany({
            where: { schoolId },
            orderBy: { publishedAt: 'desc' }
        });
    }
    async findOne(id) {
        const news = await this.prisma.newsItem.findUnique({
            where: { id },
        });
        if (!news)
            throw new common_1.NotFoundException('News Item not found');
        return news;
    }
    update(id, updateNewsDto) {
        const updateData = { ...updateNewsDto };
        if (updateData.images)
            updateData.images = JSON.stringify(updateData.images);
        if (updateData.videos)
            updateData.videos = JSON.stringify(updateData.videos);
        if (updateData.publishedAt)
            updateData.publishedAt = new Date(updateData.publishedAt);
        return this.prisma.newsItem.update({
            where: { id },
            data: updateData,
        });
    }
    remove(id) {
        return this.prisma.newsItem.delete({
            where: { id },
        });
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], NewsService);
//# sourceMappingURL=news.service.js.map