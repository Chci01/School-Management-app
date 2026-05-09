import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(req: any, createSubjectDto: CreateSubjectDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }>;
    findAll(req: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }[]>;
    findOne(req: any, id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }>;
    update(req: any, id: string, updateSubjectDto: UpdateSubjectDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }>;
    remove(req: any, id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }>;
}
