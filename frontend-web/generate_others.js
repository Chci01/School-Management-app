import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';

const generateGenericPage = (name, title, icon, color) => `
import { ${icon}, Plus, Search } from 'lucide-react';

const ${name} = () => {
  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <${icon} size={28} color="${color}" />
            ${title}
          </h2>
          <p style={{ color: '#64748B', marginTop: '4px' }}>Gestion du module ${title.toLowerCase()}.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '${color}', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="dash-card" style={{ textAlign: 'center', padding: '64px 20px', color: '#64748B' }}>
        <${icon} size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
        <h3>Aucune donnée pour le moment</h3>
        <p style={{ marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>Commencez par ajouter des éléments à ce module pour les voir apparaître ici.</p>
      </div>
    </div>
  );
};

export default ${name};
`;

fs.writeFileSync(path.join(pagesDir, 'Absences.tsx'), generateGenericPage('Absences', 'Gestion des Absences', 'CalendarX', '#EF4444'));
fs.writeFileSync(path.join(pagesDir, 'Timetable.tsx'), generateGenericPage('Timetable', 'Emploi du temps', 'Calendar', '#3B82F6'));
fs.writeFileSync(path.join(pagesDir, 'Exams.tsx'), generateGenericPage('Exams', 'Examens', 'FileText', '#F59E0B'));
fs.writeFileSync(path.join(pagesDir, 'Messages.tsx'), generateGenericPage('Messages', 'Messagerie', 'MessageSquare', '#8B5CF6'));
fs.writeFileSync(path.join(pagesDir, 'Library.tsx'), generateGenericPage('Library', 'Bibliothèque', 'BookOpen', '#10B981'));

console.log('Other pages generated successfully!');
