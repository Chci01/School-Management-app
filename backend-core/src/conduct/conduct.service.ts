import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateConductDto, CalculateConductDto } from './dto/create-conduct.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class ConductService {
  constructor(private firestore: FirestoreService) {}

  private readonly gradesCollection = 'conduct_grades';
  private readonly globalCollection = 'global_conduct';
  private readonly usersCollection = 'users';

  async submitTeacherConduct(createConductDto: CreateConductDto, user: any) {
    if (user.role !== 'ENSEIGNANT') throw new BadRequestException('Only teachers can submit this');

    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.gradesCollection)
      .where('studentId', '==', createConductDto.studentId)
      .where('teacherId', '==', user.id)
      .where('month', '==', createConductDto.month)
      .where('year', '==', createConductDto.year)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return this.firestore.update(this.gradesCollection, doc.id, {
        grade: createConductDto.grade,
        appreciation: createConductDto.appreciation
      });
    }

    return this.firestore.create(this.gradesCollection, {
      ...createConductDto,
      teacherId: user.id,
    });
  }

  async calculateGlobalConduct(dto: CalculateConductDto, user: any) {
    const db = this.firestore.getDb();
    const studentsSnapshot = await db.collection(this.usersCollection)
      .where('schoolId', '==', user.schoolId)
      .where('role', '==', 'ELEVE')
      .get();

    let processedCount = 0;

    for (const studentDoc of studentsSnapshot.docs) {
      const studentId = studentDoc.id;
      const gradesSnapshot = await db.collection(this.gradesCollection)
        .where('studentId', '==', studentId)
        .where('month', '==', dto.month)
        .where('year', '==', dto.year)
        .get();

      if (gradesSnapshot.empty) continue;

      const grades = gradesSnapshot.docs.map(doc => doc.data() as any);
      const sum = grades.reduce((acc, curr) => acc + curr.grade, 0);
      const average = sum / grades.length;

      let appreciation = 'Passable';
      if (average >= 16) appreciation = 'Félicitations';
      else if (average >= 14) appreciation = 'Très Bien';
      else if (average >= 12) appreciation = 'Assez Bien';
      else if (average < 10) appreciation = 'Avertissement Conduct';

      const globalSnapshot = await db.collection(this.globalCollection)
        .where('studentId', '==', studentId)
        .where('month', '==', dto.month)
        .where('year', '==', dto.year)
        .limit(1)
        .get();

      const globalData = {
        schoolId: user.schoolId,
        studentId,
        month: dto.month,
        year: dto.year,
        grade: average,
        appreciation,
      };

      if (!globalSnapshot.empty) {
        await this.firestore.update(this.globalCollection, globalSnapshot.docs[0].id, globalData);
      } else {
        await this.firestore.create(this.globalCollection, globalData);
      }
      processedCount++;
    }

    return { message: `Calculated Global Conduct for ${processedCount} students.` };
  }

  async getGlobalConduct(studentId: string, month: number, year: number) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.globalCollection)
      .where('studentId', '==', studentId)
      .where('month', '==', month)
      .where('year', '==', year)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
}

