import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReports } from '../hooks/useReports';
import { useUsers } from '../hooks/useUsers';
import { useAcademic } from '../hooks/useAcademic';

const Reports = () => {
  const { currentSchoolId } = useAuth();
  
  // Selectors State
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  // Fetch Reference Data
  const { users: students, isLoading: l1 } = useUsers(currentSchoolId!, 'STUDENT');
  const { academicYears, isLoading: l2 } = useAcademic(currentSchoolId!);

  // Fetch Report Data
  const { reportData, isLoading: isGenerating, error, refetch, publishTerm, isPublishing } = useReports(
      selectedStudent, selectedTerm, selectedYear
  );

  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if(!selectedStudent || !selectedYear) return;
    refetch();
    setShowPreview(true);
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
      if(selectedStudent) refetch(); // Reload current student report to see changes
    } catch(e: any) {
      alert("Erreur lors de la modification de la publication: " + e.message);
    }
  };

  if (l1 || l2) return <div className="p-8 text-neutral-400">Chargement des données...</div>;

  return (
    <div className="p-8 pb-32">
      <div className="mb-8 p-6 glass-panel rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bulletins de Notes</h1>
          <p className="text-neutral-400">Générateur automatisé de relevés de notes.</p>
        </div>
        
        <div className="flex gap-4 flex-wrap w-full md:w-auto">
           {/* Filters */}
           <div className="flex flex-col gap-1 w-full md:w-48">
              <label className="text-sm text-neutral-400 ml-1">Année Académique</label>
              <select className="glass-input w-full" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                <option value="">Sélectionner</option>
                {academicYears?.map((y: any) => (
                  <option key={y.id} value={y.id}>{y.name}</option>
                ))}
              </select>
           </div>
           
           <div className="flex flex-col gap-1 w-full md:w-48">
              <label className="text-sm text-neutral-400 ml-1">Trimestre</label>
              <select className="glass-input w-full" value={selectedTerm} onChange={e => setSelectedTerm(Number(e.target.value))}>
                <option value={1}>1er Trimestre</option>
                <option value={2}>2ème Trimestre</option>
                <option value={3}>3ème Trimestre</option>
              </select>
           </div>

           <div className="flex flex-col gap-1 w-full md:w-64">
              <label className="text-sm text-neutral-400 ml-1">Élève</label>
              <select className="glass-input w-full" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                <option value="">Sélectionner un élève</option>
                {students?.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.matricule} - {s.firstName} {s.lastName}</option>
                ))}
              </select>
           </div>

           <div className="flex items-end gap-2">
             <button 
               className="btn-primary h-12" 
               disabled={!selectedStudent || !selectedYear || isGenerating}
               onClick={handleGenerate}
             >
               {isGenerating ? 'Calcul...' : 'Générer le Bulletin'}
             </button>
             
             {/* Admin Publish Buttons */}
             <div className="flex flex-col gap-1 ml-4 justify-end border-l border-gray-700 pl-4">
                <label className="text-xs text-neutral-400">Gérer le Trimestre</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePublishToggle(true)}
                    disabled={!selectedYear || isPublishing}
                    className="h-10 px-3 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded-lg border border-green-500/30 text-sm font-semibold transition-all"
                  >
                    🔓 Publier
                  </button>
                  <button 
                    onClick={() => handlePublishToggle(false)}
                    disabled={!selectedYear || isPublishing}
                    className="h-10 px-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg border border-red-500/30 text-sm font-semibold transition-all"
                  >
                    🔒 Verrouiller
                  </button>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Report Card Preview rendering */}
      {showPreview && reportData && (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-[var(--surface)] p-4 rounded-xl border border-[var(--glass-border)] print:hidden">
             <div className="text-sm text-neutral-400">Aperçu avant Impression (A4)</div>
             <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
                🖨️ Imprimer le Bulletin
             </button>
          </div>

          {/* Printable Area - A4 Landscape Paper Replica */}
          <div className="mx-auto print:m-0 print:w-full" style={{ width: 'fit-content' }}>
            <div 
              ref={printRef}
              className="bg-neutral-100 p-8 print:p-0 flex gap-8 landscape-print-container"
              style={{ minHeight: 'fit-content' }}
            >
               {[1, 2].map((i) => (
                <div 
                  key={i}
                  className="bg-white text-black p-8 shadow-2xl relative flex flex-col border-r last:border-r-0 border-dashed border-gray-300 print:border-gray-200"
                  style={{ 
                      width: '540px', // Roughly half of A4 landscape pixels (around 1122px total)
                      minHeight: '750px',
                      fontSize: '11px' // Slightly smaller font for dual layout
                  }}
                >
                    {/* Identification Label (Ecole / Parent) */}
                    <div className="absolute top-2 right-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {i === 1 ? "COPIE ÉCOLE" : "COPIE PARENTS"}
                    </div>

                    {/* Header */}
                    <div className="flex justify-between border-b border-black pb-3 mb-4">
                        <div className="flex-1">
                            <h2 className="text-[10px] font-bold">RÉPUBLIQUE DU MALI</h2>
                            <p className="text-[8px]">Un Peuple - Un But - Une Foi</p>
                            <p className="text-[9px] mt-2 font-bold leading-tight">MINISTÈRE DE L'ÉDUCATION NATIONALE</p>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="w-12 h-12 rounded-full border border-black mx-auto flex items-center justify-center font-bold text-[8px] bg-gray-50">KSM</div>
                            <p className="text-[10px] font-black mt-1 uppercase">KalanSira Mali</p>
                        </div>
                        <div className="flex-1 text-right">
                            <h2 className="text-[10px] font-bold">A.E BAMAKO RIVE DROITE</h2>
                            <p className="text-[9px]">Année: {reportData.academicYear.name}</p>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <h1 className="text-xl font-black uppercase tracking-widest border-2 border-black inline-block px-4 py-1">
                            Bulletin de Notes
                        </h1>
                        <p className="mt-1 text-sm font-bold">Trimestre {reportData.term}</p>
                    </div>

                    {/* Student Info Box */}
                    <div className="border border-black p-3 mb-4 flex gap-4 bg-gray-50/50">
                        <div className="w-16 h-16 border border-black flex items-center justify-center text-[8px] bg-gray-200 overflow-hidden">
                            {reportData.student.photo ? (
                                <img src={reportData.student.photo} alt="Student" className="w-full h-full object-cover" />
                            ) : "PHOTO"}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 flex-grow text-[10px]">
                            <div><span className="font-bold text-gray-500">Nom:</span> <span className="font-bold uppercase">{reportData.student.lastName}</span></div>
                            <div><span className="font-bold text-gray-500">Prénom:</span> <span className="font-bold uppercase">{reportData.student.firstName}</span></div>
                            <div><span className="font-bold text-gray-500">Matricule:</span> <span className="font-mono">{reportData.student.matricule}</span></div>
                            <div><span className="font-bold text-gray-500">Classe:</span> {reportData.class.name}</div>
                        </div>
                    </div>

                    {/* Grades Table */}
                    <table className="w-full text-[10px] border-collapse border border-black mb-4 flex-grow">
                        <thead>
                            <tr className="bg-gray-200 font-bold border-b border-black">
                                <th className="border-r border-black p-1 text-left">Matières</th>
                                <th className="border-r border-black p-1 text-center w-12">Coef</th>
                                <th className="border-r border-black p-1 text-center w-16">Note</th>
                                <th className="border-r border-black p-1 text-center w-16">P x C</th>
                                <th className="p-1 text-left">Observations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.subjects.map((sub: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-300 last:border-b-0">
                                    <td className="border-r border-black p-1 font-semibold">{sub.subjectName}</td>
                                    <td className="border-r border-black p-1 text-center">{sub.coefficient}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{sub.average.toFixed(2)}</td>
                                    <td className="border-r border-black p-1 text-center">{(sub.average * sub.coefficient).toFixed(2)}</td>
                                    <td className="p-1 italic text-[9px] text-gray-600">
                                        {sub.average >= 16 ? 'Excellent' : sub.average >= 14 ? 'T. Bien' : sub.average >= 12 ? 'A. Bien' : sub.average >= 10 ? 'Passable' : 'Insuff.'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100 font-bold border-t border-black">
                                <td className="border-r border-black p-1 text-right">TOTAUX:</td>
                                <td className="border-r border-black p-1 text-center">{reportData.totalCoefficients}</td>
                                <td className="border-r border-black p-1"></td>
                                <td className="border-r border-black p-1 text-center">{reportData.totalPoints.toFixed(2)}</td>
                                <td className="p-1"></td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Final Results */}
                    <div className="flex justify-between items-stretch mb-4 gap-4">
                        <div className="border border-black p-2 flex-1 text-center bg-gray-50 flex flex-col justify-center">
                            <div className="text-[9px] font-bold uppercase mb-1">Moyenne</div>
                            <div className={`text-xl font-black ${reportData.globalAverage >= 10 ? 'text-green-800' : 'text-red-800'} `}>
                                {reportData.globalAverage.toFixed(2)} / 20
                            </div>
                        </div>
                        
                        <div className="border border-black p-2 flex-1 text-[9px]">
                            <div className="font-bold underline mb-1">Observation Générale:</div>
                            <div className="h-8"></div>
                            <div className="text-[8px] text-right font-bold italic">Le Chef d'établissement</div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-1 text-[8px] text-gray-400 border-t border-gray-200">
                        KalanSira Mali - Relevé du {new Date().toLocaleDateString('fr-FR')}
                    </div>
                </div>
               ))}
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
              }
              .no-print {
                display: none !important;
              }
              .landscape-print-container {
                padding: 0 !important;
                gap: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: white !important;
              }
              .landscape-print-container > div {
                box-shadow: none !important;
                border-right: 1px dashed black !important;
                width: 50% !important;
                height: 210mm !important;
                padding: 40px !important;
              }
              .landscape-print-container > div:last-child {
                border-right: none !important;
              }
            }
          `}} />
        </div>
      )}

      {/* Error State for Locks */}
      {error && (error as any).response?.status === 403 && (
          <div className="text-center p-12 border border-dashed border-red-500/30 bg-red-500/5 rounded-2xl print:hidden">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2 text-red-400">Bulletin Verrouillé</h3>
              <p className="text-red-300">
                {(error as any).response?.data?.message || "Le bulletin de ce trimestre n'est pas encore publié."}
              </p>
              <div className="mt-6 text-sm text-neutral-400">
                 Utilisez les boutons "Publier" / "Verrouiller" ci-dessus pour gérer la visibilité.
              </div>
          </div>
      )}

      {/* Empty State */}
      {!showPreview && !isGenerating && !error && (
          <div className="text-center p-12 border border-dashed border-[var(--glass-border)] rounded-2xl print:hidden">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">Aucun bulletin généré</h3>
              <p className="text-neutral-400">Sélectionnez les critères ci-dessus pour calculer les moyennes.</p>
          </div>
      )}
    </div>
  );
};

export default Reports;
