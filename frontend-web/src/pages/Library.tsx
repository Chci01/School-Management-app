
import { BookOpen, Plus } from 'lucide-react';

const Library = () => {
  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={28} color="#10B981" />
            Bibliothèque
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Gestion du module bibliothèque.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10B981', color: 'var(--text)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="dash-card" style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-secondary)' }}>
        <BookOpen size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
        <h3 style={{color: 'var(--text)'}}>Aucune donnée pour le moment</h3>
        <p style={{ marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>Commencez par ajouter des éléments à ce module pour les voir apparaître ici.</p>
      </div>
    </div>
  );
};

export default Library;
