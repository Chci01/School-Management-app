import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import WebcamCapture from '../components/common/WebcamCapture';
import { Camera } from 'lucide-react';

const Users = () => {
  const [roleFilter, setRoleFilter] = useState('');
  const { users, isLoading, error, deleteUser, createUser, isCreating } = useUsers(undefined, roleFilter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Photo capture state
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Form states
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    matricule: '',
    password: '',
  });

  // Student specific
  const [studentProfile, setStudentProfile] = useState({
    birthDate: '',
    birthPlace: '',
    address: '',
    fatherName: '',
    fatherProfession: '',
    fatherPhone: '',
    motherName: '',
    motherProfession: '',
    motherPhone: '',
  });

  // Staff specific
  const [staffProfile, setStaffProfile] = useState({
    address: '',
    hireDate: '',
    position: '',
    emergencyContact: '',
  });

  // Derive roles for filter
  const roles = ['STUDENT', 'TEACHER', 'PARENT', 'SCHOOL_ADMIN', 'SUPER_ADMIN'];

  const handleWhatsApp = (phone: string, type: 'conduct' | 'grade' | 'medical') => {
    if (!phone) return alert("Numéro de téléphone manquant pour cet utilisateur.");
    // Remove all non-numeric characters (except leading + for country code)
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    let msg = "";
    if (type === 'conduct') msg = "Bonjour, nous vous contactons concernant la note de conduite récente de votre enfant. Merci de nous contacter ou de passer à l'administration dès que possible.";
    else if (type === 'grade') msg = "Bonjour, les nouvelles notes / bulletins sont disponibles pour votre enfant. Cordialement, la Direction.";
    else if (type === 'medical') msg = "URGENCE MÉDICALE: Bonjour, votre enfant est à l'infirmerie de l'école. Merci de nous contacter en urgence.";
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isLoading) {
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des utilisateurs...</div>
          </div>
      );
  }

  // Fallback for when backend endpoint might throw 404/500 if not fully implemented yet
  const displayedUsers = Array.isArray(users) ? users : [];

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Gestion des Utilisateurs</h2>
          <p>Gérez les élèves, professeurs, parents et administrateurs.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Nouvel Utilisateur</button>
      </header>

      {/* Toolbar / Filters */}
      <div className="toolbar glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="input-group" style={{ margin: 0, flex: 1 }}>
              <input type="text" placeholder="Rechercher par nom ou matricule..." style={{ width: '100%', maxWidth: '300px' }} />
          </div>
          <div className="input-group" style={{ margin: 0 }}>
              <select 
                 value={roleFilter} 
                 onChange={(e) => setRoleFilter(e.target.value)}
                 style={{ padding: '12px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}
              >
                  <option value="">Tous les Rôles</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
          </div>
      </div>

      {error && (
         <div className="alert-error" style={{ marginBottom: '20px', color: 'var(--danger)' }}>
             Impossible de charger les utilisateurs. L'API est peut-être introuvable.
         </div>
      )}

      {/* Datagrid */}
      <div className="table-container glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Photo</th>
              <th style={{ padding: '16px' }}>Matricule</th>
              <th style={{ padding: '16px' }}>Nom Complet</th>
              <th style={{ padding: '16px' }}>Rôle</th>
              <th style={{ padding: '16px' }}>Contact</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? displayedUsers.map((user: any) => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px' }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {user.photo ? <img src={user.photo} alt={user.firstName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
                    </div>
                </td>
                <td style={{ padding: '16px', fontFamily: 'monospace' }}>{user.matricule}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{user.firstName} {user.lastName}</td>
                <td style={{ padding: '16px' }}>
                    <span className={`badge role-${user.role.toLowerCase()}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: 'rgba(255,255,255,0.1)' }}>
                       {user.role}
                    </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                    <div>{user.phone || '-'}</div>
                    <div style={{ fontSize: '12px' }}>{user.email || '-'}</div>
                </td>
                <td style={{ padding: '16px' }}>
                    <div className="flex gap-2">
                      <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>Éditer</button>
                      <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => {
                          if(window.confirm('Supprimer cet utilisateur ?')) deleteUser(user.id);
                      }}>🗑️</button>
                      {user.role === 'STUDENT' && user.phone && (
                        <div className="relative group inline-block z-10">
                          <button className="btn-secondary !border-green-500/30 !text-green-400 hover:!bg-green-500/10" style={{ padding: '6px 10px', fontSize: '12px' }}>
                            💬 WhatsApp
                          </button>
                          <div className="absolute hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 right-0 top-full mt-1 p-1 rounded-lg w-40 shadow-xl">
                            <button onClick={() => handleWhatsApp(user.phone, 'conduct')} className="text-left text-xs p-2 hover:bg-slate-700 rounded transition-colors text-white">⚠️ Conduite</button>
                            <button onClick={() => handleWhatsApp(user.phone, 'grade')} className="text-left text-xs p-2 hover:bg-slate-700 rounded transition-colors text-white">📊 Notes</button>
                            <button onClick={() => handleWhatsApp(user.phone, 'medical')} className="text-left text-xs p-2 hover:bg-slate-700 rounded transition-colors text-red-300">🚨 Infirmerie</button>
                          </div>
                        </div>
                      )}
                    </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  Aucun utilisateur trouvé. 
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '800px', maxWidth: '95vw', padding: '0', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <h3>Inscription / Nouvel Utilisateur</h3>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Veuillez remplir le formulaire d'inscription détaillé.</p>
                  </div>
                  
                  <div style={{ padding: '24px', overflowY: 'auto' }}>
                      <div className="input-group">
                          <label>Rôle</label>
                          <select 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            style={{ width: '100%', padding: '10px', background: 'var(--surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}
                          >
                              {roles.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                      </div>

                      <h4 style={{ margin: '20px 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Informations Globales</h4>
                      
                      <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                          {capturedPhoto ? (
                              <img src={capturedPhoto} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                          ) : (
                              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Camera size={32} color="gray" />
                              </div>
                          )}
                          <button className="btn-secondary" onClick={() => setIsCapturing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Camera size={16} /> Webcam / Importer Photo
                          </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="input-group"><label>Prénom</label><input type="text" placeholder="Gérard" style={{ width: '100%' }} value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} /></div>
                          <div className="input-group"><label>Nom de Famille</label><input type="text" placeholder="Dupont" style={{ width: '100%' }} value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} /></div>
                          <div className="input-group"><label>Téléphone</label><input type="text" placeholder="+123456789" style={{ width: '100%' }} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                          <div className="input-group"><label>Email (Optionnel)</label><input type="email" placeholder="gerard@gmail.com" style={{ width: '100%' }} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                          <div className="input-group"><label>Matricule</label><input type="text" placeholder="Auto-généré ou manuel" style={{ width: '100%' }} value={formData.matricule} onChange={(e) => setFormData({...formData, matricule: e.target.value})} /></div>
                          <div className="input-group"><label>Mot de Passe</label><input type="password" style={{ width: '100%' }} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
                      </div>

                      {/* Dynamic form for Students */}
                      {selectedRole === 'STUDENT' && (
                          <div style={{ marginTop: '24px' }}>
                              <h4 style={{ margin: '20px 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Profil Élève & Filiation</h4>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                  <div className="input-group"><label>Date de Naissance</label><input type="date" style={{ width: '100%' }} value={studentProfile.birthDate} onChange={(e) => setStudentProfile({...studentProfile, birthDate: e.target.value})} /></div>
                                  <div className="input-group"><label>Lieu de Naissance</label><input type="text" style={{ width: '100%' }} value={studentProfile.birthPlace} onChange={(e) => setStudentProfile({...studentProfile, birthPlace: e.target.value})}/></div>
                                  <div className="input-group" style={{ gridColumn: 'span 2' }}><label>Adresse Domicile</label><input type="text" style={{ width: '100%' }} value={studentProfile.address} onChange={(e) => setStudentProfile({...studentProfile, address: e.target.value})} /></div>
                                  
                                  <div className="input-group"><label>Nom du Père</label><input type="text" style={{ width: '100%' }} value={studentProfile.fatherName} onChange={(e) => setStudentProfile({...studentProfile, fatherName: e.target.value})} /></div>
                                  <div className="input-group"><label>Téléphone Père</label><input type="text" style={{ width: '100%' }} value={studentProfile.fatherPhone} onChange={(e) => setStudentProfile({...studentProfile, fatherPhone: e.target.value})} /></div>
                                  <div className="input-group" style={{ gridColumn: 'span 2' }}><label>Profession Père</label><input type="text" style={{ width: '100%' }} value={studentProfile.fatherProfession} onChange={(e) => setStudentProfile({...studentProfile, fatherProfession: e.target.value})} /></div>
                                  
                                  <div className="input-group"><label>Nom de la Mère</label><input type="text" style={{ width: '100%' }} value={studentProfile.motherName} onChange={(e) => setStudentProfile({...studentProfile, motherName: e.target.value})} /></div>
                                  <div className="input-group"><label>Téléphone Mère</label><input type="text" style={{ width: '100%' }} value={studentProfile.motherPhone} onChange={(e) => setStudentProfile({...studentProfile, motherPhone: e.target.value})} /></div>
                                  <div className="input-group" style={{ gridColumn: 'span 2' }}><label>Profession Mère</label><input type="text" style={{ width: '100%' }} value={studentProfile.motherProfession} onChange={(e) => setStudentProfile({...studentProfile, motherProfession: e.target.value})} /></div>
                              </div>
                          </div>
                      )}

                      {/* Dynamic form for Staff */}
                      {(selectedRole === 'SCHOOL_ADMIN' || selectedRole === 'TEACHER') && (
                          <div style={{ marginTop: '24px' }}>
                              <h4 style={{ margin: '20px 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Dossier Personnel</h4>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                  <div className="input-group"><label>Date d'embauche</label><input type="date" style={{ width: '100%' }} value={staffProfile.hireDate} onChange={(e) => setStaffProfile({...staffProfile, hireDate: e.target.value})} /></div>
                                  <div className="input-group"><label>Poste / Titre</label><input type="text" placeholder="Ex: Proviseur adjoint" style={{ width: '100%' }} value={staffProfile.position} onChange={(e) => setStaffProfile({...staffProfile, position: e.target.value})} /></div>
                                  <div className="input-group"><label>Adresse</label><input type="text" placeholder="Domicile" style={{ width: '100%' }} value={staffProfile.address} onChange={(e) => setStaffProfile({...staffProfile, address: e.target.value})} /></div>
                                  <div className="input-group"><label>Contact d'Urgence</label><input type="text" placeholder="Nom et Numéro" style={{ width: '100%' }} value={staffProfile.emergencyContact} onChange={(e) => setStaffProfile({...staffProfile, emergencyContact: e.target.value})} /></div>
                              </div>
                          </div>
                      )}

                  </div>

                  <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button className="btn-secondary" onClick={() => { setIsModalOpen(false); setCapturedPhoto(null); }} disabled={isCreating}>Annuler</button>
                      <button className="btn-primary" disabled={isCreating} onClick={() => {
                          const payload = {
                              ...formData,
                              role: selectedRole,
                              photo: capturedPhoto,
                              studentProfile: selectedRole === 'STUDENT' ? studentProfile : undefined,
                              staffProfile: ['SCHOOL_ADMIN', 'TEACHER'].includes(selectedRole) ? staffProfile : undefined
                          };
                          
                          createUser(payload, {
                              onSuccess: () => {
                                  setIsModalOpen(false);
                                  setCapturedPhoto(null);
                                  // Reset form could go here
                                  alert("Utilisateur créé avec succès !");
                              },
                              onError: (err) => {
                                  console.error("Erreur lors de la création:", err);
                                  alert("Une erreur est survenue lors de l'inscription.");
                              }
                          });
                      }}>
                          {isCreating ? 'Création...' : "Valider l'Inscription"}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Webcam overlay */}
      {isCapturing && (
          <WebcamCapture 
            onCapture={(imgSrc) => {
                setCapturedPhoto(imgSrc);
                setIsCapturing(false);
            }} 
            onCancel={() => setIsCapturing(false)} 
          />
      )}

    </div>
  );
};

export default Users;
