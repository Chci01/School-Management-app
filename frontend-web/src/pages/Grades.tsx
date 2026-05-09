import { useState } from 'react';
import { useGrades } from '../hooks/useGrades';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { useSubjects } from '../hooks/useSubjects';
import { ClipboardList, Plus, Edit } from 'lucide-react';

const Grades = () => {
  const { currentSchoolId } = useAuth();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const { classes } = useClasses(currentSchoolId!);
  const { subjects } = useSubjects(currentSchoolId!);

  const { grades, isLoading, error } = useGrades(currentSchoolId!, selectedClass || undefined, selectedSubject || undefined);

  if (isLoading && (!classes || !subjects)) return <div className="dashboard-container"><div className="spinner">Chargement...</div></div>;

  const displayedGrades = Array.isArray(grades) ? grades : [];

  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={28} color="#8B5CF6" />
            Gestion des Notes
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Saisissez, consultez et modifiez les notes des élèves.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#8B5CF6', color: 'var(--text)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Saisie multiple
        </button>
      </div>

      <div className="dash-card">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', minWidth: '200px' }}
          >
            <option value="">Toutes les classes</option>
            {Array.isArray(classes) && classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', minWidth: '200px' }}
          >
            <option value="">Toutes les matières</option>
            {Array.isArray(subjects) && subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>Erreur de chargement.</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Élève</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Classe</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Matière</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Note (/20)</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedGrades.map((g: any) => (
              <tr key={g.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text)' }}>
                  {g.student ? `${g.student.firstName} ${g.student.lastName}` : 'Inconnu'}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{g.class?.name || '-'}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{g.subject?.name || '-'}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{g.type || 'Devoir'}</td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: g.value >= 10 ? '#10B981' : '#EF4444' }}>{g.value}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3B82F6' }}><Edit size={18} /></button>
                </td>
              </tr>
            ))}
            {displayedGrades.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune note trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;
