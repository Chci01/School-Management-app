import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { useSubjects } from '../hooks/useSubjects';
import { useTeacherAssignments } from '../hooks/useTeacherAssignments';
import { Users, Plus, Search, Trash2, Edit, X, Save } from 'lucide-react';

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [targetTeacher, setTargetTeacher] = useState<any>(null);

  const { currentSchoolId } = useAuth();
  const { users, isLoading, deleteUser, createUser, updateUser } = useUsers(currentSchoolId!, 'ENSEIGNANT');
  const { classes } = useClasses(currentSchoolId!);
  const { subjects } = useSubjects(currentSchoolId!);
  const { assignments, assignTeacher, removeAssignment } = useTeacherAssignments(currentSchoolId!);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    matricule: '',
    email: '',
    phone: '',
    expertise: '',
    password: '',
  });

  const [assignForm, setAssignForm] = useState({ classId: '', subjectId: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateUser({ id: editingTeacher.id, data: formData }, {
        onSuccess: () => { setIsModalOpen(false); setEditingTeacher(null); }
      });
    } else {
      createUser({ ...formData, role: 'ENSEIGNANT', schoolId: currentSchoolId }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ firstName: '', lastName: '', matricule: '', email: '', phone: '', expertise: '', password: '' });
        }
      });
    }
  };

  const handleAssign = () => {
    if (!assignForm.classId || !assignForm.subjectId || !targetTeacher) return;
    assignTeacher({
      teacherId: targetTeacher.id,
      classId: assignForm.classId,
      subjectId: assignForm.subjectId
    }, {
      onSuccess: () => setIsAssignModalOpen(false)
    });
  };

  const openEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      matricule: teacher.matricule,
      email: teacher.email || '',
      phone: teacher.phone || '',
      expertise: teacher.expertise || '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const openAssign = (teacher: any) => {
    setTargetTeacher(teacher);
    setAssignForm({ classId: '', subjectId: '' });
    setIsAssignModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="page-container flex justify-center items-center h-full">
        <div className="spinner text-primary">Chargement des enseignants...</div>
      </div>
    );
  }

  const displayedUsers = (Array.isArray(users) ? users : []).filter((u: any) => 
    (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.matricule || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container p-6">
      <header className="page-header flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users size={28} /></div>
            Corps Professoral
          </h2>
          <p className="text-gray-400">Gérez les enseignants et leurs attributions pédagogiques.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setEditingTeacher(null); setIsModalOpen(true); }}>
          <Plus size={20} /> Ajouter un enseignant
        </button>
      </header>

      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex mb-6">
          <div className="flex items-center bg-surface border border-white/10 p-3 rounded-xl w-full max-w-md">
            <Search size={20} className="text-gray-500 mr-3" />
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-white w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-sm uppercase border-b border-white/5">
              <tr>
                <th className="p-4">Profil</th>
                <th className="p-4">Matricule</th>
                <th className="p-4">Nom Complet</th>
                <th className="p-4">Attributions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <img src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff`} className="w-12 h-12 rounded-xl object-cover" />
                  </td>
                  <td className="p-4 font-mono text-sm text-gray-400">{user.matricule}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-primary">{user.expertise || 'Expertise non définie'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {assignments.filter((a:any) => a.teacherId === user.id).map((a:any) => (
                        <span key={a.id} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] flex items-center gap-1 group">
                          {a.subject?.name} ({a.class?.name})
                          <X size={10} className="cursor-pointer text-red-400 opacity-0 group-hover:opacity-100" onClick={() => removeAssignment(a.id)} />
                        </span>
                      ))}
                      <button onClick={() => openAssign(user)} className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] hover:bg-primary/20">+ Attribuer</button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(user)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit size={16} /></button>
                      <button onClick={() => { if(window.confirm('Supprimer ?')) deleteUser(user.id) }} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TEACHER */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="modal-content glass-panel w-full max-w-xl p-8 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">{editingTeacher ? 'Modifier Enseignant' : 'Nouvel Enseignant'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1">Prénom</label><input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Nom</label><input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1">Matricule</label><input required type="text" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value.toUpperCase()})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Téléphone</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Expertise (Ex: Maths, Physique)</label><textarea value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" rows={2} /></div>
              {!editingTeacher && (
                <div><label className="block text-xs text-gray-500 mb-1">Mot de Passe par défaut</label><input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="kalan123" className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white" /></div>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" className="flex-1 btn-secondary py-4 rounded-xl" onClick={() => setIsModalOpen(false)}>Annuler</button>
                <button type="submit" className="flex-1 btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={20}/> {editingTeacher ? 'Enregistrer' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ASSIGNMENT */}
      {isAssignModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="modal-content glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold">Attribution Pédagogique</h3>
                <p className="text-primary text-sm font-bold">{targetTeacher?.firstName} {targetTeacher?.lastName}</p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Choisir la Matière</label>
                <select value={assignForm.subjectId} onChange={e => setAssignForm({...assignForm, subjectId: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white">
                  <option value="">Sélectionner une matière</option>
                  {subjects.map((s:any) => <option key={s.id} value={s.id}>{s.name} (coeff {s.coefficient})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Choisir la Classe</label>
                <select value={assignForm.classId} onChange={e => setAssignForm({...assignForm, classId: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white">
                  <option value="">Sélectionner une classe</option>
                  {classes.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button className="flex-1 btn-secondary py-4 rounded-xl" onClick={() => setIsAssignModalOpen(false)}>Annuler</button>
                <button className="flex-1 btn-primary py-4 rounded-xl font-bold" onClick={handleAssign} disabled={!assignForm.classId || !assignForm.subjectId}>Confirmer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
