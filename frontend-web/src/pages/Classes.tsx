import { useState } from 'react';
import { useClasses } from '../hooks/useClasses';
import { useAuth } from '../hooks/useAuth';
import { useAcademic } from '../hooks/useAcademic';
import { Layers, Plus, Trash2, Edit, X } from 'lucide-react';

const Classes = () => {
  const { currentSchoolId } = useAuth();
  const { classes, isLoading, error, deleteClass, createClass, updateClass } = useClasses(currentSchoolId!);
  const { activeYear } = useAcademic(currentSchoolId!);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', level: '1', capacity: 30 });

  if (isLoading) return <div className="dashboard-container"><div className="spinner">Chargement...</div></div>;

  const displayedClasses = Array.isArray(classes) ? classes : [];

  const handleEditClick = (cls: any) => {
    setEditingClass(cls);
    setFormData({ name: cls.name, level: cls.level.toString(), capacity: cls.capacity || 30 });
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // if (!activeYear) return alert('Aucune année scolaire active.');

    const payload: any = { 
      name: formData.name,
      level: formData.level.toString(),
      capacity: formData.capacity,
      schoolId: currentSchoolId,
    };
    if (activeYear?.id) {
      payload.academicYearId = activeYear.id;
    }

    if (editingClass) {
      updateClass({ id: editingClass.id, data: payload }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingClass(null);
        }
      });
    } else {
      createClass(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ name: '', level: '1', capacity: 30 });
        }
      });
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '10px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px', color: '#F97316' }}>
               <Layers size={28} />
            </div>
            Gestion des Classes
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Consultez, ajoutez ou modifiez les classes de l'établissement.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setEditingClass(null); setFormData({ name: '', level: '1', capacity: 30 }); setIsModalOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F97316', color: 'var(--text)', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}
        >
          <Plus size={20} /> Nouvelle Classe
        </button>
      </div>

      <div className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>Erreur de chargement.</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nom de la classe</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Niveau</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Capacité</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedClasses.map((cls: any) => (
              <tr key={cls.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--text)' }}>{cls.name}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Niveau {cls.level}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{cls.capacity || 0} Élèves</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleEditClick(cls)} className="btn-secondary" style={{ padding: '8px', marginRight: '12px' }}><Edit size={18} /></button>
                  <button onClick={() => { if(window.confirm('Supprimer cette classe ?')) deleteClass(cls.id) }} className="btn-secondary" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {displayedClasses.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune classe trouvée.</td>
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
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{editingClass ? 'Modifier la classe' : 'Nouvelle classe'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate}>
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Nom de la classe</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: 6ème A" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Niveau</label>
                <input required type="number" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} placeholder="Ex: 6" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>

              <div className="input-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Capacité (Places max)</label>
                <input required type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} placeholder="Ex: 30" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', background: '#F97316', border: 'none' }}>Valider</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
