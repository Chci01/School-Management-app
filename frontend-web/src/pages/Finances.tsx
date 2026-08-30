import { useState } from 'react';
import { DollarSign, Plus, ArrowDownRight, Download } from 'lucide-react';

const Finances = () => {
  const [activeTab, setActiveTab] = useState<'DEPENSES' | 'SALAIRES' | 'EQUIPEMENTS'>('DEPENSES');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for UI demonstration
  const stats = {
    budget: 5000000,
    depenses: 1250000,
    salaires: 2000000,
    equipements: 450000,
  };

  const transactions = [
    { id: 1, type: 'DEPENSES', title: 'Facture Électricité (JIRAMA)', amount: 45000, date: '2026-08-01', status: 'Payé' },
    { id: 2, type: 'SALAIRES', title: 'Salaire Prof Titulaire', amount: 350000, date: '2026-08-05', status: 'Payé' },
    { id: 3, type: 'EQUIPEMENTS', title: 'Achat de 5 Table-bancs', amount: 150000, date: '2026-08-10', status: 'Payé' },
    { id: 4, type: 'DEPENSES', title: 'Maintenance Informatique', amount: 75000, date: '2026-08-15', status: 'En attente' },
  ];

  const displayedTransactions = transactions.filter(t => t.type === activeTab);

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', color: '#22c55e' }}>
              <DollarSign size={28} />
            </div>
            Gestion des Finances (Dépenses)
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Enregistrez vos dépenses, paiements de salaires et achats d'équipements.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Download size={18} /> Rapport
          </button>
          <button 
            className="btn-primary" 
            style={{ background: '#22c55e', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} /> Nouvelle Opération
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
           <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Prévision Budgétaire</h4>
           <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{stats.budget.toLocaleString()} F</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '4px solid #ef4444' }}>
           <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowDownRight size={16} color="#ef4444" /> Dépenses Courantes</h4>
           <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>{stats.depenses.toLocaleString()} F</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
           <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Paiement Salaires</h4>
           <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{stats.salaires.toLocaleString()} F</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '4px solid #8b5cf6' }}>
           <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Achat Équipements</h4>
           <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6' }}>{stats.equipements.toLocaleString()} F</div>
        </div>
      </div>

      <div className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
           <button 
              onClick={() => setActiveTab('DEPENSES')}
              style={{ background: 'transparent', border: 'none', color: activeTab === 'DEPENSES' ? '#ef4444' : 'var(--text-muted)', fontWeight: activeTab === 'DEPENSES' ? 800 : 500, fontSize: '1.1rem', cursor: 'pointer', paddingBottom: '8px', borderBottom: activeTab === 'DEPENSES' ? '3px solid #ef4444' : '3px solid transparent' }}
           >
              Dépenses Courantes
           </button>
           <button 
              onClick={() => setActiveTab('SALAIRES')}
              style={{ background: 'transparent', border: 'none', color: activeTab === 'SALAIRES' ? '#f59e0b' : 'var(--text-muted)', fontWeight: activeTab === 'SALAIRES' ? 800 : 500, fontSize: '1.1rem', cursor: 'pointer', paddingBottom: '8px', borderBottom: activeTab === 'SALAIRES' ? '3px solid #f59e0b' : '3px solid transparent' }}
           >
              Salaires
           </button>
           <button 
              onClick={() => setActiveTab('EQUIPEMENTS')}
              style={{ background: 'transparent', border: 'none', color: activeTab === 'EQUIPEMENTS' ? '#8b5cf6' : 'var(--text-muted)', fontWeight: activeTab === 'EQUIPEMENTS' ? 800 : 500, fontSize: '1.1rem', cursor: 'pointer', paddingBottom: '8px', borderBottom: activeTab === 'EQUIPEMENTS' ? '3px solid #8b5cf6' : '3px solid transparent' }}
           >
              Équipements
           </button>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <th style={{ padding: '12px 20px' }}>Date</th>
                <th style={{ padding: '12px 20px' }}>Libellé de l'opération</th>
                <th style={{ padding: '12px 20px' }}>Montant</th>
                <th style={{ padding: '12px 20px' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((t) => (
                <tr key={t.id} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <td style={{ padding: '16px 20px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', color: 'var(--text)' }}>
                    {new Date(t.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)' }}>
                    {t.title}
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 800, color: activeTab === 'DEPENSES' ? '#ef4444' : (activeTab === 'SALAIRES' ? '#f59e0b' : '#8b5cf6') }}>
                    - {t.amount.toLocaleString()} F
                  </td>
                  <td style={{ padding: '16px 20px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        background: t.status === 'Payé' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: t.status === 'Payé' ? '#22c55e' : '#ef4444'
                     }}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {displayedTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Aucune opération trouvée pour cette catégorie.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '500px', maxWidth: '95%', padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: 800 }}>Nouvelle Opération</h3>
            
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Type de dépense</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <option value="DEPENSES">Dépense Courante</option>
                <option value="SALAIRES">Salaire</option>
                <option value="EQUIPEMENTS">Équipement</option>
              </select>
            </div>
            
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Libellé (Description)</label>
              <input type="text" placeholder="Ex: Achat de craies..." style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>

            <div className="input-group" style={{ marginBottom: '32px' }}>
               <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Montant (FCFA)</label>
               <input type="number" placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
              <button type="button" className="btn-primary" onClick={() => setIsModalOpen(false)} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: '#22c55e', border: 'none' }}>Valider l'opération</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finances;
