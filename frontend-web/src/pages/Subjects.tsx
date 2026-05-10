import { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Plus, Trash2, Edit, X, Search, Layers } from 'lucide-react';

const Subjects = () => {
  const { currentSchoolId } = useAuth();
  const { subjects, isLoading, error, deleteSubject, createSubject } = useSubjects(currentSchoolId!);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    coefficient: 1,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createSubject({
      ...formData,
      schoolId: currentSchoolId,
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ name: '', coefficient: 1 });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner" style={{ color: '#10B981' }}>Chargement des matières...</div>
      </div>
    );
  }

  const displayedSubjects = (Array.isArray(subjects) ? subjects : []).filter((s: any) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
              <BookOpen size={28} />
            </div>
            Programmes d'Enseignement
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Gérez la liste des matières et leurs coefficients respectifs.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, background: '#10b981' }}
        >
          <Plus size={20} /> Nouvelle Matière
        </button>
      </div>

      <div className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '12px 20px', borderRadius: '12px', width: '350px', border: '1px solid var(--border)' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Rechercher une matière..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%', color: 'var(--text)' }} 
            />
          </div>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>Erreur de chargement.</div>}

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <th style={{ padding: '12px 24px' }}>Matière</th>
                <th style={{ padding: '12px 24px' }}>Coefficient</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedSubjects.map((sub: any) => (
                <tr key={sub.id} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <td style={{ padding: '16px 24px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                          <Layers size={18} />
                       </div>
                       <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{sub.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 12px', background: 'var(--surface)', borderRadius: '8px', fontWeight: 800, color: 'var(--primary)', border: '1px solid var(--border)' }}>
                      x{sub.coefficient}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button className="btn-secondary" style={{ padding: '10px' }}><Edit size={16} /></button>
                      <button onClick={() => { if(window.confirm('Supprimer cette matière ?')) deleteSubject(sub.id) }} className="btn-secondary" style={{ padding: '10px', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedSubjects.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.1 }} />
                    <p>Aucune matière enregistrée.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SUBJECT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '450px', maxWidth: '95%', padding: '32px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
                  <Plus size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Nouvelle Matière</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="input-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nom de la matière</label>
                <input required type="text" placeholder="Ex: Mathématiques, Histoire..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>
              <div className="input-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Coefficient</label>
                <input required type="number" min="1" max="10" value={formData.coefficient} onChange={e => setFormData({...formData, coefficient: parseInt(e.target.value)})} style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '16px', borderRadius: '12px' }}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '16px', borderRadius: '12px', fontWeight: 700, background: '#10b981' }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;

