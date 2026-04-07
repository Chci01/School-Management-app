import React, { useState } from 'react';
import { api } from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../hooks/useAuth';

const Activation = () => {
  const { currentSchoolId } = useAuth();
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState('');

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');
    try {
      await api.post('/registration/activate', { 
          licenseKey,
          schoolId: currentSchoolId 
      });
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
             Après paiement, vous recevrez une clé unique. Entrez-la ci-dessous pour activer votre abonnement.
           </p>
           <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', margin: '12px 0' }}>
             <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', background: '#6366f122', color: '#6366f1', fontWeight: 600 }}>Mensuel · 15 000 FCFA</span>
             <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', background: '#f59e0b22', color: '#f59e0b', fontWeight: 600 }}>Annuel · 150 000 FCFA</span>
             <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', background: '#10b98122', color: '#10b981', fontWeight: 600 }}>À Vie · 500 000 FCFA</span>
           </div>
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
                 href="https://wa.me/22374480652"
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
