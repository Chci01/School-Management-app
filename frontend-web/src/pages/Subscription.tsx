import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { CreditCard, Phone, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

const Subscription = () => {
  const { user } = useAuth();
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const contactPhone = '+22374480652';

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!user || (!user.schoolId && user.role !== 'SUPER_ADMIN')) {
      setMessage({ text: 'Erreur: École introuvable.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(`/schools/${user.schoolId}/activate-license`, { licenseKey });
      if (data.success) {
        setMessage({ text: 'Licence activée avec succès !', type: 'success' });
        // The license is verified! Let's reload to reset the interceptors and let the user access the dashboard.
        setTimeout(() => {
          window.location.href = '#/dashboard';
          window.location.reload();
        }, 1500);
      } else {
        setMessage({ text: data.message || 'Clé de licence invalide.', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || err.message || 'Erreur lors de l\'activation.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard size={32} color="var(--primary)" /> Abonnement & Licence</h1>
        <p className="text-secondary">Renouvelez l'accès de votre établissement à KalanSira.</p>
      </div>

      {user?.role !== 'SCHOOL_ADMIN' && user?.role !== 'SUPER_ADMIN' ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--warning)" style={{ marginBottom: '16px' }} />
          <h3>Accès Restreint</h3>
          <p>Seul l'administration de l'école peut gérer la licence.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(250px, 1fr)', gap: '24px' }}>
          
          {/* Activation Form */}
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
               Activer une nouvelle licence
            </h3>
            
            {message.text && (
              <div 
                 style={{ 
                   padding: '12px', 
                   borderRadius: '8px', 
                   marginBottom: '20px', 
                   backgroundColor: message.type === 'error' ? 'rgba(213, 96, 98, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                   color: message.type === 'error' ? 'var(--danger)' : 'var(--secondary)',
                   display: 'flex', alignItems: 'center', gap: '8px'
                 }}
              >
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleActivate}>
              <div className="input-group">
                <label>Clé de Licence (Voucher)</label>
                <input 
                  type="text" 
                  placeholder="EX: KALAN-XXXX-XXXX" 
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  required
                  style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.2rem', padding: '16px' }}
                />
              </div>
              
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '1rem', marginTop: '10px' }}>
                {loading ? 'Validation en cours...' : 'Activer l\'abonnement'}
              </button>
            </form>
          </div>

          {/* Assistance Section */}
          <div className="glass-panel" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--primary)' }}>
             <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Besoin d'Assistance ?</h4>
             <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: 'var(--text-secondary)' }}>
                Pour obtenir une nouvelle clé ou si vous avez un problème avec la plateforme, contactez-nous directement.
             </p>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href={`https://wa.me/${contactPhone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#25D366', color: 'white', border: 'none' }}>
                     <MessageSquare size={18} /> Discuter sur WhatsApp
                  </button>
                </a>
                
                <a href={`tel:${contactPhone}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                     <Phone size={18} /> Appeler (+223 74 48 06 52)
                  </button>
                </a>

                <a href={`sms:${contactPhone}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'transparent' }}>
                     <MessageSquare size={18} /> Envoyer un SMS
                  </button>
                </a>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Subscription;
