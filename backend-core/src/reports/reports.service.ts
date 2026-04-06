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
    // Upsert the publication status
    const publication = await this.prisma.termPublication.upsert({
      where: {
        schoolId_academicYearId_classId_term: {
          schoolId,
          academicYearId,
          classId: classId || '', // Prisma might need a string if it's part of a compound unique, but wait, schema says classId is optional. If it's nullable in compound unique, it's problematic in some DBs. Let's findFirst and update or create.
          term
        }
      },
      update: { isPublished },
      create: { schoolId, academicYearId, classId, term, isPublished }
    }).catch(async () => {
       // Manual fallback if upsert fails due to null classId
       const existing = await this.prisma.termPublication.findFirst({
         where: { schoolId, academicYearId, classId, term }
       });
       if (existing) {
         return this.prisma.termPublication.update({ where: { id: existing.id }, data: { isPublished } });
       }
       return this.prisma.termPublication.create({ data: { schoolId, academicYearId, classId, term, isPublished }});
    });

    if (isPublished) {
      this.eventEmitter.emit('bulletin.published', {
        schoolId,
        academicYearId,
        classId,
        term
      });
    }

    return publication;
  }

  async generateBulletin(schoolId: string, studentId: string, term: number, academicYearId: string) {
    // 1. Fetch Student Details
    const student = await this.prisma.user.findUnique({
      where: { id: studentId, schoolId },
      select: { id: true, matricule: true, firstName: true, lastName: true }
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // 2. Fetch Academic Record to get the Class
    const record = await this.prisma.academicRecord.findFirst({
      where: { studentId, schoolId, academicYearId },
      include: { class: true, academicYear: true }
    });

    if (!record) {
      throw new NotFoundException('Academic record not found for this year');
    }

    // 2.b Check if Term is Published
    const publication = await this.prisma.termPublication.findFirst({
      where: {
        schoolId,
        academicYearId,
        term: Number(term),
        OR: [{ classId: null }, { classId: record.class.id }]
      }
    });

    if (!publication || !publication.isPublished) {
      throw new ForbiddenException('Le bulletin de ce trimestre n\'est pas encore publié par l\'administration.');
    }

    // 3. Fetch all grades for this student, term, and year
    const grades = await this.prisma.grade.findMany({
      where: {
        studentId,
        schoolId,
        academicYearId,
        term: Number(term),
      },
      include: {
        subject: true
      }
    });

    // 4. Calculate Averages per Subject and Global
    const subjectAverages = {};
    let totalPoints = 0;
    let totalCoefficients = 0;

    // Group grades by Subject
    grades.forEach(g => {
       const subId = g.subjectId;
       if (!subjectAverages[subId]) {
           subjectAverages[subId] = {
               subjectName: g.subject.name,
               coefficient: g.subject.coefficient,
               grades: [],
               average: 0
           };
       }
       subjectAverages[subId].grades.push(g.value);
    });

    // Calculate individual subject averages
    const results = Object.values(subjectAverages).map((sub: any) => {
        const sum = sub.grades.reduce((a, b) => a + b, 0);
        const avg = sum / sub.grades.length;
        sub.average = parseFloat(avg.toFixed(2));
        
        totalPoints += (sub.average * sub.coefficient);
        totalCoefficients += sub.coefficient;

        return sub;
    });

    const globalAverage = totalCoefficients > 0 ? (totalPoints / totalCoefficients) : 0;

    return {
        student,
        class: record.class,
        academicYear: record.academicYear,
        term: Number(term),
        subjects: results,
        globalAverage: parseFloat(globalAverage.toFixed(2)),
        totalCoefficients,
        totalPoints: parseFloat(totalPoints.toFixed(2)),
        generatedAt: new Date()
    };
  }
}
