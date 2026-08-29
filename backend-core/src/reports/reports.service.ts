import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async publishTerm(schoolId: string, academicYearId: string, classId: string | null, term: number, isPublished: boolean) {
    const existingPub = await this.prisma.termPublication.findFirst({
      where: {
        schoolId,
        academicYearId,
        classId,
        term
      }
    });

    let publication;
    if (existingPub) {
      publication = await this.prisma.termPublication.update({
        where: { id: existingPub.id },
        data: { isPublished }
      });
    } else {
      publication = await this.prisma.termPublication.create({
        data: {
          schoolId,
          academicYearId,
          classId,
          term,
          isPublished
        }
      });
    }

    if (isPublished) {
      this.eventEmitter.emit('bulletin.published', { schoolId, academicYearId, classId, term });
    }

    return publication;
  }

  async generateBulletin(schoolId: string, studentId: string, term: number, academicYearId: string, userRole: string = 'ELEVE') {
    // 1. Fetch Student Details
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.schoolId !== schoolId) {
      throw new NotFoundException('Student not found');
    }

    // 2. Fetch Academic Record to get the Class
    const record = await this.prisma.academicRecord.findFirst({
      where: {
        studentId,
        schoolId,
        academicYearId,
      }
    });

    if (!record) {
      throw new NotFoundException("L'eleve n'est inscrit dans aucune classe pour cette annee academique.");
    }

    const isAdminOrTeacher = ['ADMIN_ECOLE', 'SUPER_ADMIN', 'ENSEIGNANT'].includes(userRole);

    if (!isAdminOrTeacher) {
      // Check if published
      const publications = await this.prisma.termPublication.findMany({
        where: {
          schoolId,
          academicYearId,
          term: Number(term),
          isPublished: true
        }
      });

      const isPublished = publications.some(pub => pub.classId === null || pub.classId === record.classId);

      if (!isPublished) {
        throw new ForbiddenException('Le bulletin de ce trimestre n\'est pas encore publié par l\'administration.');
      }
    }

    // 3. Fetch all grades
    const grades = await this.prisma.grade.findMany({
      where: {
        studentId,
        academicYearId,
        term: Number(term),
      },
      include: {
        subject: true
      }
    });

    // 4. Calculate Averages
    const subjectAverages: Record<string, any> = {};
    let totalPoints = 0;
    let totalCoefficients = 0;

    for (const g of grades) {
       const subId = g.subjectId;
       if (!subjectAverages[subId]) {
           subjectAverages[subId] = {
               subjectName: g.subject?.name || 'Inconnue',
               coefficient: g.subject?.coefficient || 1,
               grades: [],
               average: 0
           };
       }
       subjectAverages[subId].grades.push(g.value);
    }

    const results = Object.values(subjectAverages).map((sub: any) => {
        const sum = sub.grades.reduce((a: number, b: number) => a + b, 0);
        const avg = sum / sub.grades.length;
        sub.average = parseFloat(avg.toFixed(2));
        
        totalPoints += (sub.average * sub.coefficient);
        totalCoefficients += sub.coefficient;

        return sub;
    });

    const globalAverage = totalCoefficients > 0 ? (totalPoints / totalCoefficients) : 0;

    return {
        student: { id: studentId, matricule: student.matricule, firstName: student.firstName, lastName: student.lastName },
        class: await this.prisma.class.findUnique({ where: { id: record.classId } }),
        academicYear: await this.prisma.academicYear.findUnique({ where: { id: academicYearId } }),
        term: Number(term),
        subjects: results,
        globalAverage: parseFloat(globalAverage.toFixed(2)),
        totalCoefficients,
        totalPoints: parseFloat(totalPoints.toFixed(2)),
        generatedAt: new Date()
    };
  }
}

