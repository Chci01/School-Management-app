import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';
const files = ['Students.tsx', 'Parents.tsx', 'Teachers.tsx', 'Classes.tsx', 'Subjects.tsx', 'Grades.tsx', 'Absences.tsx', 'Timetable.tsx', 'Exams.tsx', 'Messages.tsx', 'Library.tsx', 'Dashboard.tsx'];

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix hardcoded colors
    content = content.replace(/color: '#0F172A'/g, "color: 'var(--text)'");
    content = content.replace(/color: '#64748B'/g, "color: 'var(--text-muted)'");
    content = content.replace(/color: '#475569'/g, "color: 'var(--text-muted)'");
    content = content.replace(/color: '#94A3B8'/g, "color: 'var(--text-muted)'");
    
    content = content.replace(/borderBottom: '2px solid #F1F5F9'/g, "borderBottom: '2px solid var(--border)'");
    content = content.replace(/borderBottom: '1px solid #F1F5F9'/g, "borderBottom: '1px solid var(--border)'");
    content = content.replace(/background: '#F1F5F9'/g, "background: 'var(--surface)'");
    content = content.replace(/background: '#F8FAFC'/g, "background: 'var(--surface)'");
    content = content.replace(/border: '1px solid #E2E8F0'/g, "border: '1px solid var(--border)'");
    
    // Specifically for Dashboard titles that might be invisible
    content = content.replace(/<h3>(.*?)<\/h3>/g, "<h3 style={{color: 'var(--text)'}}>$1</h3>");
    content = content.replace(/<h4>(.*?)<\/h4>/g, "<h4 style={{color: 'var(--text)'}}>$1</h4>");

    // Inject useAuth to get currentSchoolId
    if (['Students.tsx', 'Parents.tsx', 'Teachers.tsx'].includes(file)) {
        if (!content.includes('useAuth')) {
            content = content.replace("import { useUsers } from '../hooks/useUsers';", "import { useUsers } from '../hooks/useUsers';\nimport { useAuth } from '../hooks/useAuth';");
            content = content.replace(/const { users, isLoading, error, deleteUser } = useUsers\(undefined, '(.*?)'\);/, "const { currentSchoolId } = useAuth();\n  const { users, isLoading, error, deleteUser } = useUsers(currentSchoolId!, '$1');");
        }
    }
    
    if (file === 'Classes.tsx') {
        if (!content.includes('useAuth')) {
            content = content.replace("import { useClasses } from '../hooks/useClasses';", "import { useClasses } from '../hooks/useClasses';\nimport { useAuth } from '../hooks/useAuth';");
            content = content.replace("const { classes, isLoading, error, deleteClass } = useClasses();", "const { currentSchoolId } = useAuth();\n  const { classes, isLoading, error, deleteClass } = useClasses(currentSchoolId!);");
        }
    }

    if (file === 'Subjects.tsx') {
        if (!content.includes('useAuth')) {
            content = content.replace("import { useSubjects } from '../hooks/useSubjects';", "import { useSubjects } from '../hooks/useSubjects';\nimport { useAuth } from '../hooks/useAuth';");
            content = content.replace("const { subjects, isLoading, error, deleteSubject } = useSubjects();", "const { currentSchoolId } = useAuth();\n  const { subjects, isLoading, error, deleteSubject } = useSubjects(currentSchoolId!);");
        }
    }

    if (file === 'Grades.tsx') {
        if (!content.includes('useAuth')) {
            content = content.replace("import { useGrades } from '../hooks/useGrades';", "import { useGrades } from '../hooks/useGrades';\nimport { useAuth } from '../hooks/useAuth';");
            content = content.replace(/const { grades, isLoading, error } = useGrades\(undefined,/g, "const { currentSchoolId } = useAuth();\n  const { grades, isLoading, error } = useGrades(currentSchoolId!,");
        }
    }

    fs.writeFileSync(filePath, content);
  }
});

console.log('Colors, School IDs and Dashboard fixed!');
