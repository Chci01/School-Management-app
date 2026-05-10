import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  CreditCard,
  FileText,
  Phone,
  HelpCircle,
  Key,
  Moon,
  Sun,
  Download,
  CheckCircle,
  XCircle,
  Mail,
  ShieldCheck,
  Zap,
  LifeBuoy,
  MessageSquare,
  Globe,
  Lock,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  const [licenseKey, setLicenseKey] = useState('');
  const [activating, setActivating] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.schoolId) {
      fetchSchoolData();
    }
  }, [user?.schoolId]);

  const fetchSchoolData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/schools/${user?.schoolId}`);
      setSchoolData(response.data);
    } catch (error) {
      console.error('Error fetching school data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey) return;

    setActivating(true);
    setMessage(null);

    try {
      const response = await api.post(`/schools/${user?.schoolId}/activate-license`, {
        licenseKey: licenseKey
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Licence activée avec succès !' });
        setLicenseKey('');
        fetchSchoolData();
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Erreur lors de l\'activation.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur de connexion au serveur.' });
    } finally {
      setActivating(false);
    }
  };

  const handleRequestLicense = async () => {
    setRequesting(true);
    setMessage(null);
    try {
      await api.post(`/schools/${user?.schoolId}/request-license`, {});
      setMessage({ type: 'success', text: 'Demande de licence envoyée. Un agent vous contactera sous peu.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Échec de l\'envoi de la demande.' });
    } finally {
      setRequesting(false);
    }
  };

  const isExpired = schoolData?.licenseExpiresAt ? new Date(schoolData.licenseExpiresAt) < new Date() : true;
  const expirationDate = schoolData?.licenseExpiresAt ? new Date(schoolData.licenseExpiresAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'Non définie';

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="spinner">Chargement des paramètres...</div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'var(--primary)', borderRadius: '16px', color: 'white' }}>
            <SettingsIcon size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Configuration Système</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Gérez l'établissement, les abonnements et préférences</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Exporter les données
          </button>
          <button className="btn-primary" onClick={fetchSchoolData} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Actualiser
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

        {/* SECTION 1: ABONNEMENT ET STATUT */}
        <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', opacity: 0.1 }}>
            <CreditCard size={100} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <CreditCard color="var(--primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Abonnement & Statut</h3>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '20px',
            background: isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${isExpired ? '#ef4444' : '#22c55e'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: isExpired ? '#ef4444' : '#22c55e',
                color: 'white'
              }}>
                {isExpired ? <XCircle size={28} /> : <CheckCircle size={28} />}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: isExpired ? '#ef4444' : '#22c55e' }}>
                  {isExpired ? 'Licence Expirée' : 'Licence Active'}
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  Expire le : <strong>{expirationDate}</strong>
                </div>
              </div>
            </div>
            {isExpired && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#ef4444' }}>
                Votre accès est actuellement limité. Veuillez activer une nouvelle clé de licence.
              </p>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 600 }}>Plans d'abonnement disponibles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Plan Standard (Trimestre)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Idéal pour les petites écoles</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>40,000 FCFA</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--primary)', background: 'rgba(59, 130, 246, 0.05)' }}>
                <div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Plan Premium (Annuel) <span style={{ fontSize: '10px', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>POPULAIRE</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Complet avec support prioritaire</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>150,000 FCFA</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Plan Illimité</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Accès à toutes les fonctionnalités avancées</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>1,000,000 FCFA</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: ACTIVATION & DEMANDE */}
        <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Key color="var(--primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Activation de Licence</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Entrez votre clé d'activation reçue après votre paiement ou demandez une nouvelle licence.
          </p>

          <form onSubmit={handleActivateLicense} style={{ marginBottom: '32px' }}>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Clé de Licence</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="KALAN-XXXX-XXXX"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '1rem', letterSpacing: '2px', fontWeight: 600 }}
                />
                <ShieldCheck size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={activating || !licenseKey}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 700 }}
            >
              {activating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
              {activating ? 'Activation...' : 'Activer maintenant'}
            </button>
          </form>

          <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>Besoin d'une nouvelle licence ?</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Si vous n'avez pas de clé ou si vous souhaitez renouveler votre abonnement, envoyez une demande à notre équipe commerciale.
            </p>
            <button
              onClick={handleRequestLicense}
              className="btn-secondary"
              disabled={requesting}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              {requesting ? <RefreshCw className="animate-spin" size={18} /> : <Mail size={18} />}
              {requesting ? 'Envoi...' : 'Demander une licence'}
            </button>
          </div>

          {message && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? '#22c55e' : '#ef4444',
              border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`
            }}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message.text}</span>
            </div>
          )}
        </section>

        {/* SECTION 3: SUPPORT & DOCUMENTATION */}
        <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <LifeBuoy color="var(--primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Aide & Manuel</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              className="glass-panel"
              onClick={() => window.open('/manuel_utilisation_kalansira.pdf', '_blank')}
              style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'transform 0.2s' }}
            >
              <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                <FileText size={32} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Manuel d'utilisation</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Guide complet au format PDF (12 Mo)</div>
              </div>
              <Download size={24} color="var(--text-muted)" />
            </div>

            <div style={{ marginTop: '12px' }}>
              <h4 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 600 }}>Contacts du Support Technique</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                  <Phone size={24} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Appeler</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+223 70 22 46 91</div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                  <MessageSquare size={24} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>WhatsApp</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+223 74 48 06 52</div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                  <Mail size={24} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Email</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>support@kalansira.ml</div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                  <Globe size={24} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Site Web</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>www.kalansira.ml</div>
                </div>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
              <HelpCircle size={18} /> Ouvrir le centre d'aide
            </button>
          </div>
        </section>

        {/* SECTION 4: APPARENCE ET PREFERENCES */}
        <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Sun color="var(--primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Apparence & Système</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Thème de l'interface</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Basculer entre mode clair et sombre</div>
              </div>
              <button
                onClick={toggleTheme}
                style={{
                  width: '60px',
                  height: '32px',
                  borderRadius: '20px',
                  background: theme === 'dark' ? 'var(--primary)' : '#cbd5e1',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: '4px',
                  left: theme === 'dark' ? '32px' : '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {theme === 'dark' ? <Moon size={14} color="var(--primary)" /> : <Sun size={14} color="#f59e0b" />}
                </div>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Langue par défaut</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sélectionnez la langue du système</div>
              </div>
              <select style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                <option value="fr">Français (Mali)</option>
                <option value="en">English</option>
                <option value="bm">Bambara</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Notifications</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Activer les alertes sonores</div>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
            </div>

            <div style={{ marginTop: '20px', padding: '20px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: '#ef4444' }}>
                <Lock size={20} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>Zone de Danger</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                La réinitialisation de l'établissement supprimera toutes les données académiques. Cette action est irréversible.
              </p>
              <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                Réinitialiser l'établissement
              </button>
            </div>
          </div>
        </section>

      </div>

      <footer style={{ marginTop: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>KalanSira Mali v2.4.0 • Tous droits réservés © 2026</p>
      </footer>
    </div>
  );
};

export default Settings;


