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
  RefreshCw,
  Droplets,
  Leaf,
  ShoppingCart,
  Loader
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const PLANS = [
  { id: 'standard', label: 'Standard', price: 40000, desc: '1 école, jusqu\'à 300 élèves' },
  { id: 'premium',  label: 'Premium',  price: 150000, desc: 'Multi-classes, rapports avancés' },
  { id: 'unlimited', label: 'Illimité', price: 1000000, desc: 'Illimité — tout inclus' },
];

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const [licenseKey, setLicenseKey] = useState('');
  const [activating, setActivating] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // LigdiCash
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]); // Premium par défaut
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Guide d'utilisation
  const [openGuide, setOpenGuide] = useState<number | null>(null);

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

  const handleRequestLicense = () => {
    const schoolName = schoolData?.name || 'Notre établissement';
    const messageText = `Bonjour, ${schoolName} sollicite une licence pour utiliser Kalansira School Management. Nous aimerions échanger à ce sujet.`;
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/22370224691?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // ─── Personnalisation Etablissement ───────────────────────────────────────
  const [updatingSchool, setUpdatingSchool] = useState(false);
  const [customLogo, setCustomLogo] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customAddress, setCustomAddress] = useState('');

  useEffect(() => {
    if (schoolData) {
      setCustomLogo(schoolData.logo || '');
      setCustomPhone(schoolData.phone || '');
      setCustomAddress(schoolData.address || '');
    }
  }, [schoolData]);

  const handleUpdateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSchool(true);
    setMessage(null);
    try {
      await api.patch(`/schools/${user?.schoolId}`, {
        logo: customLogo,
        phone: customPhone,
        address: customAddress,
      });
      setMessage({ type: 'success', text: 'Paramètres de l\'établissement mis à jour.' });
      fetchSchoolData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Échec de la mise à jour.' });
    } finally {
      setUpdatingSchool(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  // ─── LigdiCash ────────────────────────────────────────────────────────────
  const lancerPaiementLigdiCash = async () => {
    setPaymentLoading(true);
    setPaymentMessage(null);

    // Ouvrir le popup immédiatement (synchrone) pour éviter le blocage navigateur
    const popup = window.open('about:blank', 'paiement-ligdicash', 'width=520,height=720');

    try {
      const res = await api.post('/payments/ligdicash/initiate', {
        studentId: user?.id || user?.uid,
        amount: selectedPlan.price,
        tranche: `Abonnement ${selectedPlan.label}`,
        description: `Licence Kalansira — Plan ${selectedPlan.label}`,
        return_url: `${window.location.origin}/#/settings?payment=success`,
        cancel_url: `${window.location.origin}/#/settings?payment=cancel`,
        callback_url: `https://school-management-app-6pkq.onrender.com/payments/ligdicash/webhook`,
      });

      const data = res.data;

      if (data.success && data.url) {
        if (popup) popup.location.href = data.url;

        // Sondage : vérifier la fermeture du popup pour confirmer
        const pollTimer = setInterval(async () => {
          if (popup?.closed) {
            clearInterval(pollTimer);
            setPaymentLoading(false);
            if (data.token) {
              try {
                const confirm = await api.get(`/payments/ligdicash/confirm/${data.token}`);
                if (confirm.data.success && confirm.data.status === 'completed') {
                  setPaymentMessage({ type: 'success', text: '✅ Paiement validé ! Votre licence a été renouvelée.' });
                  fetchSchoolData();
                } else {
                  setPaymentMessage({ type: 'error', text: 'Paiement non confirmé ou annulé. Réessayez.' });
                }
              } catch { 
                setPaymentMessage({ type: 'error', text: 'Erreur lors de la confirmation du paiement.' }); 
              }
            } else {
              setPaymentMessage({ type: 'success', text: '✅ Paiement initié. En attente de confirmation LigdiCash.' });
            }
          }
        }, 1000);
      } else {
        if (popup) popup.close();
        setPaymentMessage({ type: 'error', text: data.error || 'Échec de l\'initialisation du paiement.' });
        setPaymentLoading(false);
      }
    } catch (err: any) {
      if (popup) popup.close();
      setPaymentMessage({ type: 'error', text: err.response?.data?.message || 'Erreur de connexion au serveur.' });
      setPaymentLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const isExpired = schoolData?.licenseExpiresAt ? new Date(schoolData.licenseExpiresAt) < new Date() : true;
  const expirationDate = schoolData?.licenseExpiresAt ? new Date(schoolData.licenseExpiresAt).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : t('settings.not_defined');

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
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{t('settings.title')}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t('settings.subtitle')}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> {t('settings.export')}
          </button>
          <button className="btn-primary" onClick={fetchSchoolData} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> {t('settings.refresh')}
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
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{t('settings.subscription')}</h3>
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
                  {isExpired ? t('settings.license_expired') : t('settings.license_active')}
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  {t('settings.expires_on')} <strong>{expirationDate}</strong>
                </div>
              </div>
            </div>
            {isExpired && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#ef4444' }}>
                {t('settings.limited_access')}
              </p>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 600 }}>{t('settings.available_plans')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t('settings.plan_standard')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('settings.plan_standard_desc')}</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>40,000 FCFA</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--primary)', background: 'rgba(59, 130, 246, 0.05)' }}>
                <div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t('settings.plan_premium')} <span style={{ fontSize: '10px', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>{t('settings.popular')}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('settings.plan_premium_desc')}</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>150,000 FCFA</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t('settings.plan_unlimited')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('settings.plan_unlimited_desc')}</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>1,000,000 FCFA</div>
              </div>
            </div>
          </div>

          {/* ─── BLOC PAIEMENT LIGDICASH ─────────────────────────────── */}
          <div style={{
            marginTop: '32px',
            padding: '28px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: '12px', color: 'white' }}>
                <ShoppingCart size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Payer avec LigdiCash</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Mobile Money — Orange, Moov, Wave…</div>
              </div>
            </div>

            {/* Sélecteur de plan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {PLANS.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: `2px solid ${selectedPlan.id === plan.id ? '#6366f1' : 'var(--border)'}`,
                    background: selectedPlan.id === plan.id ? 'rgba(99,102,241,0.1)' : 'var(--surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {plan.label}
                      {plan.id === 'premium' && (
                        <span style={{ fontSize: '10px', background: '#6366f1', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>Populaire</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{plan.desc}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#6366f1', fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
                    {plan.price.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton paiement */}
            <button
              onClick={lancerPaiementLigdiCash}
              disabled={paymentLoading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                cursor: paymentLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                opacity: paymentLoading ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {paymentLoading ? <Loader size={20} className="animate-spin" /> : <Zap size={20} />}
              {paymentLoading
                ? 'Ouverture du paiement...'
                : `Payer ${selectedPlan.price.toLocaleString('fr-FR')} FCFA — ${selectedPlan.label}`
              }
            </button>

            {/* Message retour paiement */}
            {paymentMessage && (
              <div style={{
                marginTop: '16px',
                padding: '14px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: paymentMessage.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                color: paymentMessage.type === 'success' ? '#22c55e' : '#ef4444',
                border: `1px solid ${paymentMessage.type === 'success' ? '#22c55e' : '#ef4444'}`,
                fontSize: '0.9rem',
                fontWeight: 500,
              }}>
                {paymentMessage.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                {paymentMessage.text}
              </div>
            )}
          </div>
          {/* ─────────────────────────────────────────────────────────── */}

        </section>

        {/* SECTION 2: ACTIVATION & DEMANDE */}
        <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Key color="var(--primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{t('settings.license_activation')}</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {t('settings.license_desc')}
          </p>

          <form onSubmit={handleActivateLicense} style={{ marginBottom: '32px' }}>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>{t('settings.license_key')}</label>
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
              {activating ? t('settings.activating') : t('settings.activate_btn')}
            </button>
          </form>

          <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>{t('settings.need_license')}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {t('settings.need_license_desc')}
            </p>
            <button
              onClick={handleRequestLicense}
              className="btn-secondary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              <Mail size={18} />
              {t('settings.request_license')}
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

        {/* SECTION PERSONNALISATION */}
        <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Globe color="var(--primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Personnalisation de l'établissement</h3>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Modifiez ici le logo, le téléphone et l'adresse de votre école. Ces informations seront visibles sur toutes les interfaces (Mobile, Web, Desktop) par vos élèves et enseignants.
          </p>

          <form onSubmit={handleUpdateSchool} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>URL du Logo</label>
              <input
                type="text"
                placeholder="https://mon-site.com/logo.png"
                value={customLogo}
                onChange={(e) => setCustomLogo(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Téléphone de contact</label>
              <input
                type="text"
                placeholder="+223 XXXXXXXX"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Adresse physique</label>
              <input
                type="text"
                placeholder="Ex: Bamako, ACI 2000"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={updatingSchool}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 700, marginTop: '16px' }}
            >
              {updatingSchool ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              Enregistrer les modifications
            </button>
          </form>
        </section>

        {/* SECTION 3: SUPPORT & DOCUMENTATION */}
        <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <LifeBuoy color="var(--primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{t('settings.help_manual')}</h3>
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
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t('settings.manual_title')}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('settings.manual_desc')}</div>
              </div>
              <Download size={24} color="var(--text-muted)" />
            </div>

            <div style={{ marginTop: '12px' }}>
              <h4 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 600 }}>{t('settings.support_contacts')}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                  <Phone size={24} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('settings.call')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+223 70 22 46 91</div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                  <MessageSquare size={24} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('settings.whatsapp')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+223 74 48 06 52</div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                  <Mail size={24} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('settings.email')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>support@kalansira.ml</div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                  <Globe size={24} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('settings.website')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>www.kalansira.ml</div>
                </div>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
              <HelpCircle size={18} /> {t('settings.open_help_center')}
            </button>

            {/* ─── GUIDE D'UTILISATION INTERACTIF ─── */}
            <div style={{ marginTop: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ padding: '8px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', color: 'var(--primary)' }}>
                  <HelpCircle size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>Guide d'utilisation rapide</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cliquez sur une section pour la développer</div>
                </div>
              </div>

              {[
                {
                  icon: '🏫',
                  title: 'Comment créer une école ?',
                  role: 'Super Admin',
                  steps: [
                    "Connectez-vous avec votre compte Super Admin (matricule : SUPER_ADMIN_01).",
                    "Dans le menu, allez dans la section « Écoles ».",
                    "Cliquez sur « Nouvelle école » et remplissez le formulaire.",
                    "Assignez un Administrateur d'école après création.",
                  ],
                },
                {
                  icon: '👨‍🎓',
                  title: 'Comment inscrire un élève ?',
                  role: 'Admin École',
                  steps: [
                    "Connectez-vous en tant qu'Administrateur.",
                    "Allez dans « Élèves » puis cliquez sur « + Nouvel élève ».",
                    "Renseignez les informations (nom, classe, parent, etc.).",
                    "Sauvegardez et imprimez la fiche si nécessaire.",
                  ],
                },
                {
                  icon: '📝',
                  title: 'Comment saisir les notes ?',
                  role: 'Enseignant',
                  steps: [
                    "Connectez-vous avec votre compte Enseignant.",
                    "Allez dans « Notes » et sélectionnez votre matière et classe.",
                    "Cliquez sur chaque élève pour entrer sa note.",
                    "Validez pour enregistrer — les parents peuvent consulter en temps réel.",
                  ],
                },
                {
                  icon: '💳',
                  title: "Comment payer l'abonnement ?",
                  role: 'Admin École',
                  steps: [
                    "Allez dans Paramètres → section « Abonnement ».",
                    "Sélectionnez votre plan (Standard, Premium ou Illimité).",
                    "Cliquez sur « Payer avec LigdiCash ».",
                    "Une fenêtre popup s'ouvre : payez via Orange Money, Moov ou Wave.",
                    "La licence est activée automatiquement après confirmation.",
                  ],
                },
                {
                  icon: '👨‍👩‍👧',
                  title: 'Comment suivre mon enfant (Parent) ?',
                  role: 'Parent',
                  steps: [
                    "Connectez-vous avec vos identifiants reçus de l'école.",
                    "Le tableau de bord affiche les absences, notes et bulletins.",
                    "Allez dans « Paiements » pour voir les frais de scolarité.",
                    "Consultez les actualités de l'école dans « Actualités ».",
                  ],
                },
                {
                  icon: '🔑',
                  title: 'Mot de passe oublié ?',
                  role: 'Tous',
                  steps: [
                    "Sur la page de connexion, cliquez sur « Mot de passe oublié ».",
                    "Entrez votre matricule ou email.",
                    "Contactez votre administrateur si vous n'avez pas accès à l'email de récupération.",
                    "L'administrateur peut réinitialiser votre mot de passe depuis « Gestion des utilisateurs ».",
                  ],
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '10px',
                    borderRadius: '14px',
                    border: `1px solid ${openGuide === idx ? 'var(--primary)' : 'var(--border)'}`,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <button
                    onClick={() => setOpenGuide(openGuide === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: openGuide === idx ? 'rgba(59,130,246,0.07)' : 'var(--surface)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: 'var(--text)',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>👤 {item.role}</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '1.2rem',
                      color: 'var(--primary)',
                      transform: openGuide === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s',
                      display: 'inline-block',
                    }}>▾</span>
                  </button>

                  {openGuide === idx && (
                    <div style={{ padding: '0 18px 18px 18px', background: 'var(--surface)' }}>
                      <ol style={{ margin: '12px 0 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {item.steps.map((step, si) => (
                          <li key={si} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* ─────────────────────────────────────────────────── */}

          </div>
        </section>

        {/* SECTION 4: APPARENCE ET PREFERENCES */}
        <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Sun color="var(--primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{t('settings.appearance_system')}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{t('settings.theme')}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('settings.theme_desc')}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setTheme('light')}
                  title={t('theme.light')}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme === 'light' ? 'var(--primary)' : 'var(--surface)', border: `1px solid ${theme === 'light' ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: theme === 'light' ? 'white' : 'var(--text)' }}
                >
                  <Sun size={18} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  title={t('theme.dark')}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme === 'dark' ? 'var(--primary)' : 'var(--surface)', border: `1px solid ${theme === 'dark' ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: theme === 'dark' ? 'white' : 'var(--text)' }}
                >
                  <Moon size={18} />
                </button>
                <button
                  onClick={() => setTheme('ocean')}
                  title={t('theme.ocean')}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme === 'ocean' ? 'var(--primary)' : 'var(--surface)', border: `1px solid ${theme === 'ocean' ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: theme === 'ocean' ? 'white' : 'var(--text)' }}
                >
                  <Droplets size={18} />
                </button>
                <button
                  onClick={() => setTheme('nature')}
                  title={t('theme.nature')}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme === 'nature' ? 'var(--primary)' : 'var(--surface)', border: `1px solid ${theme === 'nature' ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: theme === 'nature' ? 'white' : 'var(--text)' }}
                >
                  <Leaf size={18} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{t('settings.language')}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('settings.language_desc')}</div>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
              >
                <option value="fr">{t('lang.fr')}</option>
                <option value="en">{t('lang.en')}</option>
                <option value="bm">{t('lang.bm')}</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{t('settings.notifications')}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('settings.notifications_desc')}</div>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
            </div>

            <div style={{ marginTop: '20px', padding: '20px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: '#ef4444' }}>
                <Lock size={20} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>{t('settings.danger_zone')}</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {t('settings.danger_desc')}
              </p>
              <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                {t('settings.reset_school')}
              </button>
            </div>
          </div>
        </section>

      </div>

      <footer style={{ marginTop: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>{t('settings.footer')}</p>
      </footer>
    </div>
  );
};

export default Settings;
