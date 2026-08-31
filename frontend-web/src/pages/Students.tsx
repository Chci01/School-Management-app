import { useState, useRef } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { Users, Plus, Search, Trash2, Edit, X, UserPlus, Phone, Hash, Calendar, MapPin, Upload, Link } from 'lucide-react';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  
  const { currentSchoolId } = useAuth();
  const { users, isLoading, error, deleteUser, createUser, updateUser } = useUsers(currentSchoolId!, 'ELEVE');
  const { users: parents } = useUsers(currentSchoolId!, 'PARENT'); // Pour la liste deroulante
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const defaultForm = {
    firstName: '',
    lastName: '',
    matricule: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    placeOfBirth: '',
    parentId: '',
    photo: '',
    password: 'password123',
  };
  const [formData, setFormData] = useState(defaultForm);

  const handleEditClick = (student: any) => {
    setEditingStudentId(student.id);
    setFormData({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      matricule: student.matricule || '',
      email: student.email || '',
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      placeOfBirth: student.placeOfBirth || '',
      parentId: student.parentId || '',
      photo: student.photo || '',
      password: '', // Leave empty when editing to not change
    });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      role: 'ELEVE',
      schoolId: currentSchoolId,
    };
    if (!payload.password) delete (payload as any).password; // Don't send empty password

    if (editingStudentId) {
      updateUser({ id: editingStudentId, data: payload }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingStudentId(null);
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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          alert('La fonctionnalité d\'import automatique arrive bientôt. En attendant, veuillez rajouter les élèves manuellement.');
      }
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
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Consultez, ajoutez et liez les élèves à leurs parents.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setEditingStudentId(null); setFormData(defaultForm); setIsModalOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
        >
          <Plus size={20} /> Ajouter un élève
        </button>
      </div>

      <div className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
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
             <label className="btn-secondary" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                 Importer
                 <input type="file" accept=".csv" onChange={handleImport} style={{ display: 'none' }} />
             </label>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <X size={20} /> Erreur de chargement.
          </div>
        )}

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <th style={{ padding: '12px 20px' }}>Profil</th>
                <th style={{ padding: '12px 20px' }}>Matricule</th>
                <th style={{ padding: '12px 20px' }}>Nom Complet</th>
                <th style={{ padding: '12px 20px' }}>Parent li&eacute;</th>
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Né(e) le {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'} {user.placeOfBirth ? `à ${user.placeOfBirth}` : ''}</div>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    {user.parent ? (
                        <div style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{user.parent.firstName} {user.parent.lastName}</div>
                    ) : (
                        <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>Non rattaché</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => handleEditClick(user)} className="btn-secondary" style={{ padding: '8px' }}><Edit size={16} /></button>
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
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AJOUT / MODIF */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, overflowY: 'auto' }}>
          <div className="modal-content glass-panel" style={{ width: '700px', maxWidth: '95%', padding: '32px', borderRadius: '24px', border: '1px solid var(--glass-border)', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                  {editingStudentId ? <Edit size={24} /> : <UserPlus size={24} />}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{editingStudentId ? 'Modifier l\'élève' : 'Nouvel Élève'}</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate}>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                 <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', border: '2px dashed var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                    {formData.photo ? (
                        <img src={formData.photo} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Upload size={32} color="var(--primary)" />
                    )}
                 </div>
                 <input type="file" accept="image/png, image/jpeg, image/jpg" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Prénom</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Nom</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Date de naissance</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                  </div>
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Lieu de naissance</label>
                  <div style={{ position: 'relative' }}>
                     <MapPin size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                     <input type="text" value={formData.placeOfBirth} onChange={e => setFormData({...formData, placeOfBirth: e.target.value})} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                  </div>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Rattacher à un parent (Lien Parent-Élève)</label>
                <div style={{ position: 'relative' }}>
                  <Link size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select value={formData.parentId} onChange={e => setFormData({...formData, parentId: e.target.value})} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                     <option value="">-- Aucun parent sélectionné --</option>
                     {Array.isArray(parents) && parents.map((p: any) => (
                         <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.phone})</option>
                     ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Matricule {editingStudentId ? '' : '(Généré auto)'}</label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value.toUpperCase()})} disabled={!!editingStudentId} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', opacity: editingStudentId ? 0.6 : 1 }} placeholder="Laisser vide..." />
                  </div>
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Téléphone / Urgence</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', fontWeight: 700 }}>
                  {editingStudentId ? 'Mettre à jour' : 'Enregistrer l\'élève'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
