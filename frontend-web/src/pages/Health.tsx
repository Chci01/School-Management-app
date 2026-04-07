import { useState } from 'react';
import { useHealth } from '../hooks/useHealth';
import { useAuth } from '../hooks/useAuth';

const Health = () => {
  const { currentSchoolId } = useAuth();
  const { records, isLoading } = useHealth(currentSchoolId || undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des registres...</div>
          </div>
      );
  }

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Infirmerie & Santé</h2>
          <p>Registre médical, suivi des incidents et premiers soins.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Nouvelle Entrée</button>
      </header>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
           <div className="stat-card glass-panel" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Incidents (Ce mois)</h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{records.length}</div>
           </div>
           <div className="stat-card glass-panel" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Urgences Traitées</h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>0</div>
           </div>
      </div>

      <div className="table-container glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Date</th>
              <th style={{ padding: '16px' }}>Patient (Élève)</th>
              <th style={{ padding: '16px' }}>Symptômes / Incident</th>
              <th style={{ padding: '16px' }}>Soins apportés</th>
              <th style={{ padding: '16px' }}>Gravité</th>
            </tr>
          </thead>
          <tbody>
              {records.map((record: any) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                       <td style={{ padding: '16px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                           {new Date(record.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                       </td>
                       <td style={{ padding: '16px', fontWeight: 'bold' }}>{record.studentName}</td>
                       <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{record.symptoms}</td>
                       <td style={{ padding: '16px', fontSize: '14px' }}>{record.actionsTaken}</td>
                       <td style={{ padding: '16px' }}>
                           <span className="badge" style={{ 
                               padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                               background: record.severity === 'FAIBLE' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                               color: record.severity === 'FAIBLE' ? '#4ade80' : '#fbbf24'
                           }}>
                               {record.severity}
                           </span>
                       </td>
                  </tr>
              ))}
              {records.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center' }}>Aucun registre récent.</td></tr>
              )}
          </tbody>
        </table>
      </div>

      {/* New Record Modal */}
      {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '600px', maxWidth: '90%', padding: '24px' }}>
                  <h3>Rapport d'Infirmerie</h3>
                  
                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Élève concerné</label>
                      <select style={{ width: '100%', padding: '10px', background: 'var(--surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}>
                          <option>Rechercher un élève...</option>
                      </select>
                  </div>

                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Symptômes constatés</label>
                      <input type="text" placeholder="Ex: Fièvre, Blessure..." style={{ width: '100%' }} />
                  </div>

                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Actions / Soins apportés</label>
                      <textarea placeholder="Ex: Désinfection, appel aux parents..." style={{ width: '100%', minHeight: '80px', padding: '12px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}></textarea>
                  </div>

                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Niveau de Gravité</label>
                      <select style={{ width: '100%', padding: '10px', background: 'var(--surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}>
                          <option value="FAIBLE">Faible (Soins bénins)</option>
                          <option value="MOYENNE">Moyenne (Alerte parents)</option>
                          <option value="GRAVE">Grave (Urgence médicale)</option>
                      </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Annuler</button>
                      <button className="btn-primary" onClick={() => setIsModalOpen(false)}>Enregistrer au registre</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Health;
