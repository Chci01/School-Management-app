import { useState } from 'react';
import { useAcademic } from '../hooks/useAcademic';
import { useAuth } from '../hooks/useAuth';

const Academic = () => {
  const { currentSchoolId } = useAuth();
  const { academicYears, classes, isLoading } = useAcademic(currentSchoolId || undefined);
  const [activeTab, setActiveTab] = useState<'classes' | 'years'>('classes');
  
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);

  if (isLoading) {
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des données académiques...</div>
          </div>
      );
  }

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Scolarité & Structure</h2>
          <p>Gérez les années académiques et les classes de l'établissement.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsClassModalOpen(true)}>
             + Nouvelle Classe
        </button>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <button 
             onClick={() => setActiveTab('classes')}
             style={{ background: 'transparent', border: 'none', color: activeTab === 'classes' ? 'var(--primary)' : 'white', fontWeight: activeTab === 'classes' ? 'bold' : 'normal', borderBottom: activeTab === 'classes' ? '2px solid var(--primary)' : 'none', paddingBottom: '8px', cursor: 'pointer' }}
          >
              Classes
          </button>
          <button 
             onClick={() => setActiveTab('years')}
             style={{ background: 'transparent', border: 'none', color: activeTab === 'years' ? 'var(--primary)' : 'white', fontWeight: activeTab === 'years' ? 'bold' : 'normal', borderBottom: activeTab === 'years' ? '2px solid var(--primary)' : 'none', paddingBottom: '8px', cursor: 'pointer' }}
          >
              Années Académiques
          </button>
      </div>

      {/* Classes View */}
      {activeTab === 'classes' && (
          <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {classes.map((cls: any) => (
                  <div key={cls.id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                           <button style={{ background: 'transparent', border: 'none', color: 'gray', cursor: 'pointer' }}>⋮</button>
                      </div>
                      <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>{cls.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                           <span>Effectif Actuel</span>
                           <span style={{ color: 'white', fontWeight: 'bold' }}>{cls.currentEnrolled} / {cls.capacity}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                           <div style={{ width: `${(cls.currentEnrolled / cls.capacity) * 100}%`, height: '100%', background: 'var(--primary)' }}></div>
                      </div>
                      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                           <button className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '14px' }}>Voir Élèves</button>
                           <button className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '14px' }}>Emploi du temps</button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Years View */}
      {activeTab === 'years' && (
          <div className="table-container glass-panel" style={{ overflow: 'hidden' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                          <th style={{ padding: '16px' }}>Année Académique</th>
                          <th style={{ padding: '16px' }}>Statut</th>
                          <th style={{ padding: '16px' }}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {academicYears.map((year: any) => (
                          <tr key={year.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: '16px', fontWeight: 'bold', fontSize: '18px' }}>{year.year}</td>
                              <td style={{ padding: '16px' }}>
                                  {year.isActive ? (
                                      <span className="badge" style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '12px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>En cours</span>
                                  ) : (
                                      <span className="badge" style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Clôturée</span>
                                  )}
                              </td>
                              <td style={{ padding: '16px' }}>
                                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} disabled={year.isActive}>
                                      {year.isActive ? 'Clôturer l\'année' : 'Réactiver'}
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
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '400px', maxWidth: '90%', padding: '24px' }}>
                  <h3>Créer une Classe</h3>
                  
                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Nom de la classe</label>
                      <input type="text" placeholder="Ex: TLL, 10ème CG..." style={{ width: '100%' }} />
                  </div>

                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Capacité maximale</label>
                      <input type="number" placeholder="Ex: 50" style={{ width: '100%' }} defaultValue={50} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button className="btn-secondary" onClick={() => setIsClassModalOpen(false)}>Annuler</button>
                      <button className="btn-primary" onClick={() => setIsClassModalOpen(false)}>Enregistrer</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Academic;
