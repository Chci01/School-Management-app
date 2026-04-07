import { useState } from 'react';
import { usePayments } from '../hooks/usePayments';

const Payments = () => {
  const { payments, isLoading, error } = usePayments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<any>(null);

  // Derive sums
  const displayedPayments = Array.isArray(payments) ? payments : [];
  const totalCollected = displayedPayments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  if (isLoading) {
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des finances...</div>
          </div>
      );
  }

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Gestion Financière</h2>
          <p>Suivez les paiements de scolarité et générez des reçus.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Nouveau Paiement</button>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
         <div className="stat-card glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Encaissé</h4>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success)' }}>{totalCollected.toLocaleString()} FCFA</div>
         </div>
         <div className="stat-card glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Paiements Récents</h4>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{displayedPayments.length}</div>
         </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="input-group" style={{ margin: 0, flex: 1 }}>
              <input type="text" placeholder="Rechercher par n° de reçu ou élève..." style={{ width: '100%', maxWidth: '300px' }} />
          </div>
      </div>

      {error && (
         <div className="alert-error" style={{ marginBottom: '20px', color: 'var(--danger)' }}>
             Impossible de charger l'historique financier.
         </div>
      )}

      {/* Datagrid */}
      <div className="table-container glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>N° Reçu</th>
              <th style={{ padding: '16px' }}>Date</th>
              <th style={{ padding: '16px' }}>Élève</th>
              <th style={{ padding: '16px' }}>Tranche</th>
              <th style={{ padding: '16px' }}>Montant</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedPayments.length > 0 ? displayedPayments.map((payment: any) => (
              <tr key={payment.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>{payment.receiptNumber}</td>
                <td style={{ padding: '16px' }}>{new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                <td style={{ padding: '16px' }}>
                    {payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : payment.studentId}
                </td>
                <td style={{ padding: '16px' }}>
                    <span className="badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                       Tranche {payment.tranche}
                    </span>
                </td>
                <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--success)' }}>
                    {payment.amount.toLocaleString()} FCFA
                </td>
                <td style={{ padding: '16px' }}>
                    <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => setReceiptToPrint(payment)}>🖨️ Reçu</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  Aucun paiement enregistré. 
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal Placeholder */}
      {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '500px', maxWidth: '90%', padding: '24px' }}>
                  <h3>Enregistrer un Paiement</h3>
                  
                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Élève</label>
                      <select style={{ width: '100%', padding: '10px', background: 'var(--surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}>
                          <option>Sélectionnez un élève...</option>
                      </select>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                      <div className="input-group" style={{ flex: 1 }}>
                          <label>Montant (FCFA)</label>
                          <input type="number" placeholder="Ex: 50000" style={{ width: '100%' }} />
                      </div>
                      <div className="input-group" style={{ flex: 1 }}>
                          <label>Tranche</label>
                          <select style={{ width: '100%', padding: '10px', background: 'var(--surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}>
                              <option value="1">Tranche 1</option>
                              <option value="2">Tranche 2</option>
                              <option value="3">Tranche 3</option>
                          </select>
                      </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Annuler</button>
                      <button className="btn-primary" onClick={() => setIsModalOpen(false)}>Valider & Imprimer</button>
                  </div>
              </div>
          </div>
      )}

      {/* Print Receipt Modal */}
      {receiptToPrint && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
             <div className="modal-content" style={{ 
                 width: '500px', 
                 padding: '40px', 
                 background: 'white', 
                 color: 'black', 
                 borderRadius: '12px', 
                 boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                 position: 'relative',
                 overflow: 'hidden'
             }}>
                  {/* Watermark/Stamp */}
                  <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-30deg)',
                      fontSize: '80px',
                      fontWeight: '900',
                      color: 'rgba(34, 197, 94, 0.1)',
                      pointerEvents: 'none',
                      zIndex: 0,
                      border: '8px solid rgba(34, 197, 94, 0.1)',
                      padding: '10px 30px',
                      borderRadius: '20px',
                      textTransform: 'uppercase'
                  }}>PAYÉ</div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                             <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                 KSM
                             </div>
                          </div>
                          <h2 style={{ margin: 0, color: '#1e293b', letterSpacing: '1px' }}>REÇU DE PAIEMENT</h2>
                          <p style={{ margin: '4px 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>N° {receiptToPrint.receiptNumber}</p>
                      </div>
                      
                      <div style={{ marginBottom: '32px', fontSize: '15px', lineHeight: '1.8' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ color: '#64748b' }}>Date d'émission:</span>
                              <strong style={{ color: '#1e293b' }}>{new Date(receiptToPrint.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ color: '#64748b' }}>Élève:</span>
                              <strong style={{ color: '#1e293b', textTransform: 'uppercase' }}>
                                 {receiptToPrint.student ? `${receiptToPrint.student.firstName} ${receiptToPrint.student.lastName}` : receiptToPrint.studentId}
                              </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ color: '#64748b' }}>Matricule:</span>
                              <span style={{ color: '#1e293b', fontFamily: 'monospace', fontWeight: '600' }}>{receiptToPrint.student?.matricule || '-'}</span>
                          </div>
                          
                          <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span style={{ color: '#64748b' }}>Désignation:</span>
                                  <strong style={{ color: '#1e293b' }}>Frais de Scolarité</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#64748b' }}>Détails:</span>
                                  <span style={{ color: '#1e293b' }}>Tranche {receiptToPrint.tranche} (2024-2025)</span>
                              </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #1e293b', fontSize: '20px' }}>
                              <span style={{ fontWeight: '600', color: '#1e293b' }}>MONTANT TOTAL:</span>
                              <span style={{ fontWeight: '800', color: '#15803d' }}>{receiptToPrint.amount.toLocaleString()} FCFA</span>
                          </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 40px 0' }}>Le Client</p>
                              <div style={{ borderBottom: '1px solid #e2e8f0', width: '80%', margin: '0 auto' }}></div>
                          </div>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' }}>Le Caissier</p>
                              <div style={{ display: 'inline-block', padding: '5px 10px', border: '2px double #1e293b', color: '#1e293b', fontSize: '10px', fontWeight: 'bold' }}>
                                 CACHET DE L'ÉCOLE
                              </div>
                              <div style={{ height: '25px' }}></div>
                              <div style={{ borderBottom: '1px solid #e2e8f0', width: '80%', margin: '0 auto' }}></div>
                          </div>
                      </div>

                      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                          <button 
                            className="btn-secondary" 
                            style={{ color: '#475569', borderColor: '#cbd5e1', background: 'transparent' }} 
                            onClick={() => setReceiptToPrint(null)}
                          >Fermer</button>
                          <button 
                            className="btn-primary" 
                            style={{ background: '#1e293b', borderColor: '#1e293b' }}
                            onClick={() => window.print()}
                          >🖨️ Imprimer</button>
                      </div>
                  </div>
             </div>
          </div>
      )}

    </div>
  );
};

export default Payments;
