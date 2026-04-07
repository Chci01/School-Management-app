import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clean existing database
  await prisma.grade.deleteMany();
  await prisma.academicRecord.deleteMany();
  await prisma.healthRecord.deleteMany();
  await prisma.documentRequest.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.badgeTemplate.deleteMany();
  await prisma.parentStudent.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  // 2. Create Global Super Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.create({
    data: {
      matricule: 'SUPER_ADMIN_001',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      firstName: 'Global',
      lastName: 'Administrator',
      email: 'admin@schoolmanagement.com'
    }
  });
  console.log(`Created Super Admin: ${superAdmin.matricule}`);

  // 3. Create 2 Schools
  const school1 = await prisma.school.create({
    data: {
      name: 'Lycée d\'Excellence Bamako',
      address: 'ACI 2000, Bamako',
      email: 'contact@lycee-excellence.ml',
      phone: '+223 70 00 00 01',
      licenseKey: uuidv4(),
      isActive: true,
      licenseExpiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    }
  });

  const school2 = await prisma.school.create({
    data: {
      name: 'School Management-Mali',
      address: 'Kalaban Coro, Bamako',
      email: 'info@school-management.ml',
      phone: '+223 70 00 00 02',
      licenseKey: uuidv4(),
      isActive: true,
      licenseExpiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    }
  });
  console.log('Created Schools.');

  // 4. Create Settings (Badge Templates)
  await prisma.badgeTemplate.createMany({
    data: [
      { schoolId: school1.id, primaryColor: '#2563eb', secondaryColor: '#ffffff' },
      { schoolId: school2.id, primaryColor: '#10b981', secondaryColor: '#ffffff' },
    ]
  });

  // 5. Create Academic Years
  const year1 = await prisma.academicYear.create({
    data: { name: '2023-2024', isActive: false, schoolId: school1.id }
  });
  const year2 = await prisma.academicYear.create({
    data: { name: '2024-2025', isActive: true, schoolId: school1.id }
  });
  const year3 = await prisma.academicYear.create({
    data: { name: '2024-2025', isActive: true, schoolId: school2.id }
  });

  // 6. Create Classes
  const class1 = await prisma.class.create({ data: { name: 'Terminale Sciences Exactes', level: 12, schoolId: school1.id, academicYearId: year2.id } });
  const class2 = await prisma.class.create({ data: { name: '10ème Commune', level: 10, schoolId: school1.id, academicYearId: year2.id } });

  const class3 = await prisma.class.create({ data: { name: '9ème Année Fondamentale', level: 9, schoolId: school2.id, academicYearId: year3.id } });

  // 7. Create Users (Admins, Teachers, Students) for School 1
  const schoolAdmin1 = await prisma.user.create({
    data: { matricule: 'ADM_EXC_01', password: adminPassword, role: 'SCHOOL_ADMIN', firstName: 'Directeur', lastName: 'Excellence', schoolId: school1.id }
  });

  const teacher1 = await prisma.user.create({
    data: { matricule: 'PROF_MATH_01', password: userPassword, role: 'TEACHER', firstName: 'Moussa', lastName: 'Traoré', schoolId: school1.id }
  });

  const parent1 = await prisma.user.create({
    data: { matricule: 'PAR_EXC_001', password: userPassword, role: 'PARENT', firstName: 'Moussa', lastName: 'Traoré', schoolId: school1.id }
  });

  const student1 = await prisma.user.create({
    data: { matricule: 'ETU_EXC_001', password: userPassword, role: 'STUDENT', firstName: 'Fanta', lastName: 'Traoré', schoolId: school1.id }
  });

  const student2 = await prisma.user.create({
    data: { matricule: 'ETU_EXC_002', password: userPassword, role: 'STUDENT', firstName: 'Seydou', lastName: 'Keita', schoolId: school1.id }
  });

  // Link Parent to Student
  await prisma.parentStudent.create({ data: { parentId: parent1.id, studentId: student1.id } });

  // Assign Students to Class (via AcademicRecord)
  await prisma.academicRecord.create({ data: { studentId: student1.id, classId: class1.id, academicYearId: year2.id, schoolId: school1.id, average: 0, status: 'PROMOTED' } });
  await prisma.academicRecord.create({ data: { studentId: student2.id, classId: class1.id, academicYearId: year2.id, schoolId: school1.id, average: 0, status: 'PROMOTED' } });

  // 8. Create Users for School 2
  await prisma.user.create({
    data: { matricule: 'ADM_SMM_01', password: adminPassword, role: 'SCHOOL_ADMIN', firstName: 'Directeur', lastName: 'SMM', schoolId: school2.id }
  });

  const student3 = await prisma.user.create({
    data: { matricule: 'ETU_SMM_001', password: userPassword, role: 'STUDENT', firstName: 'Fatoumata', lastName: 'Coulibaly', schoolId: school2.id }
  });
  await prisma.academicRecord.create({ data: { studentId: student3.id, classId: class3.id, academicYearId: year3.id, schoolId: school2.id, average: 0, status: 'PROMOTED' } });

  // 9. Generate Dummy Data (Announcements & Payments)
  await prisma.announcement.create({
    data: {
      title: 'Réunion des Parents d\'Élèves',
      content: 'La première réunion de prise de contact se tiendra le samedi prochain dans la grande salle.',
      schoolId: school1.id,
      target: 'PARENT'
    }
  });

  await prisma.payment.create({
    data: {
      studentId: student1.id,
      schoolId: school1.id,
      amount: 50000,
      tranche: 1,
      receiptNumber: 'REC-2024-001'
    }
  });

  await prisma.payment.create({
    data: {
      studentId: student2.id,
      schoolId: school1.id,
      amount: 25000,
      tranche: 2,
      receiptNumber: 'REC-2024-002'
    }
  });

  // 10. Create Subjects (Added for schedules)
  const mathSubject = await prisma.subject.create({ data: { name: 'Mathématiques', schoolId: school1.id } });
  const physicsSubject = await prisma.subject.create({ data: { name: 'Physique', schoolId: school1.id } });

  // ---------------------------------------------------------
  // 11. SEED SCHEDULES (EMPLOIS DU TEMPS)
  // ---------------------------------------------------------
  console.log('📝 Seeding schedules...');
  const monday = 1;
  const tuesday = 2;

  await prisma.schedule.createMany({
    data: [
      {
        schoolId: school1.id,
        classId: class1.id,
        subjectId: mathSubject.id,
        teacherId: teacher1.id,
        dayOfWeek: monday,
        startTime: '08:00',
        endTime: '10:00',
        room: 'Salle Terminale S1'
      },
      {
        schoolId: school1.id,
        classId: class1.id,
        subjectId: physicsSubject.id,
        teacherId: teacher1.id,
        dayOfWeek: monday,
        startTime: '10:15',
        endTime: '12:15',
        room: 'Labo Physique'
      },
      {
        schoolId: school1.id,
        classId: class1.id,
        subjectId: mathSubject.id,
        teacherId: teacher1.id,
        dayOfWeek: tuesday,
        startTime: '14:00',
        endTime: '16:00',
        room: 'Salle Terminale S1'
      }
    ]
  });

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
