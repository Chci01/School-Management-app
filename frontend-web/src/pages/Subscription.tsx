import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import {
  CreditCard, Phone, MessageSquare, AlertTriangle, CheckCircle,
  Zap, Calendar, Star, Infinity, Clock, Gift,
} from 'lucide-react';

const contactPhone = '+22374480652';
const whatsappUrl = `https://wa.me/${contactPhone.replace('+', '')}`;

const PLANS = [
  {
    id: 'trial',
    label: 'Essai',
    price: 'Gratuit',
    subtitle: '7 jours',
    description: 'Démarrez immédiatement. Aucune carte requise.',
    icon: <Gift size={28} />,
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b22, #94a3b822)',
    borderColor: '#64748b',
    features: ['Accès complet 7 jours', 'Gestion élèves & notes', 'Support communautaire'],
    cta: 'Inclus à l\'inscription',
    ctaDisabled: true,
  },
  {
    id: 'monthly',
    label: 'Mensuel',
    price: '15 000 FCFA',
    subtitle: '/ mois',
    description: 'Idéal pour commencer et tester sur la durée.',
    icon: <Calendar size={28} />,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f122, #818cf822)',
    borderColor: '#6366f1',
    features: ['Toutes les fonctionnalités', 'Mises à jour incluses', 'Support WhatsApp prioritaire'],
    cta: 'Contacter le support',
    ctaDisabled: false,
  },
  {
    id: 'yearly',
    label: 'Annuel',
    price: '150 000 FCFA',
    subtitle: '/ an',
    badge: 'Économisez 30 000 FCFA',
    description: 'Le meilleur rapport qualité-prix pour une école.',
    icon: <Star size={28} />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b22, #fcd34d22)',
    borderColor: '#f59e0b',
    features: ['Toutes les fonctionnalités', 'Mises à jour incluses', 'Support WhatsApp dédié', '2 mois offerts vs mensuel'],
    recommended: true,
    cta: 'Contacter le support',
    ctaDisabled: false,
  },
  {
    id: 'lifetime',
    label: 'À Vie',
    price: '500 000 FCFA',
    subtitle: 'paiement unique',
    description: 'Investissement ultime, accès illimité pour toujours.',
    icon: <Infinity size={28} />,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b98122, #34d39922)',
    borderColor: '#10b981',
    features: ['Accès à vie (~273 ans)', 'Toutes les mises à jour futures', 'Support premium', 'Aucun renouvellement jamais'],
    cta: 'Contacter le support',
    ctaDisabled: false,
  },
];

const Subscription = () => {
  const { user } = useAuth();
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

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

  if (user?.role !== 'ADMIN_ECOLE' && user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="page-content" style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--warning)" style={{ marginBottom: '16px' }} />
          <h3>Accès Restreint</h3>
          <p>Seul l'administration de l'école peut gérer la licence.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div className="page-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '2rem' }}>
          <CreditCard size={36} color="var(--primary)" /> Abonnement &amp; Licence
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.05rem', marginTop: '8px' }}>
          Choisissez le plan qui correspond à votre établissement et débloquez toutes les fonctionnalités.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '48px' }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              position: 'relative',
              borderRadius: '16px',
              border: `2px solid ${plan.recommended ? plan.borderColor : 'var(--surface-border)'}`,
              background: plan.recommended ? plan.gradient : 'var(--surface)',
              padding: '28px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: plan.recommended ? `0 0 24px ${plan.borderColor}33` : 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
          >
            {plan.recommended && (
              <div style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                background: plan.color, color: '#fff', padding: '4px 14px',
                borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
                ⭐ RECOMMANDÉ
              </div>
            )}

            {plan.badge && (
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                background: `${plan.color}22`, color: plan.color,
                padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
              }}>
                {plan.badge}
              </div>
            )}

            {/* Icon & Plan Name */}
            <div style={{ color: plan.color }}>{plan.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{plan.label}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{plan.description}</div>
            </div>

            {/* Price */}
            <div>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: plan.color }}>{plan.price}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{plan.subtitle}</span>
            </div>

            {/* Features */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} color={plan.color} />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            {plan.ctaDisabled ? (
              <div style={{
                padding: '10px', borderRadius: '10px', textAlign: 'center',
                background: 'var(--surface-border)', color: 'var(--text-secondary)',
                fontSize: '0.85rem', fontWeight: 500,
              }}>
                <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                {plan.cta}
              </div>
            ) : (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '10px', borderRadius: '10px', border: `1.5px solid ${plan.color}`,
                  background: 'transparent', color: plan.color, fontWeight: 600, cursor: 'pointer',
                  fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '6px', transition: 'background 0.2s ease',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${plan.color}18`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <MessageSquare size={15} />
                  {plan.cta}
                </button>
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Activation & Support */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(250px, 1fr)', gap: '24px' }}>

        {/* Activation Form */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} color="var(--primary)" /> Activer une clé de licence
          </h3>

          {message.text && (
            <div style={{
              padding: '12px', borderRadius: '8px', marginBottom: '20px',
              backgroundColor: message.type === 'error' ? 'rgba(213, 96, 98, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: message.type === 'error' ? 'var(--danger)' : 'var(--secondary)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleActivate}>
            <div className="input-group">
              <label>Clé de Licence (Voucher)</label>
              <input
                type="text"
                placeholder="KALAN-XXXX-XXXX"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                required
                style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.2rem', padding: '16px' }}
              />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '8px 0 16px 0' }}>
              Vous avez reçu cette clé après paiement. Contactez le support si vous n'en avez pas.
            </p>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
              {loading ? 'Validation en cours...' : 'Activer l\'abonnement'}
            </button>
          </form>
        </div>

        {/* Assistance */}
        <div className="glass-panel" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--primary)' }}>
          <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Besoin d'Assistance ?</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: 'var(--text-secondary)' }}>
            Pour obtenir une clé, renouveler votre abonnement, ou pour tout problème, contactez-nous directement.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
    </div>
  );
};

export default Subscription;
