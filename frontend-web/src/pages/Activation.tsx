import React, { useState } from 'react';
import { api } from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';

const Activation = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState('');

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');
    try {
      await api.post('/registration/activate', { licenseKey });
      setStatus('SUCCESS');
      // Redirect to login after successful activation
      setTimeout(() => {
          window.location.href = '/#/admin/login';
      }, 3000);
    } catch (err: any) {
      setStatus('ERROR');
      setError(err.response?.data?.message || 'Clé de licence invalide ou déjà utilisée.');
    }
  };

  return (
    <div className="login-container">
      <div className="glass-panel login-box" style={{ maxWidth: '500px' }}>
        <div className="login-header">
           <div style={{ position: 'absolute', top: 20, right: 20 }}>
               <ThemeToggle />
           </div>
           <h2>Activation du logiciel</h2>
           <p style={{ margin: '10px 0' }}>
             Après paiement du montant de clé en FCFA (Annuel) ou (Mensuel), vous recevez une clé unique. Entrez-la pour débloquer toutes les fonctionnalités.
           </p>
        </div>

        {status === 'SUCCESS' ? (
          <div className="alert-success" style={{ textAlign: 'center', padding: '20px' }}>
             <p style={{ fontSize: '18px' }}>Licence activée avec succès ! Redirection en cours...</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleActivate}>
            {status === 'ERROR' && (
              <div className="alert-error" style={{ marginBottom: '16px' }}>
                 {error}
              </div>
            )}

            <div className="input-group">
              <label>Clé de licence</label>
              <input 
                type="text" 
                placeholder="CODE-XXXX-XXXX-XXXX"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                style={{ textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold', fontSize: '18px' }}
                required 
              />
            </div>

            <button type="submit" className="btn-primary" disabled={status === 'LOADING'} style={{ marginTop: '10px' }}>
               {status === 'LOADING' ? 'Activation...' : 'Activer maintenant'}
            </button>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
               <p style={{ opacity: 0.7, marginBottom: '10px' }}>💬 Besoin d'aide ou d'une clé ?</p>
               <a 
                 href="https://wa.me/22370000000" // Placeholder WhatsApp
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="btn-secondary"
                 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', backgroundColor: '#25D366', color: 'white', border: 'none' }}
               >
                 Contactez le support WhatsApp
               </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Activation;
