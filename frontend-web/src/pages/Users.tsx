import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import WebcamCapture from '../components/common/WebcamCapture';
import { Camera, Edit, Trash2, UserPlus, Save, X } from 'lucide-react';

const Users = () => {
  const { currentSchoolId } = useAuth();
  const [roleFilter, setRoleFilter] = useState('');
  const { users, isLoading, deleteUser, createUser, updateUser, isCreating } = useUsers(currentSchoolId!, roleFilter);
  const { classes } = useClasses(currentSchoolId!);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Photo capture state
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Form states
  const [selectedRole, setSelectedRole] = useState('ELEVE');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    matricule: '',
    password: '',
    address: '',
    gender: 'M',
    expertise: '',
    classId: '',
    parentId: '',
    parentName: '',
    parentPhone: '',
    dateOfBirth: '',
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      matricule: '',
      password: '',
      address: '',
      gender: 'M',
      expertise: '',
      classId: '',
      parentId: '',
      parentName: '',
      parentPhone: '',
      dateOfBirth: '',
    });
    setCapturedPhoto(null);
    setEditingUser(null);
  };

  // Open modal for editing
  const handleEdit = (user: any) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      matricule: user.matricule || '',
      password: '', // Don't show password
      address: user.address || '',
      gender: user.gender || 'M',
      expertise: user.expertise || '',
      classId: user.classId || '',
      parentId: user.parentId || '',
      parentName: user.parentName || '',
      parentPhone: user.parentPhone || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    });
    setCapturedPhoto(user.photo || null);
    setIsModalOpen(true);
  };

  const roles = ['ELEVE', 'ENSEIGNANT', 'PARENT', 'ADMIN_ECOLE', 'SUPER_ADMIN'];

  const handleWhatsApp = (phone: string, type: 'conduct' | 'grade' | 'medical') => {
    if (!phone) return alert("Numéro de téléphone manquant.");
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    let msg = "";
    if (type === 'conduct') msg = "Bonjour, nous vous contactons concernant la note de conduite de votre enfant.";
    else if (type === 'grade') msg = "Bonjour, les nouvelles notes sont disponibles pour votre enfant.";
    else if (type === 'medical') msg = "URGENCE: Votre enfant est à l'infirmerie. Merci de nous contacter.";
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isLoading) {
      return (
          <div className="page-container flex justify-center items-center h-full">
              <div className="spinner text-primary">Chargement des utilisateurs...</div>
          </div>
      );
  }

  const displayedUsers = Array.isArray(users) ? users : [];

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
          <p className="text-gray-400">Gérez les profils et les attributions de classes.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <UserPlus size={18} /> Nouvel Utilisateur
        </button>
      </header>

      {/* Filters */}
      <div className="toolbar glass-panel p-4 mb-6 flex gap-4 items-center">
          <input type="text" placeholder="Rechercher..." className="bg-surface border border-white/10 rounded-lg p-2 flex-1" />
          <select 
             value={roleFilter} 
             onChange={(e) => setRoleFilter(e.target.value)}
             className="bg-surface border border-white/10 rounded-lg p-2 text-white"
          >
              <option value="">Tous les Rôles</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
      </div>

      {/* Table */}
      <div className="table-container glass-panel overflow-hidden">
        <table className="data-table w-full border-collapse">
          <thead>
            <tr className="bg-white/5 text-left">
              <th className="p-4">Photo</th>
              <th className="p-4">Matricule</th>
              <th className="p-4">Nom Complet</th>
              <th className="p-4">Rôle</th>
              <th className="p-4">Classe / Expertise</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? displayedUsers.map((user: any) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                    <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center overflow-hidden">
                        {user.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : '👤'}
                    </div>
                </td>
                <td className="p-4 font-mono text-sm">{user.matricule}</td>
                <td className="p-4 font-bold">{user.firstName} {user.lastName}</td>
                <td className="p-4">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs uppercase">{user.role}</span>
                </td>
                <td className="p-4 text-sm text-gray-400">
                    {user.role === 'ELEVE' ? (classes.find((c:any) => c.id === user.classId)?.name || 'Non affecté') : (user.expertise || '-')}
                </td>
                <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded transition-colors" onClick={() => handleEdit(user)}>
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors" onClick={() => { if(window.confirm('Supprimer ?')) deleteUser(user.id); }}>
                        <Trash2 size={16} />
                      </button>
                      {user.role === 'ELEVE' && user.phone && (
                        <button onClick={() => handleWhatsApp(user.phone, 'conduct')} className="text-xs p-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors">
                          WhatsApp
                        </button>
                      )}
                    </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">Aucun utilisateur trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
          <div className="modal-overlay fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
              <div className="modal-content glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-xl font-bold">{editingUser ? 'Modifier Profil' : 'Inscription Nouvel Utilisateur'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-6">
                      <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-full bg-surface border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden relative group">
                              {capturedPhoto ? <img src={capturedPhoto} className="w-full h-full object-cover" /> : <Camera size={32} className="text-gray-500" />}
                              <button onClick={() => setIsCapturing(true)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Camera size={20} className="text-white" />
                              </button>
                          </div>
                          <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-400 mb-1">Rôle de l'utilisateur</label>
                              <select 
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
                              >
                                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="block text-xs text-gray-500 mb-1">Prénom</label><input type="text" className="w-full bg-surface border border-white/10 rounded-lg p-2" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} /></div>
                          <div><label className="block text-xs text-gray-500 mb-1">Nom</label><input type="text" className="w-full bg-surface border border-white/10 rounded-lg p-2" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} /></div>
                          <div><label className="block text-xs text-gray-500 mb-1">Téléphone</label><input type="text" className="w-full bg-surface border border-white/10 rounded-lg p-2" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                          <div><label className="block text-xs text-gray-500 mb-1">Email</label><input type="email" className="w-full bg-surface border border-white/10 rounded-lg p-2" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                          <div><label className="block text-xs text-gray-500 mb-1">Matricule</label><input type="text" className="w-full bg-surface border border-white/10 rounded-lg p-2 opacity-50" value={formData.matricule} readOnly /></div>
                          <div><label className="block text-xs text-gray-500 mb-1">Mot de Passe {editingUser && '(Laisser vide pour ne pas changer)'}</label><input type="password" placeholder="********" className="w-full bg-surface border border-white/10 rounded-lg p-2" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
                      </div>

                      {selectedRole === 'ELEVE' && (
                          <div className="space-y-4 border-t border-white/5 pt-4">
                              <h4 className="font-bold text-primary">Dossier Académique & Filiation</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div><label className="block text-xs text-gray-500 mb-1">Affecter à une classe</label>
                                    <select value={formData.classId} onChange={(e) => setFormData({...formData, classId: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg p-2">
                                        <option value="">Sélectionner une classe</option>
                                        {classes.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                  </div>
                                  <div><label className="block text-xs text-gray-500 mb-1">Date de Naissance</label><input type="date" className="w-full bg-surface border border-white/10 rounded-lg p-2" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} /></div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Parent (Rechercher un parent existant)</label>
                                    <select 
                                      value={formData.parentId || ''} 
                                      onChange={(e) => setFormData({...formData, parentId: e.target.value})} 
                                      className="w-full bg-surface border border-white/10 rounded-lg p-2"
                                    >
                                        <option value="">Lier à un parent enregistré</option>
                                        {users.filter((u:any) => u.role === 'PARENT').map((p:any) => (
                                          <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.matricule})</option>
                                        ))}
                                    </select>
                                  </div>
                                  <div><label className="block text-xs text-gray-500 mb-1">Nom du Parent (Libre)</label><input type="text" className="w-full bg-surface border border-white/10 rounded-lg p-2" value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} /></div>
                                  <div><label className="block text-xs text-gray-500 mb-1">Téléphone Parent</label><input type="text" className="w-full bg-surface border border-white/10 rounded-lg p-2" value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} /></div>
                              </div>
                          </div>
                      )}

                      {selectedRole === 'ENSEIGNANT' && (
                          <div className="space-y-4 border-t border-white/5 pt-4">
                              <h4 className="font-bold text-primary">Profil Enseignant</h4>
                              <div><label className="block text-xs text-gray-500 mb-1">Expertise / Matières (Ex: Mathématiques, Physique)</label>
                                  <textarea className="w-full bg-surface border border-white/10 rounded-lg p-2" rows={2} value={formData.expertise} onChange={(e) => setFormData({...formData, expertise: e.target.value})} />
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5">
                      <button className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5" onClick={() => setIsModalOpen(false)}>Annuler</button>
                      <button className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 flex items-center gap-2" disabled={isCreating} onClick={() => {
                          const payload = { ...formData, role: selectedRole, photo: capturedPhoto };
                          if (editingUser) {
                              updateUser({ id: editingUser.id, data: payload }, {
                                  onSuccess: () => { setIsModalOpen(false); resetForm(); },
                                  onError: () => alert("Erreur lors de la modification.")
                              });
                          } else {
                              createUser(payload, {
                                  onSuccess: () => { setIsModalOpen(false); resetForm(); },
                                  onError: () => alert("Erreur lors de la création.")
                              });
                          }
                      }}>
                          <Save size={18} /> {editingUser ? 'Enregistrer' : 'Créer'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {isCapturing && (
          <WebcamCapture 
            onCapture={(imgSrc) => { setCapturedPhoto(imgSrc); setIsCapturing(false); }} 
            onCancel={() => setIsCapturing(false)} 
          />
      )}
    </div>
  );
};

export default Users;
