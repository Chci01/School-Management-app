import { useState } from 'react';
import { useAcademic } from '../hooks/useAcademic';
import { useClasses } from '../hooks/useClasses';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trash2, Users as UsersIcon, Calendar, GraduationCap, LayoutGrid } from 'lucide-react';

const Academic = () => {
  const { currentSchoolId } = useAuth();
  const { academicYears, isLoading: academicLoading } = useAcademic(currentSchoolId || undefined);
  const { classes, isLoading: classesLoading, createClass, deleteClass } = useClasses(currentSchoolId || undefined);
  
  const [activeTab, setActiveTab] = useState<'classes' | 'years'>('classes');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCapacity, setNewClassCapacity] = useState(50);

  const isLoading = academicLoading || classesLoading;

  const handleCreateClass = () => {
    if (!newClassName) return;
    createClass({
      name: newClassName,
      capacity: newClassCapacity,
      schoolId: currentSchoolId,
      currentEnrolled: 0
    }, {
      onSuccess: () => {
        setIsClassModalOpen(false);
        setNewClassName('');
        setNewClassCapacity(50);
      }
    });
  };

  if (isLoading) {
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des données académiques...</div>
          </div>
      );
  }

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Scolarité & Structure</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez les années académiques et l'organisation des classes.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsClassModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Plus size={20} /> Nouvelle Classe
        </button>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', borderBottom: '1px solid var(--border)' }}>
          <button 
             onClick={() => setActiveTab('classes')}
             style={{ 
               background: 'transparent', 
               border: 'none', 
               color: activeTab === 'classes' ? 'var(--primary)' : 'var(--text-muted)', 
               fontWeight: 600, 
               fontSize: '1rem',
               borderBottom: activeTab === 'classes' ? '3px solid var(--primary)' : '3px solid transparent', 
               paddingBottom: '12px', 
               cursor: 'pointer',
               transition: 'all 0.2s'
             }}
          >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutGrid size={18} /> Classes
              </div>
          </button>
          <button 
             onClick={() => setActiveTab('years')}
             style={{ 
               background: 'transparent', 
               border: 'none', 
               color: activeTab === 'years' ? 'var(--primary)' : 'var(--text-muted)', 
               fontWeight: 600, 
               fontSize: '1rem',
               borderBottom: activeTab === 'years' ? '3px solid var(--primary)' : '3px solid transparent', 
               paddingBottom: '12px', 
               cursor: 'pointer',
               transition: 'all 0.2s'
             }}
          >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} /> Années Académiques
              </div>
          </button>
      </div>

      {/* Classes View */}
      {activeTab === 'classes' && (
          <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {classes.map((cls: any) => (
                  <div key={cls.id} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', position: 'relative', border: '1px solid var(--glass-border)', transition: 'transform 0.2s' }}>
                      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                           <button 
                             onClick={() => { if(window.confirm('Supprimer cette classe ?')) deleteClass(cls.id) }}
                             style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                           >
                             <Trash2 size={18} />
                           </button>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                          <GraduationCap size={24} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{cls.name}</h3>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                           <span style={{ color: 'var(--text-secondary)' }}>Taux d'occupation</span>
                           <span style={{ color: 'var(--text)', fontWeight: 700 }}>{cls.currentEnrolled || 0} / {cls.capacity}</span>
                      </div>
                      
                      <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px' }}>
                           <div style={{ 
                             width: `${Math.min(((cls.currentEnrolled || 0) / cls.capacity) * 100, 100)}%`, 
                             height: '100%', 
                             background: 'linear-gradient(90deg, var(--primary), #60a5fa)',
                             borderRadius: '10px'
                           }}></div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                           <button className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                             <UsersIcon size={16} /> Élèves
                           </button>
                           <button className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                             <Calendar size={16} /> Emploi
                           </button>
                      </div>
                  </div>
              ))}
              {classes.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Aucune classe configurée pour le moment.</p>
                  <button className="btn-primary" onClick={() => setIsClassModalOpen(true)} style={{ marginTop: '16px' }}>Créer votre première classe</button>
                </div>
              )}
          </div>
      )}

      {/* Years View */}
      {activeTab === 'years' && (
          <div className="table-container glass-panel" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                          <th style={{ padding: '20px' }}>Année Académique</th>
                          <th style={{ padding: '20px' }}>Statut</th>
                          <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {academicYears.map((year: any) => (
                          <tr key={year.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                              <td style={{ padding: '20px' }}>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{year.year}</div>
                              </td>
                              <td style={{ padding: '20px' }}>
                                  {year.isActive ? (
                                      <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.2)' }}>ANNÉE ACTIVE</span>
                                  ) : (
                                      <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>ARCHIVÉE</span>
                                  )}
                              </td>
                              <td style={{ padding: '20px', textAlign: 'right' }}>
                                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={year.isActive}>
                                      {year.isActive ? 'Gérer' : 'Consulter'}
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {/* Modal New Class */}
      {isClassModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '450px', maxWidth: '95%', padding: '32px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Nouvelle Classe</h3>
                    <button onClick={() => setIsClassModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                  </div>
                  
                  <div className="input-group" style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Nom de la classe</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 10ème CG, Terminale LL..." 
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} 
                      />
                  </div>

                  <div className="input-group" style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Capacité (Élèves)</label>
                      <input 
                        type="number" 
                        placeholder="Ex: 50" 
                        value={newClassCapacity}
                        onChange={(e) => setNewClassCapacity(parseInt(e.target.value))}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} 
                      />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn-secondary" onClick={() => setIsClassModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
                      <button className="btn-primary" onClick={handleCreateClass} disabled={!newClassName} style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 700 }}>Créer la classe</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Academic;

