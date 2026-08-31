import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { Users, Plus, Search, Trash2, Edit, X, Phone, Mail, Save } from 'lucide-react';

const Parents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<any>(null);
  
  const { currentSchoolId } = useAuth();
  const { users: parents, isLoading, deleteUser, createUser, updateUser } = useUsers(currentSchoolId!, 'PARENT');
  const { users: allUsers } = useUsers(currentSchoolId!); // To find children

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    matricule: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingParent) {
      updateUser({ id: editingParent.id, data: formData }, {
        onSuccess: () => { setIsModalOpen(false); setEditingParent(null); }
      });
    } else {
      createUser({ ...formData, role: 'PARENT', schoolId: currentSchoolId }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ firstName: '', lastName: '', matricule: '', email: '', phone: '', password: '' });
        }
      });
    }
  };

  const openEdit = (parent: any) => {
    setEditingParent(parent);
    setFormData({
      firstName: parent.firstName,
      lastName: parent.lastName,
      matricule: parent.matricule || '',
      email: parent.email || '',
      phone: parent.phone || '',
      password: '',
    });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="page-container flex justify-center items-center h-full">
        <div className="spinner text-primary">Chargement des parents...</div>
      </div>
    );
  }

  const displayedUsers = (Array.isArray(parents) ? parents : []).filter((u: any) => 
    (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.phone || '').includes(searchTerm)
  );

  return (
    <div className="page-container p-6">
      <header className="page-header flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><Users size={28} /></div>
            Gestion des Parents
          </h2>
          <p className="text-gray-400">Gérez les comptes parents et le suivi des familles.</p>
        </div>
        <button className="btn-primary bg-amber-600 border-none flex items-center gap-2" onClick={() => { setEditingParent(null); setIsModalOpen(true); }}>
          <Plus size={20} /> Ajouter un parent
        </button>
      </header>

      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex mb-6">
          <div className="flex items-center bg-surface border border-white/10 p-3 rounded-xl w-full max-w-md">
            <Search size={20} className="text-gray-500 mr-3" />
            <input type="text" placeholder="Rechercher par nom ou téléphone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-white w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-sm uppercase border-b border-white/5">
              <tr>
                <th className="p-4">Parent</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Enfants rattachés</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedUsers.map((user: any) => {
                const children = allUsers.filter((u:any) => u.parentId === user.id);
                return (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=f59e0b&color=fff`} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-white">{user.firstName} {user.lastName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{user.matricule}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300"><Phone size={14} className="text-amber-500"/> {user.phone}</div>
                      {user.email && <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><Mail size={14}/> {user.email}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {children.length > 0 ? children.map((c:any) => (
                          <span key={c.id} className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded text-[10px] font-bold">
                            {c.firstName} {c.lastName}
                          </span>
                        )) : (
                          <span className="text-gray-600 text-[10px] italic">Aucun enfant lié</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(user)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit size={16} /></button>
                        <button onClick={() => { if(window.confirm('Supprimer ce compte parent ?')) deleteUser(user.id) }} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARENT */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="modal-content glass-panel w-full max-w-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">{editingParent ? 'Modifier Parent' : 'Nouveau Parent'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1">Prénom</label><input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Nom</label><input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1">Matricule {editingParent ? '' : '(Auto)'}</label><input type="text" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value.toUpperCase()})} disabled={!!editingParent} className={`w-full bg-surface border border-white/10 rounded-xl p-3 text-white ${editingParent ? 'opacity-50' : ''}`} placeholder="Généré auto" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Téléphone</label><input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
              {!editingParent && (
                <div><label className="block text-xs text-gray-500 mb-1">Mot de Passe par défaut</label><input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="kalan123" className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" className="flex-1 btn-secondary py-4 rounded-xl" onClick={() => setIsModalOpen(false)}>Annuler</button>
                <button type="submit" className="flex-1 btn-primary bg-amber-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={20}/> {editingParent ? 'Enregistrer' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parents;
