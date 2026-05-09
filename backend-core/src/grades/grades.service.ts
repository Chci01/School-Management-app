import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class GradesService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'grades';
  private readonly subjectsCollection = 'subjects';
  private readonly classesCollection = 'classes';

  async create(schoolId: string, createGradeDto: CreateGradeDto) {
    const subject = await this.firestore.findOne(this.subjectsCollection, createGradeDto.subjectId) as any;
    if (!subject || subject.schoolId !== schoolId) throw new NotFoundException('Matière invalide');
    
    const classEntity = await this.firestore.findOne(this.classesCollection, createGradeDto.classId) as any;
    if (!classEntity || classEntity.schoolId !== schoolId) throw new NotFoundException('Classe invalide');

    const grade = {
      ...createGradeDto,
      schoolId,
    };

    return this.firestore.create(this.collection, grade);
  }

  async findAllByStudent(schoolId: string, studentId: string, academicYearId?: string) {
    const db = this.firestore.getDb();
    let query = db.collection(this.collection)
      .where('schoolId', '==', schoolId)
      .where('studentId', '==', studentId);
    
    if (academicYearId) {
      query = query.where('academicYearId', '==', academicYearId);
    }

    const snapshot = await query.get();
    const grades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    // Manually join subjects for coefficient logic
    for (const g of grades) {
      g.subject = await this.firestore.findOne(this.subjectsCollection, g.subjectId);
    }

    return grades;
  }

  async calculateStudentAverage(schoolId: string, studentId: string, academicYearId: string) {
    const grades = await this.findAllByStudent(schoolId, studentId, academicYearId);
    if (grades.length === 0) return 0;

    let totalPoints = 0;
    let totalCoefficients = 0;

    grades.forEach(g => {
        const coef = g.subject?.coefficient || 1;
        totalPoints += g.value * coef;
        totalCoefficients += coef;
    });

    return totalCoefficients > 0 ? (totalPoints / totalCoefficients) : 0;
  }

  async upsertBulk(schoolId: string, grades: CreateGradeDto[]) {
    const db = this.firestore.getDb();
    const results: any[] = [];

    for (const g of grades) {
      const snapshot = await db.collection(this.collection)
        .where('schoolId', '==', schoolId)
        .where('studentId', '==', g.studentId)
        .where('subjectId', '==', g.subjectId)
        .where('academicYearId', '==', g.academicYearId)
        .where('term', '==', g.term || 1)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await this.firestore.update(this.collection, doc.id, { value: g.value });
        results.push({ id: doc.id, ...doc.data(), value: g.value });
      } else {
        const newGrade = await this.firestore.create(this.collection, { ...g, schoolId });
        results.push(newGrade);
      }
    }
    return results;
  }
}

