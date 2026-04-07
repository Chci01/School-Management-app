import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
export declare class HomeworksController {
    private readonly homeworksService;
    constructor(homeworksService: HomeworksService);
    create(createHomeworkDto: CreateHomeworkDto): import("@prisma/client").Prisma.Prisma__HomeworkClient<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        classId: string;
        title: string;
        teacherId: string;
        description: string;
        dueDate: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByClass(schoolId: string, classId: string): import("@prisma/client").Prisma.PrismaPromise<({
        subject: {
            name: string;
            id: string;
        };
        teacher: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        classId: string;
        title: string;
        teacherId: string;
        description: string;
        dueDate: Date;
    })[]>;
    findByTeacher(teacherId: string): import("@prisma/client").Prisma.PrismaPromise<({
        class: {
            name: string;
            id: string;
        };
        subject: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        classId: string;
        title: string;
        teacherId: string;
        description: string;
        dueDate: Date;
    })[]>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__HomeworkClient<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        classId: string;
        title: string;
        teacherId: string;
        description: string;
        dueDate: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
