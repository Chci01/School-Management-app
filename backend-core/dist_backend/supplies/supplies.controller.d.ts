import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
export declare class SuppliesController {
    private readonly suppliesService;
    constructor(suppliesService: SuppliesService);
    create(createSupplyDto: CreateSupplyDto, req: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        type: string;
        description: string | null;
        price: number | null;
    }>;
    findAll(req: any): Promise<({
        class: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            academicYearId: string;
        };
    } & {
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        type: string;
        description: string | null;
        price: number | null;
    })[]>;
    findByClass(classId: string, req: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        type: string;
        description: string | null;
        price: number | null;
    }[]>;
    remove(id: string, req: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        type: string;
        description: string | null;
        price: number | null;
    }>;
}
