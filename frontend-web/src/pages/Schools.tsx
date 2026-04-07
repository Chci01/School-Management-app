import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Key, Zap, Calendar, Star, Infinity } from 'lucide-react';

const PLAN_OPTIONS = [
  {
    id: 30,
    label: 'Mensuel',
    description: '30 jours',
    price: '15 000 FCFA',
    icon: <Calendar size={16} />,
    color: '#6366f1',
  },
  {
    id: 365,
    label: 'Annuel',
    description: '365 jours',
    price: '150 000 FCFA',
    icon: <Star size={16} />,
    color: '#f59e0b',
  },
  {
    id: 99999,
    label: 'À Vie',
    description: '~273 ans',
    price: '500 000 FCFA',
    icon: <Infinity size={16} />,
    color: '#10b981',
  },
];

const Schools = () => {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number>(365);
  const [generating, setGenerating] = useState(false);

  const fetchLicenses = async () => {
    try {
      const { data } = await api.get('/schools/licenses');
      setLicenses(data);
    } catch (err) {
      console.error('Erreur chargement licences:', err);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleGenerateKey = async () => {
    const plan = PLAN_OPTIONS.find((p) => p.id === selectedPlan);
    if (!plan) return;
    setGenerating(true);
    try {
      const { data } = await api.post('/schools/generate-license', { days: selectedPlan });
      if (data.success) {
        alert(
          `✅ Nouvelle Clé Générée !\n\nCode : ${data.voucher.code}\nPlan : ${plan.label} (${plan.description})\nPrix : ${plan.price}\n\nEnvoyez cette clé à l'école pour activer son abonnement.`
        );
        fetchLicenses();
      }
    } catch (err) {
      alert("Erreur lors de la génération de la clé.");
    } finally {
      setGenerating(false);
    }
  };

  const getPlanLabel = (days: number) => {
    if (days >= 99999) return { label: 'À Vie', color: '#10b981' };
    if (days >= 365) return { label: 'Annuel', color: '#f59e0b' };
    if (days >= 30) return { label: 'Mensuel', color: '#6366f1' };
    if (days <= 7) return { label: 'Essai', color: '#64748b' };
    return { label: `${days}j`, color: '#64748b' };
  };

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1>Gestion des Écoles</h1>
          <p>Supervisez les établissements et leurs licences</p>
        </div>
        <div>
          <button className="btn-primary">+ Nouvelle École</button>
        </div>
      </div>

      {/* Schools Table */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
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

      {/* License Key Generator */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Key size={24} /> Générer une Clé de Licence
        </h2>

        {/* Plan Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {PLAN_OPTIONS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: `2px solid ${selectedPlan === plan.id ? plan.color : 'var(--surface-border)'}`,
                background: selectedPlan === plan.id ? `${plan.color}15` : 'var(--surface)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                color: 'var(--text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: plan.color }}>
                {plan.icon}
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{plan.label}</span>
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '4px' }}>{plan.description}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: plan.color }}>{plan.price}</div>
            </button>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={handleGenerateKey}
          disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <Zap size={18} />
          {generating
            ? 'Génération...'
            : `Générer une Clé ${PLAN_OPTIONS.find((p) => p.id === selectedPlan)?.label}`}
        </button>
      </div>

      {/* License Voucher Table */}
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Key size={24} /> Clés de Licences Générées
        </h2>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code (Voucher)</th>
                <th>Plan</th>
                <th>Validité</th>
                <th>Date de Création</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {licenses.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    Aucune clé générée pour le moment.
                  </td>
                </tr>
              ) : (
                licenses.map((lic) => {
                  const plan = getPlanLabel(lic.days);
                  return (
                    <tr key={lic.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '1px' }}>
                        {lic.code}
                      </td>
                      <td>
                        <span style={{ color: plan.color, fontWeight: 600 }}>{plan.label}</span>
                      </td>
                      <td>{lic.days >= 99999 ? 'À Vie (~273 ans)' : `${lic.days} jours`}</td>
                      <td>{new Date(lic.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        {lic.isUsed ? (
                          <span className="badge badge-danger">Utilisée</span>
                        ) : (
                          <span className="badge badge-success">Disponible</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schools;
