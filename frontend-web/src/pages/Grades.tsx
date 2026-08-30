import { useState } from 'react';
import { useGrades } from '../hooks/useGrades';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { useSubjects } from '../hooks/useSubjects';
import { useUsers } from '../hooks/useUsers';
import { useAcademic } from '../hooks/useAcademic';
import { ClipboardList, Plus, Edit, Save, Trash2, X } from 'lucide-react';

const Grades = () => {
  const { currentSchoolId } = useAuth();
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('DEVOIR');
  const [selectedTerm, setSelectedTerm] = useState(1);

  const { classes } = useClasses(currentSchoolId!);
  const { subjects } = useSubjects(currentSchoolId!);
  const { users: students } = useUsers(currentSchoolId!, 'ELEVE');
  const { academicYears } = useAcademic(currentSchoolId!);
  
  const activeYear = academicYears.find((y:any) => y.isActive);

  const { grades, isLoading, saveBulkGrades, updateGrade, deleteGrade, isSaving } = useGrades(
    currentSchoolId!, 
    selectedClass || undefined, 
    selectedSubject || undefined
  );

  // Edit states
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // For bulk entry
  const [bulkGrades, setBulkGrades] = useState<{[key: string]: number}>({});

  const handleBulkSave = async () => {
    if (!selectedClass || !selectedSubject || !activeYear) {
      alert("Sélectionnez une classe, une matière et assurez-vous qu'une année est active.");
      return;
    }

    const gradesToSave = Object.entries(bulkGrades).map(([studentId, value]) => ({
      studentId,
      classId: selectedClass,
      subjectId: selectedSubject,
      academicYearId: activeYear.id,
      term: selectedTerm,
      type: selectedType,
      value: Number(value),
    }));

    if (gradesToSave.length === 0) return;

    try {
      await saveBulkGrades(gradesToSave);
      setIsBulkMode(false);
      setBulkGrades({});
    } catch (e) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleUpdate = () => {
    if (!editingGrade) return;
    updateGrade({ id: editingGrade.id, data: { value: editValue } }, {
      onSuccess: () => setEditingGrade(null)
    });
  };

  const openEdit = (grade: any) => {
    setEditingGrade(grade);
    setEditValue(grade.value);
  };

  if (isLoading && (!classes || !subjects)) {
    return (
      <div className="page-container flex justify-center items-center h-full">
        <div className="spinner text-primary">Chargement...</div>
      </div>
    );
  }

  const filteredStudents = (Array.isArray(students) ? students : []).filter((s: any) => 
    !selectedClass || s.classId === selectedClass
  );

  const displayedGrades = Array.isArray(grades) ? grades : [];

  return (
    <div className="page-container p-6">
      <header className="page-header flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><ClipboardList size={28} /></div>
            Gestion des Évaluations
          </h2>
          <p className="text-gray-400">Saisissez les notes et gérez les corrections.</p>
        </div>
        <div className="flex gap-3">
          {!isBulkMode ? (
            <button className="btn-primary flex items-center gap-2 bg-purple-600 border-none" onClick={() => setIsBulkMode(true)}>
              <Plus size={20} /> Saisie Multiple
            </button>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setIsBulkMode(false)}>Annuler</button>
              <button className="btn-primary bg-green-600 border-none flex items-center gap-2" onClick={handleBulkSave} disabled={isSaving}>
                <Save size={20} /> {isSaving ? 'Enregistrement...' : 'Valider'}
              </button>
            </>
          )}
        </div>
      </header>

      <div className="glass-panel p-6 rounded-3xl">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">CLASSE</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm text-white">
              <option value="">Toutes les classes</option>
              {Array.isArray(classes) && classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">MATIÈRE</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm text-white">
              <option value="">Toutes les matières</option>
              {Array.isArray(subjects) && subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">TRIMESTRE</label>
            <select value={selectedTerm} onChange={(e) => setSelectedTerm(Number(e.target.value))} className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm text-white">
              <option value={1}>Trimestre 1</option>
              <option value={2}>Trimestre 2</option>
              <option value={3}>Trimestre 3</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">TYPE</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm text-white">
              <option value="DEVOIR">Devoir</option>
              <option value="COMPOSITION">Composition</option>
            </select>
          </div>
        </div>

        {/* View/Bulk Content */}
        {!isBulkMode ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-500 text-xs uppercase border-b border-white/5">
                <tr>
                  <th className="p-4">Élève</th>
                  <th className="p-4">Matière</th>
                  <th className="p-4">Note</th>
                  <th className="p-4">Trimestre</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedGrades.map((g: any) => (
                  <tr key={g.id} className="hover:bg-white/5">
                    <td className="p-4 font-bold text-white">
                      {g.student ? `${g.student.firstName} ${g.student.lastName}` : 'ID: ' + g.studentId}
                    </td>
                    <td className="p-4 text-gray-400">{g.subject?.name || 'Matière'}</td>
                    <td className="p-4">
                      <span className={`text-lg font-black ${g.value >= 10 ? 'text-green-400' : 'text-red-400'}`}>{g.value}</span>
                    </td>
                    <td className="p-4 text-gray-500">{g.term}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(g)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit size={16}/></button>
                        <button onClick={() => { if(window.confirm('Supprimer cette note ?')) deleteGrade(g.id) }} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
             {filteredStudents.map((s: any) => (
               <div key={s.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold uppercase">{s.firstName[0]}{s.lastName[0]}</div>
                    <div>
                      <div className="font-bold text-white">{s.firstName} {s.lastName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{s.matricule}</div>
                    </div>
                  </div>
                  <input type="number" step="0.25" placeholder="Note" value={bulkGrades[s.id] || ''} onChange={e => setBulkGrades({...bulkGrades, [s.id]: Number(e.target.value)})} className="w-24 bg-surface border border-white/10 rounded-lg p-3 text-center font-black text-white focus:ring-2 focus:ring-primary outline-none" />
               </div>
             ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingGrade && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="modal-content glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Modifier la Note</h3>
              <button onClick={() => setEditingGrade(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="text-center p-6 bg-white/5 rounded-2xl">
                <p className="text-gray-400 text-sm mb-1">Élève</p>
                <p className="text-xl font-bold text-white">{editingGrade.student?.firstName} {editingGrade.student?.lastName}</p>
                <p className="text-primary text-xs mt-2">{editingGrade.subject?.name} - Trimestre {editingGrade.term}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nouvelle Valeur (/20)</label>
                <input type="number" step="0.25" min="0" max="20" value={editValue} onChange={e => setEditValue(Number(e.target.value))} className="w-full bg-surface border border-white/10 rounded-xl p-5 text-center text-3xl font-black text-white focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex gap-4 pt-4">
                <button className="flex-1 btn-secondary py-4 rounded-xl" onClick={() => setEditingGrade(null)}>Annuler</button>
                <button className="flex-1 btn-primary py-4 rounded-xl font-bold" onClick={handleUpdate}><Save size={20} className="inline mr-2"/> Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;
