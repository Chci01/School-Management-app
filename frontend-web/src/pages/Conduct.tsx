import { useState } from 'react';
import { useConduct } from '../hooks/useConduct';

const Conduct = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { generateGlobalConduct, isGenerating } = useConduct();

  const handleGenerate = async () => {
    try {
      const res = await generateGlobalConduct({ month: selectedMonth, year: selectedYear });
      alert(res.message);
    } catch (e: any) {
      alert("Erreur lors du calcul: " + e.message);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 p-6 glass-panel rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notes de Conduite</h1>
          <p className="text-neutral-400">Générez et gérez les moyennes de conduite mensuelles.</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <select 
            className="glass-input h-12 px-4"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>Mois {m}</option>
            ))}
          </select>

          <input 
            type="number" 
            className="glass-input h-12 px-4 w-28" 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          />

          <button 
            className="btn-primary h-12"
            disabled={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? 'Calcul en cours...' : 'Calculer les Moyennes'}
          </button>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center border border-dashed border-[var(--glass-border)]">
        <h3 className="text-xl font-bold mb-2">Comment ça marche ?</h3>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Les professeurs attribuent des notes de conduite individuelles à la fin de chaque mois.
          En cliquant sur "Calculer les Moyennes", le système va agréger toutes les notes saisies par les différents
          professeurs pour chaque élève et générer une note de conduite globale avec une appréciation automatique
          qui sera affichée sur le compte Parent / Élève.
        </p>
      </div>
    </div>
  );
};

export default Conduct;
