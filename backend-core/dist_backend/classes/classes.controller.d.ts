import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(req: any, createClassDto: CreateClassDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    }>;
    findAll(req: any, academicYearId?: string): Promise<({
        academicYear: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    })[]>;
    findOne(req: any, id: string): Promise<{
        academicYear: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    }>;
    update(req: any, id: string, updateClassDto: UpdateClassDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    }>;
    remove(req: any, id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    }>;
}
