import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    create(createDocumentDto: any, req: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        type: string;
        status: string;
        reason: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    findAll(req: any): Promise<({
        student: {
            matricule: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        type: string;
        status: string;
        reason: string | null;
        startDate: Date | null;
        endDate: Date | null;
    })[]>;
    updateStatus(id: string, status: string, req: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        type: string;
        status: string;
        reason: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
}
