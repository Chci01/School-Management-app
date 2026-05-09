import { AnnouncementsService } from './announcements.service';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    create(createDto: any, req: any): Promise<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        target: string;
        targetId: string | null;
    }>;
    findAll(req: any): Promise<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        target: string;
        targetId: string | null;
    }[]>;
}
