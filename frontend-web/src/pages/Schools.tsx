import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Key } from 'lucide-react';

const Schools = () => {
  const [licenses, setLicenses] = useState<any[]>([]);

  const fetchLicenses = async () => {
    try {
      const { data } = await api.get('/schools/licenses');
      setLicenses(data);
    } catch (err) {
      console.error("Erreur chargement licences:", err);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);


  const handleGenerateKey = async () => {
    try {
      const { data } = await api.post('/schools/generate-license', { days: 365 });
      if (data.success) {
        alert(`Nouvelle Clé Générée: ${data.voucher.code}\nValable pour 365 jours.\nEnvoyez cette clé à l'école pour renouveler son abonnement.`);
        fetchLicenses();
      }
    } catch (err) {
      alert("Erreur lors de la génération de la clé");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1>Gestion des Écoles</h1>
          <p>Supervisez les établissements et leurs licences</p>
        </div>
        <div>
          <button className="btn-secondary" onClick={handleGenerateKey} style={{ marginRight: '10px' }}>Générer une Clé (365j)</button>
          <button className="btn-primary">+ Nouvelle École</button>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Licence</th>
              <th>Statut</th>
              <th>Élèves</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lycée Excellence</td>
              <td><span className="badge badge-success">Active</span></td>
              <td>En Ligne</td>
              <td>1240</td>
              <td><button className="btn-icon">Voir</button></td>
            </tr>
            <tr>
               <td>Groupe Scolaire Avenir</td>
               <td><span className="badge badge-warning">Expire Bientôt</span></td>
               <td>En Ligne</td>
               <td>850</td>
               <td><button className="btn-icon">Voir</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="page-header" style={{ marginTop: '40px', marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Key size={24} /> Clés de Licences Générées</h2>
      </div>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Code (Voucher)</th>
              <th>Validité</th>
              <th>Date de Création</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {licenses.length === 0 ? (
               <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Aucune clé générée pour le moment.</td></tr>
            ) : (
               licenses.map(lic => (
                 <tr key={lic.id}>
                   <td style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '1px' }}>{lic.code}</td>
                   <td>{lic.days} jours</td>
                   <td>{new Date(lic.createdAt).toLocaleDateString('fr-FR')}</td>
                   <td>
                     {lic.isUsed ? (
                        <span className="badge badge-danger">Utilisée</span>
                     ) : (
                        <span className="badge badge-success">Disponible</span>
                     )}
                   </td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schools;
