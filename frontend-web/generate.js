import fs from 'fs';

const pages = ['Students', 'Parents', 'Teachers', 'Classes', 'Subjects', 'Grades', 'Absences', 'Timetable', 'Exams', 'Messages', 'Library', 'Settings'];

pages.forEach(p => {
  const content = `import React from 'react';

const ${p} = () => {
  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header">
        <h1>${p}</h1>
        <p>Gestion des ${p.toLowerCase()}</p>
      </header>
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Fonctionnalité en cours de développement...
      </div>
    </div>
  );
};

export default ${p};
`;
  fs.writeFileSync('src/pages/' + p + '.tsx', content);
});
