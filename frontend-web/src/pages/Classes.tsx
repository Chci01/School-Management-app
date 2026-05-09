

import { useClasses } from '../hooks/useClasses';
import { useAuth } from '../hooks/useAuth';
import { Layers, Plus, Trash2, Edit } from 'lucide-react';

const Classes = () => {
  const { currentSchoolId } = useAuth();
  const { classes, isLoading, error, deleteClass } = useClasses(currentSchoolId!);

  if (isLoading) return <div className="dashboard-container"><div className="spinner">Chargement...</div></div>;

  const displayedClasses = Array.isArray(classes) ? classes : [];

  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={28} color="#F97316" />
            Gestion des Classes
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Consultez, ajoutez ou modifiez les classes de l'établissement.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F97316', color: 'var(--text)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Nouvelle Classe
        </button>
      </div>

      <div className="dash-card">
        {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>Erreur de chargement.</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nom de la classe</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Niveau</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedClasses.map((cls: any) => (
              <tr key={cls.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text)' }}>{cls.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Niveau {cls.level}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3B82F6', marginRight: '12px' }}><Edit size={18} /></button>
                  <button onClick={() => { if(window.confirm('Supprimer ?')) deleteClass(cls.id) }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {displayedClasses.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune classe trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classes;
