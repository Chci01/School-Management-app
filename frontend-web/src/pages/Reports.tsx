import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReports } from '../hooks/useReports';
import { useUsers } from '../hooks/useUsers';
import { useAcademic } from '../hooks/useAcademic';
import { useSubjects } from '../hooks/useSubjects';
import { useGrades } from '../hooks/useGrades';
import { Plus, Trash2, Save, X, Edit3 } from 'lucide-react';

const Reports = () => {
  const { currentSchoolId, user } = useAuth();
  const isAdminOrTeacher = user?.role === 'SCHOOL_ADMIN' || user?.role === 'TEACHER';
  
  // Selectors State
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Manual Entry State
  const [manualGrades, setManualGrades] = useState<any[]>([]);

  // Fetch Reference Data
  const { users: students, isLoading: l1 } = useUsers(currentSchoolId!, 'STUDENT');
  const { academicYears, isLoading: l2 } = useAcademic(currentSchoolId!);
  const { subjects, createSubject } = useSubjects();
  const { saveBulkGrades, isLoading: isSaving } = useGrades();

  // Fetch Report Data
  const { reportData, isLoading: isGenerating, error, refetch, publishTerm, isPublishing } = useReports(
      selectedStudent, selectedTerm, selectedYear
  );

  const printRef = useRef<HTMLDivElement>(null);

  // Initialize manual grades from report data if it exists
  useEffect(() => {
    if (reportData && isEditMode) {
      setManualGrades(reportData.subjects.map((s: any) => ({
        subjectId: subjects.find(sub => sub.name === s.subjectName)?.id || '',
        subjectName: s.subjectName,
        coefficient: s.coefficient,
        value: s.average
      })));
    }
  }, [reportData, isEditMode, subjects]);

  const handleGenerate = () => {
    if(!selectedStudent || !selectedYear) return;
    setIsEditMode(false);
    refetch();
    setShowPreview(true);
  };

  const addManualRow = () => {
    setManualGrades([...manualGrades, { subjectId: '', subjectName: '', coefficient: 1, value: 10 }]);
  };

  const removeManualRow = (index: number) => {
    setManualGrades(manualGrades.filter((_, i) => i !== index));
  };

  const updateManualRow = (index: number, field: string, val: any) => {
    const newGrades = [...manualGrades];
    newGrades[index][field] = val;
    
    // If selecting an existing subject, auto-fill coefficient
    if (field === 'subjectId' && val) {
      const sub = subjects.find(s => s.id === val);
      if (sub) {
        newGrades[index].subjectName = sub.name;
        newGrades[index].coefficient = sub.coefficient;
      }
    }
    setManualGrades(newGrades);
  };

  const handleSaveManual = async () => {
    if (!selectedStudent || !selectedYear) return;
    
    try {
      const gradesToSave = [];
      
      for (const row of manualGrades) {
        let sid = row.subjectId;
        
        // Flexibilité Totale: Create subject if it doesn't exist
        if (!sid && row.subjectName) {
          const existingSub = subjects.find((s: any) => s.name.toLowerCase() === row.subjectName.toLowerCase());
          if (existingSub) {
            sid = existingSub.id;
          } else {
            const newSub = await createSubject(row.subjectName, row.coefficient);
            sid = newSub.id;
          }
        }
        
        if (sid) {
          gradesToSave.push({
            studentId: selectedStudent,
            subjectId: sid,
            classId: reportData?.class?.id || students.find((s: any) => s.id === selectedStudent)?.classId || '',
            academicYearId: selectedYear,
            term: selectedTerm,
            value: Number(row.value)
          });
        }
      }
      
      await saveBulkGrades(gradesToSave);
      alert("Grades enregistrés avec succès !");
      setIsEditMode(false);
      refetch();
    } catch (e: any) {
      alert("Erreur lors de l'enregistrement: " + e.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePublishToggle = async (isPublished: boolean) => {
    if (!selectedYear) return;
    try {
      await publishTerm({
        academicYearId: selectedYear,
        term: selectedTerm,
        isPublished
      });
      alert(`Trimestre ${selectedTerm} ${isPublished ? 'publié' : 'verrouillé'} avec succès.`);
      if(selectedStudent) refetch();
    } catch(e: any) {
      alert("Erreur lors de la modification de la publication: " + e.message);
    }
  };

  if (l1 || l2) return <div className="p-8 text-neutral-400">Chargement des données...</div>;

  return (
    <div className="p-4 md:p-8 pb-32">
      <div className="mb-8 p-6 glass-panel rounded-2xl flex flex-col gap-6 print:hidden">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Bulletins de Notes</h1>
            <p className="text-neutral-400 text-sm md:text-base text-balance">Générateur flexible de relevés de notes.</p>
          </div>
          {isAdminOrTeacher && (
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isEditMode ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}
            >
              {isEditMode ? <><X size={18} /> Annuler Saisie</> : <><Edit3 size={18} /> Saisir les Notes</>}
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 items-end">
           {/* Filters */}
           <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
              <label className="text-xs text-neutral-400 ml-1">Année Académique</label>
              <select className="glass-input w-full" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                <option value="">Sélectionner</option>
                {academicYears?.map((y: any) => (
                  <option key={y.id} value={y.id}>{y.name}</option>
                ))}
              </select>
           </div>
           
           <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
              <label className="text-xs text-neutral-400 ml-1">Trimestre</label>
              <select className="glass-input w-full" value={selectedTerm} onChange={e => setSelectedTerm(Number(e.target.value))}>
                <option value={1}>1er Trimestre</option>
                <option value={2}>2ème Trimestre</option>
                <option value={3}>3ème Trimestre</option>
              </select>
           </div>

           <div className="flex flex-col gap-1 flex-[2] min-w-[200px]">
              <label className="text-xs text-neutral-400 ml-1">Élève</label>
              <select className="glass-input w-full" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                <option value="">Sélectionner un élève</option>
                {students?.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.matricule} - {s.firstName} {s.lastName}</option>
                ))}
              </select>
           </div>

           <div className="flex gap-2 w-full md:w-auto">
             {!isEditMode && (
               <button 
                 className="btn-primary flex-1 md:flex-none h-12" 
                 disabled={!selectedStudent || !selectedYear || isGenerating}
                 onClick={handleGenerate}
               >
                 {isGenerating ? 'Calcul...' : 'Aperçu Bulletin'}
               </button>
             )}
             
             {user?.role === 'SCHOOL_ADMIN' && !isEditMode && (
               <div className="flex gap-2">
                  <button 
                    onClick={() => handlePublishToggle(true)}
                    disabled={!selectedYear || isPublishing}
                    className="h-12 px-3 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded-lg border border-green-500/30 text-xs font-bold"
                    title="Publier pour les parents"
                  >
                    🔓 Publier
                  </button>
                  <button 
                    onClick={() => handlePublishToggle(false)}
                    disabled={!selectedYear || isPublishing}
                    className="h-12 px-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg border border-red-500/30 text-xs font-bold"
                    title="Verrouiller"
                  >
                    🔒 Verrouiller
                  </button>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Manual Entry Form */}
      {isEditMode && selectedStudent && (
        <div className="max-w-4xl mx-auto glass-panel p-6 rounded-2xl mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <Edit3 size={20} className="text-blue-400" /> Saisie des Notes au Trimestre {selectedTerm}
            </h2>
            <button onClick={addManualRow} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 text-sm hover:bg-blue-500/30 transition-all">
               <Plus size={16} /> Ajouter une Matière
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-neutral-400 text-left border-b border-white/10">
                  <th className="pb-3 px-2">Matière</th>
                  <th className="pb-3 px-2 w-24">Coef</th>
                  <th className="pb-3 px-2 w-24">Note /20</th>
                  <th className="pb-3 px-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {manualGrades.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 group">
                    <td className="py-3 px-2">
                       <div className="flex flex-col gap-1">
                          <select 
                            className="glass-input w-full p-2 h-10" 
                            value={row.subjectId} 
                            onChange={e => updateManualRow(idx, 'subjectId', e.target.value)}
                          >
                             <option value="">-- Autre / Nouveau --</option>
                             {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          {!row.subjectId && (
                            <input 
                              type="text" 
                              placeholder="Nom de la matière..." 
                              className="glass-input w-full p-2 h-10 text-xs mt-1 border-dashed"
                              value={row.subjectName}
                              onChange={e => updateManualRow(idx, 'subjectName', e.target.value)}
                            />
                          )}
                       </div>
                    </td>
                    <td className="py-3 px-2">
                       <input 
                         type="number" 
                         className="glass-input w-full p-2 h-10 text-center" 
                         value={row.coefficient}
                         onChange={e => updateManualRow(idx, 'coefficient', Number(e.target.value))}
                       />
                    </td>
                    <td className="py-3 px-2">
                       <input 
                         type="number" 
                         step="0.25"
                         max="20"
                         min="0"
                         className="glass-input w-full p-2 h-10 font-bold text-center text-blue-400" 
                         value={row.value}
                         onChange={e => updateManualRow(idx, 'value', Number(e.target.value))}
                       />
                    </td>
                    <td className="py-3 px-2">
                       <button onClick={() => removeManualRow(idx)} className="text-neutral-500 hover:text-red-400 transition-colors">
                          <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {manualGrades.length === 0 && (
            <div className="text-center py-8 text-neutral-500 italic">
               Aucune matière ajoutée. Cliquez sur le bouton "+" ci-dessus.
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
             <button onClick={() => setIsEditMode(false)} className="btn-secondary">Annuler</button>
             <button 
              onClick={handleSaveManual} 
              disabled={isSaving || manualGrades.length === 0}
              className="btn-primary flex items-center gap-2"
             >
                {isSaving ? 'Enregistrement...' : <><Save size={18} /> Enregistrer le Bulletin</>}
             </button>
          </div>
        </div>
      )}

      {/* Report Card Preview rendering */}
      {showPreview && reportData && !isEditMode && (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-[var(--surface)] p-4 rounded-xl border border-[var(--glass-border)] print:hidden gap-4">
             <div className="text-sm text-neutral-400">Aperçu avant Impression (A4 Portrait/Landscape split)</div>
             <button onClick={handlePrint} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                🖨️ Imprimer
             </button>
          </div>

          {/* Printable Area */}
          <div className="overflow-x-auto print:overflow-visible">
            <div className="mx-auto print:m-0 print:w-full min-w-[600px] print:min-w-0" style={{ width: 'fit-content' }}>
              <div 
                ref={printRef}
                className="bg-neutral-100 p-8 print:p-0 flex gap-8 landscape-print-container"
              >
                 {[1, 2].map((i) => (
                  <div 
                    key={i}
                    className="bg-white text-black p-6 md:p-8 shadow-2xl relative flex flex-col border-r last:border-r-0 border-dashed border-gray-300 print:border-gray-300"
                    style={{ 
                        width: '520px',
                        minHeight: '750px',
                        fontSize: '11px'
                    }}
                  >
                      {/* Identification Label */}
                      <div className="absolute top-2 right-4 text-[8px] font-bold text-gray-400 uppercase">
                          {i === 1 ? "COPIE ÉCOLE" : "COPIE PARENTS"}
                      </div>
  
                      {/* Header */}
                      <div className="flex justify-between border-b border-black pb-2 mb-4">
                          <div className="flex-1">
                              <h2 className="text-[9px] font-bold">RÉPUBLIQUE DU MALI</h2>
                              <p className="text-[7px]">Un Peuple - Un But - Une Foi</p>
                              <p className="text-[8px] mt-2 font-bold uppercase">M.E.N</p>
                          </div>
                          <div className="flex-1 text-center">
                              <div className="w-10 h-10 rounded-full border border-black mx-auto flex items-center justify-center font-bold text-[8px] bg-gray-50">KSM</div>
                              <p className="text-[9px] font-black mt-1 uppercase">KalanSira</p>
                          </div>
                          <div className="flex-1 text-right">
                              <h2 className="text-[9px] font-bold uppercase">A.E BAMAKO</h2>
                              <p className="text-[8px]">Année: {reportData.academicYear.name}</p>
                          </div>
                      </div>
  
                      <div className="text-center mb-4">
                          <h1 className="text-lg font-black uppercase tracking-widest border-2 border-black inline-block px-3 py-0.5">
                              Bulletin de Notes
                          </h1>
                          <p className="mt-1 text-xs font-bold">Trimestre {reportData.term}</p>
                      </div>
  
                      {/* Student Info Box */}
                      <div className="border border-black p-2 mb-4 flex gap-4 bg-gray-50/50">
                          <div className="w-14 h-14 border border-black flex items-center justify-center text-[7px] bg-gray-200 overflow-hidden font-bold">
                              {reportData.student.photo ? (
                                  <img src={reportData.student.photo} alt="Student" className="w-full h-full object-cover" />
                              ) : "PHOTO"}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 flex-grow text-[9px]">
                              <div><span className="font-bold text-gray-500">Nom:</span> <span className="font-bold">{reportData.student.lastName}</span></div>
                              <div><span className="font-bold text-gray-500">Prénom:</span> <span className="font-bold">{reportData.student.firstName}</span></div>
                              <div><span className="font-bold text-gray-500">Matr:</span> <span className="font-mono">{reportData.student.matricule}</span></div>
                              <div><span className="font-bold text-gray-500">Classe:</span> {reportData.class.name}</div>
                          </div>
                      </div>
  
                      {/* Grades Table */}
                      <table className="w-full text-[9px] border-collapse border border-black mb-4 flex-grow">
                          <thead>
                              <tr className="bg-gray-200 font-bold border-b border-black">
                                  <th className="border-r border-black p-1 text-left">Matières</th>
                                  <th className="border-r border-black p-1 text-center w-10">Coef</th>
                                  <th className="border-r border-black p-1 text-center w-12">Note</th>
                                  <th className="border-r border-black p-1 text-center w-14">P x C</th>
                                  <th className="p-1 text-left">Observation</th>
                              </tr>
                          </thead>
                          <tbody>
                              {reportData.subjects.map((sub: any, idx: number) => (
                                  <tr key={idx} className="border-b border-gray-300 last:border-b-0">
                                      <td className="border-r border-black p-1 font-semibold">{sub.subjectName}</td>
                                      <td className="border-r border-black p-1 text-center">{sub.coefficient}</td>
                                      <td className="border-r border-black p-1 text-center font-bold">{sub.average.toFixed(2)}</td>
                                      <td className="border-r border-black p-1 text-center">{(sub.average * sub.coefficient).toFixed(2)}</td>
                                      <td className="p-1 italic text-[8px] text-gray-600">
                                          {sub.average >= 16 ? 'Excellent' : sub.average >= 14 ? 'T. Bien' : sub.average >= 12 ? 'A. Bien' : sub.average >= 10 ? 'Passable' : 'Insuff.'}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                          <tfoot>
                              <tr className="bg-gray-100 font-bold border-t border-black">
                                  <td className="border-r border-black p-1 text-right">TOTAL:</td>
                                  <td className="border-r border-black p-1 text-center">{reportData.totalCoefficients}</td>
                                  <td className="border-r border-black p-1"></td>
                                  <td className="border-r border-black p-1 text-center">{reportData.totalPoints.toFixed(2)}</td>
                                  <td className="p-1"></td>
                              </tr>
                          </tfoot>
                      </table>
  
                      {/* Final Results */}
                      <div className="flex justify-between items-stretch mb-4 gap-4">
                          <div className="border border-black p-1.5 flex-1 text-center bg-gray-50 flex flex-col justify-center">
                              <div className="text-[8px] font-bold uppercase mb-0.5">Moyenne</div>
                              <div className={`text-lg font-black ${reportData.globalAverage >= 10 ? 'text-green-800' : 'text-red-800'} `}>
                                  {reportData.globalAverage.toFixed(2)} / 20
                              </div>
                          </div>
                          
                          <div className="border border-black p-1.5 flex-[2] text-[8px]">
                              <div className="font-bold underline mb-1">Espace réservé:</div>
                              <div className="h-6"></div>
                              <div className="text-[7px] text-right font-bold italic">Signature Direction</div>
                          </div>
                      </div>
  
                      {/* Footer */}
                      <div className="text-center pt-1 text-[7px] text-gray-400 border-t border-gray-200">
                          KalanSira - Relevé du {new Date().toLocaleDateString('fr-FR')}
                      </div>
                  </div>
                 ))}
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              @page {
                size: A4 landscape;
                margin: 0;
              }
              body {
                background: white !important;
                color: black !important;
              }
              .glass-panel, .btn-primary, .topbar {
                display: none !important;
              }
              .landscape-print-container {
                padding: 0 !important;
                gap: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: white !important;
                display: flex !important;
              }
              .landscape-print-container > div {
                box-shadow: none !important;
                border-right: 1px dashed black !important;
                width: 50% !important;
                height: 210mm !important;
                padding: 30px !important;
              }
              .landscape-print-container > div:last-child {
                border-right: none !important;
              }
            }
          `}} />
        </div>
      )}

      {/* Error State for Locks */}
      {error && !isEditMode && (error as any).response?.status === 403 && (
          <div className="text-center p-12 border border-dashed border-red-500/30 bg-red-500/5 rounded-2xl print:hidden">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2 text-red-400">Bulletin Verrouillé</h3>
              <p className="text-red-300">
                {(error as any).response?.data?.message || "Le bulletin n'est pas encore disponible."}
              </p>
          </div>
      )}

      {/* Empty State */}
      {!showPreview && !isGenerating && !error && !isEditMode && (
          <div className="text-center p-12 border border-dashed border-[var(--glass-border)] rounded-2xl print:hidden">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">Bulletins de Notes</h3>
              <p className="text-neutral-400">Veuillez sélectionner un élève et un trimestre pour continuer.</p>
          </div>
      )}
      
      {!selectedStudent && isEditMode && (
         <div className="text-center p-12 border border-dashed border-[var(--glass-border)] rounded-2xl print:hidden max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Mode Saisie</h3>
            <p className="text-neutral-400">Veuillez d'abord sélectionner un élève dans la liste.</p>
         </div>
      )}
    </div>
  );
};

export default Reports;
