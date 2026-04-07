const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /Role\.SCHOOL_ADMIN/g, to: 'Role.ADMIN_ECOLE' },
  { from: /Role\.TEACHER/g, to: 'Role.ENSEIGNANT' },
  { from: /Role\.STUDENT/g, to: 'Role.ELEVE' },
  { from: /'SCHOOL_ADMIN'/g, to: "'ADMIN_ECOLE'" },
  { from: /'TEACHER'/g, to: "'ENSEIGNANT'" },
  { from: /'STUDENT'/g, to: "'ELEVE'" },
  { from: /"SCHOOL_ADMIN"/g, to: '"ADMIN_ECOLE"' },
  { from: /"TEACHER"/g, to: '"ENSEIGNANT"' },
  { from: /"STUDENT"/g, to: '"ELEVE"' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'dist_backend') {
        processDir(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.dart')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const rep of replacements) {
        if (rep.from.test(content)) {
          content = content.replace(rep.from, rep.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Refactored: ${fullPath}`);
      }
    }
  }
}

// Start in the workspace root or key folders
const workspaceRoot = 'c:\\Users\\DILITECH\\.gemini\\antigravity\\scratch\\school_management';
console.log('🚀 Starting Global Role Refactor...');
processDir(path.join(workspaceRoot, 'backend-core', 'src'));
processDir(path.join(workspaceRoot, 'frontend-web', 'src'));
processDir(path.join(workspaceRoot, 'frontend_mobile', 'lib'));
console.log('✨ Global Role Refactor Complete!');
