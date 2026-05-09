import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReportsService {
  constructor(
    private firestore: FirestoreService,
    private eventEmitter: EventEmitter2
  ) {}

  private readonly publicationsCollection = 'term_publications';
  private readonly usersCollection = 'users';
  private readonly recordsCollection = 'academic_records';
  private readonly gradesCollection = 'grades';
  private readonly subjectsCollection = 'subjects';

  async publishTerm(schoolId: string, academicYearId: string, classId: string | null, term: number, isPublished: boolean) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.publicationsCollection)
      .where('schoolId', '==', schoolId)
      .where('academicYearId', '==', academicYearId)
      .where('classId', '==', classId)
      .where('term', '==', term)
      .limit(1)
      .get();

    const data = { schoolId, academicYearId, classId, term, isPublished, updatedAt: new Date() };

    let publication;
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await this.firestore.update(this.publicationsCollection, doc.id, data);
      publication = { id: doc.id, ...data };
    } else {
      publication = await this.firestore.create(this.publicationsCollection, { ...data, createdAt: new Date() });
    }

    if (isPublished) {
      this.eventEmitter.emit('bulletin.published', { schoolId, academicYearId, classId, term });
    }

    return publication;
  }

  async generateBulletin(schoolId: string, studentId: string, term: number, academicYearId: string, userRole: string = 'ELEVE') {
    // 1. Fetch Student Details
    const student = await this.firestore.findOne(this.usersCollection, studentId) as any;
    if (!student || student.schoolId !== schoolId) {
      throw new NotFoundException('Student not found');
    }

    // 2. Fetch Academic Record to get the Class
    const db = this.firestore.getDb();
    const recordSnapshot = await db.collection(this.recordsCollection)
      .where('studentId', '==', studentId)
      .where('schoolId', '==', schoolId)
      .where('academicYearId', '==', academicYearId)
      .limit(1)
      .get();

    if (recordSnapshot.empty) {
      throw new NotFoundException("L'eleve n'est inscrit dans aucune classe pour cette annee academique.");
    }
    const record = recordSnapshot.docs[0].data() as any;

    const isAdminOrTeacher = ['ADMIN_ECOLE', 'SUPER_ADMIN', 'ENSEIGNANT'].includes(userRole);

    if (!isAdminOrTeacher) {
      // Check if published
      const pubSnapshot = await db.collection(this.publicationsCollection)
        .where('schoolId', '==', schoolId)
        .where('academicYearId', '==', academicYearId)
        .where('term', '==', Number(term))
        .where('isPublished', '==', true)
        .get();

      const isPublished = pubSnapshot.docs.some(doc => {
        const data = doc.data();
        return data.classId === null || data.classId === record.classId;
      });

      if (!isPublished) {
        throw new ForbiddenException('Le bulletin de ce trimestre n\'est pas encore publié par l\'administration.');
      }
    }

    // 3. Fetch all grades
    const gradesSnapshot = await db.collection(this.gradesCollection)
      .where('studentId', '==', studentId)
      .where('schoolId', '==', schoolId)
      .where('academicYearId', '==', academicYearId)
      .where('term', '==', Number(term))
      .get();

    const grades = gradesSnapshot.docs.map(doc => doc.data() as any);

    // 4. Calculate Averages
    const subjectAverages = {};
    let totalPoints = 0;
    let totalCoefficients = 0;

    for (const g of grades) {
       const subId = g.subjectId;
       if (!subjectAverages[subId]) {
           const subject = await this.firestore.findOne(this.subjectsCollection, subId) as any;
           subjectAverages[subId] = {
               subjectName: subject?.name || 'Inconnue',
               coefficient: subject?.coefficient || 1,
               grades: [],
               average: 0
           };
       }
       subjectAverages[subId].grades.push(g.value);
    }

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
        student: { id: studentId, matricule: student.matricule, firstName: student.firstName, lastName: student.lastName },
        class: await this.firestore.findOne('classes', record.classId),
        academicYear: await this.firestore.findOne('academic_years', academicYearId),
        term: Number(term),
        subjects: results,
        globalAverage: parseFloat(globalAverage.toFixed(2)),
        totalCoefficients,
        totalPoints: parseFloat(totalPoints.toFixed(2)),
        generatedAt: new Date()
    };
  }
}

