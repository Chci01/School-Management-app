import { useState } from 'react';
import { useConduct } from '../hooks/useConduct';
import { ShieldCheck, Calendar, Zap, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const Conduct = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { generateGlobalConduct, isGenerating } = useConduct();

  const handleGenerate = async () => {
    try {
      const res = await generateGlobalConduct({ month: selectedMonth, year: selectedYear });
      alert(res.message);
    } catch (e: any) {
      alert("Erreur lors du calcul: " + (e.response?.data?.message || e.message));
    }
  };

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '16px', color: '#F59E0B' }}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Gestion de la Conduite</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Générez les moyennes de conduite mensuelles pour tous les élèves.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ACTION PANEL */}
        <div className="dash-card glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={22} color="var(--primary)" />
            Période de calcul
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>MOIS</label>
              <select 
                className="glass-input"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((m, i) => (
                  <option key={i+1} value={i+1}>{m}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>ANNÉE</label>
              <input 
                type="number" 
                className="glass-input"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
            </div>
          </div>

          <button 
            className="btn-primary"
            style={{ width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
            disabled={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>Calcul en cours...</>
            ) : (
              <><Zap size={22} /> Calculer les Moyennes Globales</>
            )}
          </button>

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)', display: 'flex', gap: '12px' }}>
             <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
               <strong>Attention :</strong> Cette action écrasera les moyennes existantes pour cette période. Assurez-vous que tous les professeurs ont fini de saisir leurs notes individuelles.
             </p>
          </div>
        </div>

        {/* INFO PANEL */}
        <div className="dash-card glass-panel" style={{ padding: '32px', borderRadius: '24px', borderStyle: 'dashed' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info size={22} color="var(--primary)" />
            Fonctionnement
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800 }}>1</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Saisie des Professeurs</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Chaque professeur attribue une note de conduite et une appréciation via son interface mobile/web à la fin du mois.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800 }}>2</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Agrégation Centrale</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>L'administration déclenche ici le calcul de la moyenne arithmétique de toutes les notes reçues par l'élève.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800 }}>3</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Visibilité Parents</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Une fois générée, la moyenne est instantanément visible sur le tableau de bord des parents et des élèves.</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <CheckCircle size={24} color="#10B981" />
             <span style={{ fontWeight: 600, color: '#10B981' }}>Le système génère des appréciations automatiques basées sur la note.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conduct;
