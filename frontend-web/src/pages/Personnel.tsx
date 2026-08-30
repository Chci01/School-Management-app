import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { UserCog, Plus, Search, Trash2, Edit, X, UserPlus, Phone } from 'lucide-react';

const ROLES = [
  { value: 'SECRETAIRE', label: 'Secrétaire' },
  { value: 'STAGIAIRE', label: 'Stagiaire' },
  { value: 'MONITEUR', label: 'Moniteur / Monitrice' },
  { value: 'ENSEIGNANT', label: 'Enseignant' },
  { value: 'GARDIEN', label: 'Gardien' },
  { value: 'SURVEILLANT', label: 'Surveillant' },
];

const Personnel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const { currentSchoolId } = useAuth();
  // We fetch all users and filter out students and parents
  const { users, isLoading, error, deleteUser, createUser, updateUser } = useUsers(currentSchoolId!);

  const defaultForm = {
    firstName: '',
    lastName: '',
    matricule: '',
    email: '',
    phone: '',
    role: 'SECRETAIRE',
    password: 'password123',
  };
  const [formData, setFormData] = useState(defaultForm);

  const handleEditClick = (user: any) => {
    setEditingUserId(user.id);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      matricule: user.matricule || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'SECRETAIRE',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { ...formData, schoolId: currentSchoolId };
    if (!payload.password) delete (payload as any).password;

    if (editingUserId) {
      updateUser({ id: editingUserId, data: payload }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingUserId(null);
          setFormData(defaultForm);
        }
      });
    } else {
      createUser(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData(defaultForm);
        }
      });
    }
  };

  const getRoleLabel = (r: string) => ROLES.find(x => x.value === r)?.label || r;

  if (isLoading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement du personnel...</div>
      </div>
    );
  }

  // Hide ELEVE, PARENT, and SUPER_ADMIN from this list
  const personnelRoles = ROLES.map(r => r.value);
  const displayedUsers = (Array.isArray(users) ? users : [])
    .filter((u: any) => personnelRoles.includes(u.role) || u.role === 'ENSEIGNANT')
    .filter((u: any) => 
      (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.matricule || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px', color: '#f97316' }}>
              <UserCog size={28} />
            </div>
            Gestion du Personnel
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Gérez les secrétaires, gardiens, surveillants, enseignants, etc.</p>
        </div>
        <button 
          className="btn-primary" 
          style={{ background: '#f97316', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
          onClick={() => { setEditingUserId(null); setFormData(defaultForm); setIsModalOpen(true); }}
        >
          <Plus size={20} /> Nouveau Personnel
        </button>
      </div>

      <div className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '12px 20px', borderRadius: '12px', width: '400px', border: '1px solid var(--border)' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Rechercher (nom, matricule, ou rôle)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%', color: 'var(--text)', fontSize: '0.95rem' }} 
            />
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <X size={20} /> Erreur de chargement.
          </div>
        )}

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <th style={{ padding: '12px 20px' }}>Employé</th>
                <th style={{ padding: '12px 20px' }}>Matricule</th>
                <th style={{ padding: '12px 20px' }}>Rôle</th>
                <th style={{ padding: '12px 20px' }}>Contact</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user: any) => (
                <tr key={user.id} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <td style={{ padding: '12px 20px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '48px', height: '48px' }}>
                         <img src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=f97316&color=fff`} alt={user.firstName} style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }} />
                       </div>
                       <div>
                         <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user.firstName} {user.lastName}</div>
                       </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontFamily: 'monospace', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.85rem' }}>{user.matricule}</span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', fontWeight: 600 }}>
                       {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Phone size={14} color="#f97316" /> {user.phone || 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => handleEditClick(user)} className="btn-secondary" style={{ padding: '8px' }}><Edit size={16} /></button>
                      <button onClick={() => { if(window.confirm('Supprimer ce membre du personnel ?')) deleteUser(user.id) }} className="btn-secondary" style={{ padding: '8px', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
                    <UserCog size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                    <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Aucun personnel trouvé.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '600px', maxWidth: '95%', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px', color: '#f97316' }}>
                  {editingUserId ? <Edit size={24} /> : <UserPlus size={24} />}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{editingUserId ? 'Modifier Membre' : 'Nouveau Membre'}</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Prénom</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Nom</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Rôle / Fonction</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Matricule</label>
                  <input required type="text" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)' }} />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Téléphone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', background: '#f97316', border: 'none' }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personnel;
