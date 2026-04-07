import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';

const Documents = () => {
  const { currentSchoolId, user } = useAuth();
  const { documents, isLoading, updateStatus, createRequest } = useDocuments(currentSchoolId || undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentToPrint, setDocumentToPrint] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('ALL'); 

  const [newRequest, setNewRequest] = useState({
      type: 'CERTIFICATE',
      reason: '',
      studentId: ''
  });

  const handleSubmit = () => {
      if (!newRequest.reason) return alert("Veuillez saisir un motif.");
      createRequest(newRequest, {
          onSuccess: () => {
              setIsModalOpen(false);
              setNewRequest({ type: 'CERTIFICATE', reason: '', studentId: '' });
          }
      });
  };

  if (isLoading) {
// ... existing loading code ...
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des requêtes...</div>
          </div>
      );
  }

  const displayedDocs = activeFilter === 'ALL' ? documents : documents.filter((d: any) => d.status === activeFilter);
  const pendingCount = documents.filter((d: any) => d.status === 'PENDING').length;

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Gestion des Documents</h2>
          <p>Validez les permissions d'absence et délivrez les certificats de scolarité.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Nouvelle Demande</button>
      </header>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
           <div className="stat-card glass-panel" style={{ padding: '20px', borderRadius: '12px', borderLeft: pendingCount > 0 ? '4px solid #ef4444' : '4px solid #22c55e' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Requêtes en attente</h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{pendingCount}</div>
           </div>
           <div className="stat-card glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Certificats délivrés</h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{documents.filter((d:any) => d.type === 'CERTIFICATE' && d.status === 'APPROVED').length}</div>
           </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(filter => (
             <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '20px' }}
             >
                {filter === 'ALL' ? 'Toutes' : filter === 'PENDING' ? 'En Attente' : filter === 'APPROVED' ? 'Approuvées' : 'Rejetées'}
             </button>
          ))}
      </div>

      <div className="table-container glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Type</th>
              <th style={{ padding: '16px' }}>Élève</th>
              <th style={{ padding: '16px' }}>Motif / Détails</th>
              <th style={{ padding: '16px' }}>Date demande</th>
              <th style={{ padding: '16px' }}>Statut</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
              {displayedDocs.map((doc: any) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                       <td style={{ padding: '16px', fontWeight: 'bold' }}>
                           {doc.type === 'CERTIFICATE' ? '📄 Certificat' : '🕒 Permission'}
                       </td>
                       <td style={{ padding: '16px' }}>{doc.studentName}</td>
                       <td style={{ padding: '16px', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.reason}</td>
                       <td style={{ padding: '16px', fontSize: '14px' }}>
                           {new Date(doc.requestDate).toLocaleDateString('fr-FR')}
                       </td>
                       <td style={{ padding: '16px' }}>
                           <span className="badge" style={{ 
                               padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                               background: doc.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' : doc.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                               color: doc.status === 'APPROVED' ? '#4ade80' : doc.status === 'REJECTED' ? '#ef4444' : '#fbbf24'
                           }}>
                               {doc.status === 'APPROVED' ? 'Approuvé' : doc.status === 'REJECTED' ? 'Rejeté' : 'En Attente'}
                           </span>
                       </td>
                       <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                           {doc.status === 'PENDING' && (
                               <>
                                 <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '16px', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }} title="Approuver" onClick={() => updateStatus({id: doc.id, status: 'APPROVED'})}>✓</button>
                                 <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '16px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} title="Rejeter" onClick={() => updateStatus({id: doc.id, status: 'REJECTED'})}>✗</button>
                               </>
                           )}
                           {doc.status === 'APPROVED' && doc.type === 'CERTIFICATE' && (
                               <button 
                                 className="btn-secondary" 
                                 style={{ padding: '6px 12px', fontSize: '12px' }}
                                 onClick={() => setDocumentToPrint(doc)}
                               >🖨️ Imprimer</button>
                           )}
                       </td>
                  </tr>
              ))}
              {displayedDocs.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center' }}>Aucun document.</td></tr>
              )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '500px', maxWidth: '90%', padding: '24px' }}>
                  <h3>Initier une Demande</h3>
                  
                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Type de requête</label>
                      <select 
                        value={newRequest.type}
                        onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                        style={{ width: '100%', padding: '10px', background: 'var(--surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}
                      >
                          <option value="PERMISSION">Demande de Permission (Absence)</option>
                          <option value="CERTIFICATE">Certificat de Scolarité</option>
                      </select>
                  </div>

                  {['SUPER_ADMIN', 'ADMIN_ECOLE'].includes(user?.role || '') && (
                    <div className="input-group" style={{ marginTop: '16px' }}>
                        <label>ID / Matricule de l'élève</label>
                        <input 
                            type="text" 
                            placeholder="Ex: ST-001"
                            style={{ width: '100%' }}
                            value={newRequest.studentId}
                            onChange={(e) => setNewRequest({...newRequest, studentId: e.target.value})}
                        />
                    </div>
                  )}

                   <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Motif de la demande</label>
                      <textarea 
                        placeholder="Expliquez la raison..." 
                        style={{ width: '100%', minHeight: '80px', padding: '12px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        value={newRequest.reason}
                        onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                      ></textarea>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Annuler</button>
                      <button className="btn-primary" onClick={handleSubmit}>Soumettre</button>
                  </div>
              </div>
          </div>
      )}

      {/* Certificate Print Modal */}
      {documentToPrint && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content" style={{ 
                  width: '800px', 
                  padding: '60px', 
                  background: 'white', 
                  color: 'black', 
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  fontFamily: '"Times New Roman", Times, serif',
                  position: 'relative'
              }}>
                  <div style={{ border: '2px solid #000', padding: '40px', height: '100%', position: 'relative' }}>
                      {/* Decorative corner borders */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', width: '40px', height: '40px', borderTop: '4px solid #000', borderLeft: '4px solid #000' }}></div>
                      <div style={{ position: 'absolute', top: '10px', right: '10px', width: '40px', height: '40px', borderTop: '4px solid #000', borderRight: '4px solid #000' }}></div>
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '40px', height: '40px', borderBottom: '4px solid #000', borderLeft: '4px solid #000' }}></div>
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '40px', height: '40px', borderBottom: '4px solid #000', borderRight: '4px solid #000' }}></div>

                      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>RÉPUBLIQUE DU MALI</h2>
                          <p style={{ margin: '4px 0', fontSize: '12px', fontStyle: 'italic' }}>Un Peuple - Un But - Une Foi</p>
                          <div style={{ margin: '20px auto', width: '60px', height: '60px', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>LOGO</div>
                          <h3 style={{ margin: '10px 0', fontSize: '18px', textDecoration: 'underline' }}>CERTIFICAT DE FRÉQUENTATION</h3>
                      </header>

                      <div style={{ fontSize: '18px', lineHeight: '2', textAlign: 'justify' }}>
                          <p>
                              Je soussigné, <strong>Le Chef d'établissement</strong>, certifie par la présente que l'élève :
                          </p>
                          <p style={{ textAlign: 'center', fontSize: '22px', margin: '20px 0' }}>
                              <strong>{documentToPrint.studentName.toUpperCase()}</strong>
                          </p>
                          <p>
                              est régulièrement inscrit(e) et fréquente les cours dans notre établissement pour le compte de l'année scolaire en cours.
                          </p>
                          <p>
                              En foi de quoi, ce certificat lui est délivré pour servir et valoir ce que de droit.
                          </p>
                      </div>

                      <footer style={{ marginTop: '60px', textAlign: 'right' }}>
                          <p>Fait à Bamako, le {new Date().toLocaleDateString('fr-FR')}</p>
                          <div style={{ marginTop: '40px' }}>
                              <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Le Principal / Directeur</p>
                              <div style={{ height: '80px' }}></div>
                              <p style={{ fontSize: '12px', color: '#666' }}>(Signature et Cachet de l'école)</p>
                          </div>
                      </footer>
                  </div>

                  <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
                      <button className="btn-secondary" style={{ color: 'black', border: '1px solid #ccc' }} onClick={() => setDocumentToPrint(null)}>Fermer</button>
                      <button className="btn-primary" onClick={() => window.print()}>🖨️ Imprimer le Certificat</button>
                  </div>
              </div>
          </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body * { visibility: hidden; }
          .modal-overlay, .modal-overlay * { visibility: visible; }
          .modal-overlay { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; background: white !important; }
          .no-print { display: none !important; }
          .modal-content { box-shadow: none !important; width: 100% !important; padding: 20mm !important; }
        }
      `}} />
    </div>
  );
};

export default Documents;
