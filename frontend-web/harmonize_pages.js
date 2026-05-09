import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix hardcoded colors to use CSS variables
  // Replace white/black variants with theme variables
  content = content.replace(/color: '#0F172A'/g, "color: 'var(--text)'");
  content = content.replace(/color: '#64748B'/g, "color: 'var(--text-muted)'");
  content = content.replace(/color: '#475569'/g, "color: 'var(--text-muted)'");
  content = content.replace(/color: '#94A3B8'/g, "color: 'var(--text-muted)'");
  content = content.replace(/color: '#F8FAFC'/g, "color: 'var(--text)'");
  content = content.replace(/color: 'white'/g, "color: 'var(--text)'");
  content = content.replace(/color: '#fff'/g, "color: 'var(--text)'");
  
  // Fix background colors
  content = content.replace(/background: '#F1F5F9'/g, "background: 'var(--surface)'");
  content = content.replace(/background: '#F8FAFC'/g, "background: 'var(--surface)'");
  content = content.replace(/background: 'white'/g, "background: 'var(--surface)'");
  content = content.replace(/backgroundColor: '#fff'/g, "backgroundColor: 'var(--surface)'");
  
  // Fix borders
  content = content.replace(/border: '1px solid #E2E8F0'/g, "border: '1px solid var(--border)'");
  content = content.replace(/borderBottom: '1px solid rgba\(255,255,255,0.1\)'/g, "borderBottom: '1px solid var(--border)'");
  content = content.replace(/borderBottom: '1px solid rgba\(255,255,255,0.05\)'/g, "borderBottom: '1px solid var(--border)'");
  content = content.replace(/borderBottom: '2px solid #F1F5F9'/g, "borderBottom: '2px solid var(--border)'");

  // 2. Ensure consistency of titles
  content = content.replace(/<h3>(.*?)<\/h3>/g, "<h3 style={{color: 'var(--text)'}}>$1</h3>");
  content = content.replace(/<h4>(.*?)<\/h4>/g, "<h4 style={{color: 'var(--text)'}}>$1</h4>");

  // 3. Inject useAuth and currentSchoolId where missing in hooks
  const hooksToFix = [
    { name: 'useUsers', pattern: /useUsers\(undefined/g, replacement: 'useUsers(currentSchoolId!' },
    { name: 'useClasses', pattern: /useClasses\(\)/g, replacement: 'useClasses(currentSchoolId!)' },
    { name: 'useSubjects', pattern: /useSubjects\(\)/g, replacement: 'useSubjects(currentSchoolId!)' },
    { name: 'useGrades', pattern: /useGrades\(undefined/g, replacement: 'useGrades(currentSchoolId!' }
  ];

  let needsUseAuth = false;
  hooksToFix.forEach(hook => {
    if (content.includes(hook.name) && content.match(hook.pattern)) {
        content = content.replace(hook.pattern, hook.replacement);
        needsUseAuth = true;
    }
  });

  if (needsUseAuth && !content.includes('useAuth')) {
      content = content.replace(/import { (.*?) } from '..\/hooks\/(.*?)';/, "import { $1 } from '../hooks/$2';\nimport { useAuth } from '../hooks/useAuth';");
      content = content.replace(/const (.*?) = \(\) => {/, "const $1 = () => {\n  const { currentSchoolId } = useAuth();");
  }

  fs.writeFileSync(filePath, content);
});

console.log('All pages harmonized for the light/white theme and School IDs injected!');
