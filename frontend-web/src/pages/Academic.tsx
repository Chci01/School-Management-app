import { useState } from 'react';
import { useAcademic } from '../hooks/useAcademic';
import { useClasses } from '../hooks/useClasses';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trash2, Calendar, GraduationCap, LayoutGrid, Edit, Save, X, CheckCircle } from 'lucide-react';

const Academic = () => {
  const { currentSchoolId } = useAuth();
  const { academicYears, isLoading: academicLoading, createAcademicYear, updateAcademicYear } = useAcademic(currentSchoolId || undefined);
  const { classes, isLoading: classesLoading, createClass, deleteClass, updateClass } = useClasses(currentSchoolId || undefined);
  
  const [activeTab, setActiveTab] = useState<'classes' | 'years'>('classes');
  
  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [classForm, setClassForm] = useState({ name: '', capacity: 50, academicYearId: '' });
  const [yearForm, setYearForm] = useState({ name: '', startDate: '', endDate: '', isActive: false });

  const isLoading = academicLoading || classesLoading;

  const handleSaveClass = () => {
    if (!classForm.name) return;
    if (editingItem) {
      updateClass({ id: editingItem.id, data: classForm }, {
        onSuccess: () => { setIsClassModalOpen(false); setEditingItem(null); }
      });
    } else {
      createClass({ ...classForm, schoolId: currentSchoolId }, {
        onSuccess: () => { setIsClassModalOpen(false); setClassForm({ name: '', capacity: 50, academicYearId: '' }); }
      });
    }
  };

  const handleSaveYear = () => {
    if (!yearForm.name) return;
    if (editingItem) {
      updateAcademicYear({ id: editingItem.id, data: yearForm }, {
        onSuccess: () => { setIsYearModalOpen(false); setEditingItem(null); }
      });
    } else {
      createAcademicYear({ ...yearForm, schoolId: currentSchoolId }, {
        onSuccess: () => { setIsYearModalOpen(false); setYearForm({ name: '', startDate: '', endDate: '', isActive: false }); }
      });
    }
  };

  const openClassEdit = (cls: any) => {
    setEditingItem(cls);
    setClassForm({ name: cls.name, capacity: cls.capacity, academicYearId: cls.academicYearId || '' });
    setIsClassModalOpen(true);
  };

  const openYearEdit = (year: any) => {
    setEditingItem(year);
    setYearForm({ 
      name: year.name, 
      startDate: year.startDate ? new Date(year.startDate).toISOString().split('T')[0] : '', 
      endDate: year.endDate ? new Date(year.endDate).toISOString().split('T')[0] : '', 
      isActive: year.isActive 
    });
    setIsYearModalOpen(true);
  };

  if (isLoading) {
      return (
          <div className="page-container flex justify-center items-center h-full">
              <div className="spinner text-primary">Chargement...</div>
          </div>
      );
  }

  return (
    <div className="page-container p-6">
      <header className="page-header flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Scolarité & Structure</h2>
          <p className="text-gray-400">Gérez les années académiques et l'organisation des classes.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2" onClick={() => { setEditingItem(null); setYearForm({ name: '', startDate: '', endDate: '', isActive: false }); setIsYearModalOpen(true); }}>
            <Calendar size={20} /> Nouvelle Année
          </button>
          <button className="btn-primary flex items-center gap-2" onClick={() => { setEditingItem(null); setClassForm({ name: '', capacity: 50, academicYearId: '' }); setIsClassModalOpen(true); }}>
            <Plus size={20} /> Nouvelle Classe
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-white/10">
          <button 
             onClick={() => setActiveTab('classes')}
             className={`pb-4 px-2 font-bold transition-all border-b-2 ${activeTab === 'classes' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-white'}`}
          >
              <div className="flex items-center gap-2"><LayoutGrid size={18} /> Classes</div>
          </button>
          <button 
             onClick={() => setActiveTab('years')}
             className={`pb-4 px-2 font-bold transition-all border-b-2 ${activeTab === 'years' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-white'}`}
          >
              <div className="flex items-center gap-2"><Calendar size={18} /> Années Académiques</div>
          </button>
      </div>

      {/* Classes View */}
      {activeTab === 'classes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls: any) => (
                  <div key={cls.id} className="glass-panel p-6 rounded-3xl relative group border border-white/5 hover:border-primary/30 transition-all">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openClassEdit(cls)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit size={16} /></button>
                           <button onClick={() => { if(window.confirm('Supprimer cette classe ?')) deleteClass(cls.id) }} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={16} /></button>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary"><GraduationCap size={28} /></div>
                        <h3 className="text-xl font-bold text-white">{cls.name}</h3>
                      </div>

                      <div className="flex justify-between mb-2 text-sm text-gray-400">
                           <span>Occupation</span>
                           <span className="font-bold text-white">{cls.currentEnrolled || 0} / {cls.capacity}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                           <div className="h-full bg-gradient-to-r from-primary to-blue-400" style={{ width: `${Math.min(((cls.currentEnrolled || 0) / cls.capacity) * 100, 100)}%` }}></div>
                      </div>

                      <div className="flex gap-2">
                           <button className="btn-secondary flex-1 text-xs py-2">Membres</button>
                           <button className="btn-secondary flex-1 text-xs py-2">Emploi</button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Years View */}
      {activeTab === 'years' && (
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
              <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                      <tr>
                          <th className="p-6">Dénomination</th>
                          <th className="p-6">Période</th>
                          <th className="p-6">Statut</th>
                          <th className="p-6 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {academicYears.map((year: any) => (
                          <tr key={year.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-6 font-bold text-white text-lg">{year.name}</td>
                              <td className="p-6 text-gray-400">
                                {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                              </td>
                              <td className="p-6">
                                  {year.isActive ? (
                                      <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-1 w-fit"><CheckCircle size={12}/> ACTIVE</span>
                                  ) : (
                                      <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-xs font-bold border border-white/10 w-fit block">ARCHIVÉE</span>
                                  )}
                              </td>
                              <td className="p-6 text-right">
                                  <button onClick={() => openYearEdit(year)} className="btn-secondary text-xs px-4 py-2">Modifier</button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {/* Modal Class */}
      {isClassModalOpen && (
          <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
              <div className="modal-content glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">{editingItem ? 'Modifier Classe' : 'Nouvelle Classe'}</h3>
                    <button onClick={() => setIsClassModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <div className="space-y-6">
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Nom de la classe</label>
                          <input type="text" placeholder="Ex: 10ème CG" value={classForm.name} onChange={(e) => setClassForm({...classForm, name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Capacité max.</label>
                          <input type="number" value={classForm.capacity} onChange={(e) => setClassForm({...classForm, capacity: parseInt(e.target.value)})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Année Scolaire</label>
                          <select value={classForm.academicYearId} onChange={(e) => setClassForm({...classForm, academicYearId: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none">
                              <option value="">Lier à une année scolaire</option>
                              {academicYears.map((y:any) => <option key={y.id} value={y.id}>{y.name}</option>)}
                          </select>
                      </div>
                      <div className="flex gap-4 pt-4">
                          <button className="flex-1 btn-secondary py-4 rounded-xl font-bold" onClick={() => setIsClassModalOpen(false)}>Annuler</button>
                          <button className="flex-1 btn-primary py-4 rounded-xl font-bold" onClick={handleSaveClass}><Save size={20} className="inline mr-2"/> Enregistrer</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Modal Year */}
      {isYearModalOpen && (
          <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
              <div className="modal-content glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">{editingItem ? 'Modifier Année' : 'Nouvelle Année Académique'}</h3>
                    <button onClick={() => setIsYearModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <div className="space-y-6">
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Libellé (Ex: 2025-2026)</label>
                          <input type="text" placeholder="2025-2026" value={yearForm.name} onChange={(e) => setYearForm({...yearForm, name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Début</label>
                            <input type="date" value={yearForm.startDate} onChange={(e) => setYearForm({...yearForm, startDate: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Fin</label>
                            <input type="date" value={yearForm.endDate} onChange={(e) => setYearForm({...yearForm, endDate: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <input type="checkbox" id="isActive" checked={yearForm.isActive} onChange={(e) => setYearForm({...yearForm, isActive: e.target.checked})} className="w-5 h-5 rounded border-white/10 bg-surface text-primary focus:ring-primary" />
                          <label htmlFor="isActive" className="text-sm font-medium text-white">Définir comme année active</label>
                      </div>
                      <div className="flex gap-4 pt-4">
                          <button className="flex-1 btn-secondary py-4 rounded-xl font-bold" onClick={() => setIsYearModalOpen(false)}>Annuler</button>
                          <button className="flex-1 btn-primary py-4 rounded-xl font-bold" onClick={handleSaveYear}><Save size={20} className="inline mr-2"/> Enregistrer</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Academic;
