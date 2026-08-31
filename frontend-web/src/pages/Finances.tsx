import { useState, useEffect } from 'react';
import { DollarSign, Plus, ArrowDownRight, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

const Finances = () => {
  const { currentSchoolId } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'DEPENSES' | 'SALAIRES' | 'EQUIPEMENTS'>('DEPENSES');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  
  const [budget, setBudget] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newOp, setNewOp] = useState({ title: '', amount: '', type: 'DEPENSES', date: new Date().toISOString().split('T')[0] });
  const [tempBudget, setTempBudget] = useState('0');

  useEffect(() => {
    if (currentSchoolId) {
      fetchFinances();
    }
  }, [currentSchoolId]);

  const fetchFinances = async () => {
    try {
      setLoading(true);
      // Fetch Expenses
      const expensesRes = await api.get('/finances/expenses', { params: { schoolId: currentSchoolId } });
      setTransactions(expensesRes.data || []);
      
      // Fetch Budgets (get latest active one or sum)
      const budgetsRes = await api.get('/finances/budgets', { params: { schoolId: currentSchoolId } });
      const budgets = budgetsRes.data || [];
      if (budgets.length > 0) {
        setBudget(budgets[0].amount); // Taking the most recent budget for simplicity
        setTempBudget(budgets[0].amount.toString());
      } else {
        setBudget(0);
        setTempBudget('0');
      }
    } catch (error) {
      console.error('Error fetching finances', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOp = async () => {
    if (!newOp.title || !newOp.amount) return;
    
    try {
      await api.post('/finances/expenses', {
        schoolId: currentSchoolId,
        title: newOp.title,
        amount: Number(newOp.amount),
        category: newOp.type,
        date: new Date(newOp.date)
      });
      setIsModalOpen(false);
      setNewOp({ title: '', amount: '', type: 'DEPENSES', date: new Date().toISOString().split('T')[0] });
      fetchFinances();
    } catch (e) {
      alert("Erreur lors de l'ajout de l'opération.");
    }
  };

  const handleDeleteOp = async (id: string) => {
    if (!window.confirm('Supprimer cette opération ?')) return;
    try {
      await api.delete(`/finances/expenses/${id}`);
      fetchFinances();
    } catch (e) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleSaveBudget = async () => {
    const val = Number(tempBudget);
    try {
      // Create a new budget record
      await api.post('/finances/budgets', {
        schoolId: currentSchoolId,
        title: `Budget Annuel ${new Date().getFullYear()}`,
        amount: val,
        type: 'ANNUAL'
      });
      setIsBudgetModalOpen(false);
      fetchFinances();
    } catch (e) {
      alert("Erreur lors de la mise à jour du budget.");
    }
  };

  // Derive sums
  const getSum = (type: string) => transactions.filter(t => t.category === type).reduce((acc, curr) => acc + curr.amount, 0);
  const sumDepenses = getSum('DEPENSES');
  const sumSalaires = getSum('SALAIRES');
  const sumEquipements = getSum('EQUIPEMENTS');

  const displayedTransactions = transactions.filter(t => t.category === activeTab);

  if (loading) {
    return <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Loader2 className="animate-spin" size={32} /></div>;
  }

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
          <button className="btn-secondary" onClick={() => setIsBudgetModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Edit2 size={18} /> Définir le Budget
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
           <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer' }} onClick={() => setIsBudgetModalOpen(true)}>Prévision Budgétaire ✎</h4>
           <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{budget.toLocaleString()} F</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '4px solid #ef4444' }}>
           <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowDownRight size={16} color="#ef4444" /> Dépenses Courantes</h4>
           <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>{sumDepenses.toLocaleString()} F</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
           <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Paiement Salaires</h4>
           <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{sumSalaires.toLocaleString()} F</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '4px solid #8b5cf6' }}>
           <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Achat Équipements</h4>
           <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6' }}>{sumEquipements.toLocaleString()} F</div>
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
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
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
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e'
                     }}>
                      Payé
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                     <button onClick={() => handleDeleteOp(t.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {displayedTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
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
              <select value={newOp.type} onChange={e => setNewOp({...newOp, type: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <option value="DEPENSES">Dépense Courante</option>
                <option value="SALAIRES">Salaire</option>
                <option value="EQUIPEMENTS">Équipement</option>
              </select>
            </div>
            
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Date</label>
              <input type="date" value={newOp.date} onChange={e => setNewOp({...newOp, date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>
            
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Libellé (Description)</label>
              <input type="text" value={newOp.title} onChange={e => setNewOp({...newOp, title: e.target.value})} placeholder="Ex: Achat de craies..." style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>

            <div className="input-group" style={{ marginBottom: '32px' }}>
               <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Montant (FCFA)</label>
               <input type="number" value={newOp.amount} onChange={e => setNewOp({...newOp, amount: e.target.value})} placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
              <button type="button" className="btn-primary" onClick={handleAddOp} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: '#22c55e', border: 'none' }}>Valider l'opération</button>
            </div>
          </div>
        </div>
      )}

      {isBudgetModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '400px', maxWidth: '95%', padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: 800 }}>Définir le Budget Global</h3>
            
            <div className="input-group" style={{ marginBottom: '32px' }}>
               <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Prévision Budgétaire (FCFA)</label>
               <input type="number" value={tempBudget} onChange={e => setTempBudget(e.target.value)} placeholder="5000000" style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '1.2rem', fontWeight: 700 }} />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsBudgetModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
              <button type="button" className="btn-primary" onClick={handleSaveBudget} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: '#3b82f6', border: 'none' }}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finances;
