import { useState } from 'react';
import { useBadges } from '../hooks/useBadges';
import { useAuth } from '../hooks/useAuth';

const Badges = () => {
  const { currentSchoolId } = useAuth();
  const { template, users, isLoading } = useBadges(currentSchoolId || undefined);
  
  const [activeTab, setActiveTab] = useState<'ELEVE' | 'STAFF'>('ELEVE');
  const [badgeToPrint, setBadgeToPrint] = useState<any>(null);

  if (isLoading) {
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement du générateur...</div>
          </div>
      );
  }

  // Filter users by role
  const staffRoles = ['ENSEIGNANT', 'ADMIN_ECOLE', 'SUPER_ADMIN'];
  const displayedUsers = Array.isArray(users) ? users.filter((u: any) => 
     activeTab === 'ELEVE' ? u.role === 'ELEVE' : staffRoles.includes(u.role)
  ) : [];

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Générateur de Badges</h2>
          <p>Éditez, personnalisez et imprimez les cartes d'identité de l'école.</p>
        </div>
        <button className="btn-secondary">⚙️ Personnaliser le Modèle</button>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <button 
             onClick={() => setActiveTab('ELEVE')}
             style={{ background: 'transparent', border: 'none', color: activeTab === 'ELEVE' ? 'var(--primary)' : 'white', fontWeight: activeTab === 'ELEVE' ? 'bold' : 'normal', borderBottom: activeTab === 'ELEVE' ? '2px solid var(--primary)' : 'none', paddingBottom: '8px', cursor: 'pointer' }}
          >
              Badges Élèves
          </button>
          <button 
             onClick={() => setActiveTab('STAFF')}
             style={{ background: 'transparent', border: 'none', color: activeTab === 'STAFF' ? 'var(--primary)' : 'white', fontWeight: activeTab === 'STAFF' ? 'bold' : 'normal', borderBottom: activeTab === 'STAFF' ? '2px solid var(--primary)' : 'none', paddingBottom: '8px', cursor: 'pointer' }}
          >
              Badges Personnel
          </button>
      </div>

      {/* Roster Grid */}
      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {displayedUsers.map((user: any) => (
              <div key={user.id} className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={user.photo || 'https://via.placeholder.com/80'} alt="Profil" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0' }}>{user.firstName} {user.lastName}</h4>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Matricule: {user.matricule}</div>
                      <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setBadgeToPrint(user)}>Générer Badge</button>
                  </div>
              </div>
          ))}

          {displayedUsers.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                  Aucun utilisateur trouvé dans cette catégorie.
              </div>
          )}
      </div>

      {/* Printable Badge Preview Modal */}
      {badgeToPrint && template && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, background: 'rgba(0,0,0,0.8)' }}>
              <div className="modal-content glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '90%' }}>
                  
                  {/* The BADGE Layout (ISO ID-1 size roughly scaled) */}
                  <div id="printable-badge" style={{ 
                      width: '210px', height: '330px', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', fontFamily: 'sans-serif', color: 'black',
                      display: 'flex', flexDirection: 'column'
                  }}>
                      {/* Badge Header (School Colors) */}
                      <div style={{ background: template.primaryColor, color: 'white', padding: '12px', textAlign: 'center', minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>{template.schoolName}</h4>
                          <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>2024 - 2025</div>
                      </div>

                      {/* Photo Area */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                          <img src={badgeToPrint.photo || 'https://via.placeholder.com/120'} alt="ID" style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover', border: `3px solid ${template.secondaryColor}`, marginBottom: '12px' }} />
                          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', color: template.primaryColor }}>{badgeToPrint.firstName} <br/> {badgeToPrint.lastName.toUpperCase()}</h3>
                          
                          <div style={{ background: template.secondaryColor, color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                              {activeTab === 'ELEVE' ? 'Élève' : badgeToPrint.role}
                          </div>
                      </div>

                      {/* Info Footer */}
                      <div style={{ padding: '12px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                              <span style={{ color: 'gray' }}>Matricule:</span>
                              <strong>{badgeToPrint.matricule}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                              <span style={{ color: 'gray' }}>Né(e) le:</span>
                              <strong>{badgeToPrint.dateOfBirth ? new Date(badgeToPrint.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A'}</strong>
                          </div>
                      </div>

                      {/* Bottom strip */}
                      <div style={{ height: '8px', background: template.primaryColor, width: '100%' }}></div>
                  </div>

                  <div className="no-print" style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn-secondary" onClick={() => setBadgeToPrint(null)}>Fermer</button>
                      <button className="btn-primary" onClick={() => window.print()} style={{ background: template.primaryColor, borderColor: template.primaryColor }}>
                          🖨️ Imprimer le Badge
                      </button>
                  </div>

              </div>
          </div>
      )}

    </div>
  );
};

export default Badges;
