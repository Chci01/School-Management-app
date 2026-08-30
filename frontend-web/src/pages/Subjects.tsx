import { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Plus, Trash2, Edit, X } from 'lucide-react';
import { useClasses } from '../hooks/useClasses';

const Subjects = () => {
  const { currentSchoolId } = useAuth();
  const { subjects, isLoading, error, deleteSubject, createSubject, updateSubject } = useSubjects(currentSchoolId!);
  const { classes } = useClasses(currentSchoolId!);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: '', coefficient: 1, classId: '' });

  if (isLoading) return <div className="dashboard-container"><div className="spinner">Chargement...</div></div>;

  const displayedSubjects = Array.isArray(subjects) ? subjects : [];

  const handleEditClick = (sub: any) => {
    setEditingSubject(sub);
    setFormData({ name: sub.name, coefficient: sub.coefficient || 1, classId: sub.classId || '' });
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classId) return alert('Veuillez sélectionner une classe.');

    const payload = { 
      ...formData, 
      coefficient: parseInt(formData.coefficient.toString()),
      schoolId: currentSchoolId,
    };

    if (editingSubject) {
      updateSubject({ id: editingSubject.id, data: payload }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingSubject(null);
        }
      });
    } else {
      createSubject(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ name: '', coefficient: 1, classId: '' });
        }
      });
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '10px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: '#38BDF8' }}>
               <BookOpen size={28} />
            </div>
            Gestion des Matières
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Consultez, ajoutez ou modifiez les matières enseignées.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setEditingSubject(null); setFormData({ name: '', coefficient: 1, classId: '' }); setIsModalOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#38BDF8', color: 'var(--text)', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}
        >
          <Plus size={20} /> Nouvelle Matière
        </button>
      </div>

      <div className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>Erreur de chargement.</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nom de la matière</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Classe associée</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Coefficient</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSubjects.map((sub: any) => (
              <tr key={sub.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--text)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
                        <BookOpen size={16} />
                     </div>
                     {sub.name}
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{sub.class?.name || 'N/A'}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}><span style={{ padding: '4px 8px', background: 'var(--surface)', borderRadius: '6px' }}>x {sub.coefficient}</span></td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleEditClick(sub)} className="btn-secondary" style={{ padding: '8px', marginRight: '12px' }}><Edit size={18} /></button>
                  <button onClick={() => { if(window.confirm('Supprimer cette matière ?')) deleteSubject(sub.id) }} className="btn-secondary" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {displayedSubjects.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune matière trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '500px', maxWidth: '95%', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{editingSubject ? 'Modifier la matière' : 'Nouvelle matière'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate}>
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Nom de la matière</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Mathématiques" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Classe associée</label>
                <select required value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                   <option value="">-- Sélectionner une classe --</option>
                   {classes && classes.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                   ))}
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Coefficient</label>
                <input required type="number" min="1" value={formData.coefficient} onChange={e => setFormData({...formData, coefficient: Number(e.target.value)})} placeholder="Ex: 2" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', background: '#38BDF8', border: 'none', color: '#000' }}>Valider</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
