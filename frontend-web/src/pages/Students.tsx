
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { Users, Plus, Search, Trash2, Edit, X, UserPlus, Phone, Mail, Hash } from 'lucide-react';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentSchoolId } = useAuth();
  const { users, isLoading, error, deleteUser, createUser } = useUsers(currentSchoolId!, 'ELEVE');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    matricule: '',
    email: '',
    phone: '',
    password: 'password123', // Default password
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({
      ...formData,
      role: 'ELEVE',
      schoolId: currentSchoolId,
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ firstName: '', lastName: '', matricule: '', email: '', phone: '', password: 'password123' });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des élèves...</div>
      </div>
    );
  }

  const displayedUsers = (Array.isArray(users) ? users : []).filter((u: any) => 
    (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.matricule || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Users size={28} />
            </div>
            Gestion des Élèves
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Consultez et gérez les profils des élèves de votre établissement.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
        >
          <Plus size={20} /> Ajouter un élève
        </button>
      </div>

      <div className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '12px 20px', borderRadius: '12px', width: '400px', border: '1px solid var(--border)' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou matricule..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%', color: 'var(--text)', fontSize: '0.95rem' }} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
             <button className="btn-secondary" style={{ padding: '10px 20px' }}>Exporter CSV</button>
             <button className="btn-secondary" style={{ padding: '10px 20px' }}>Importer</button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <X size={20} /> Erreur de chargement. Veuillez vérifier votre connexion ou votre licence.
          </div>
        )}

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <th style={{ padding: '12px 20px' }}>Profil</th>
                <th style={{ padding: '12px 20px' }}>Matricule</th>
                <th style={{ padding: '12px 20px' }}>Nom Complet</th>
                <th style={{ padding: '12px 20px' }}>Contact</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user: any) => (
                <tr key={user.id} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <td style={{ padding: '12px 20px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                    <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                      <img src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff`} alt={user.firstName} style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover', border: '2px solid var(--border)' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontFamily: 'monospace', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.85rem' }}>{user.matricule}</span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user.firstName} {user.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Inscrit le {new Date(user.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Phone size={14} color="var(--primary)" /> {user.phone || 'Non renseigné'}
                    </div>
                    {user.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <Mail size={14} /> {user.email}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="btn-secondary" style={{ padding: '8px' }}><Edit size={16} /></button>
                      <button onClick={() => { if(window.confirm('Supprimer cet élève ?')) deleteUser(user.id) }} className="btn-secondary" style={{ padding: '8px', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
                    <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                    <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Aucun élève trouvé.</div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: '16px' }}>Ajouter un élève</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '600px', maxWidth: '95%', padding: '32px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <UserPlus size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Nouvel Élève</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Prénom</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Nom</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Matricule</label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input required type="text" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                  </div>
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Téléphone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                  </div>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Email (Optionnel)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', fontWeight: 700 }}>Enregistrer l'élève</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;

