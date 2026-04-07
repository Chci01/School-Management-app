import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShoppingBag, Bell } from 'lucide-react';

const Dashboard = () => {
    const { user, currentSchoolId } = useAuth();
    const { stats, isLoading } = useDashboard(currentSchoolId || undefined);
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des statistiques...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-page" style={{ padding: '24px' }}>
            <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                 <div>
                     <h1>Vue d'overview</h1>
                     <p>Bonjour {user?.firstName}. Voici les métriques de l'établissement.</p>
                 </div>
                 <button className="btn-primary">Générer Rapport</button>
            </div>
            
            <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '24px' }}>
         <button className="btn-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px' }} onClick={() => navigate('/users')}>
            <UserPlus size={32} />
            <span>Nouvelle Inscription</span>
         </button>
         <button className="btn-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px' }} onClick={() => navigate('/supplies')}>
            <ShoppingBag size={32} />
            <span>Fournitures</span>
         </button>
         <button className="btn-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px' }} onClick={() => navigate('/news')}>
            <Bell size={32} />
            <span>Publier Actualité</span>
         </button>
      </div>
            <div className="stats-grid" style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px'
            }}>
                 <div className="stat-card glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                      <div className="stat-info">
                           <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>TOTAL ÉLÈVES</h3>
                           <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.studentsCount}</p>
                      </div>
                 </div>
                 <div className="stat-card glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                      <div className="stat-info">
                           <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>PERSONNEL ACADÉMIQUE</h3>
                           <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.staffCount}</p>
                      </div>
                 </div>
                 <div className="stat-card glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                      <div className="stat-info">
                           <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>RECETTES GLOBALES</h3>
                           <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success)' }}>
                               {stats.revenues.toLocaleString()} <span style={{fontSize: '14px'}}>FCFA</span>
                           </p>
                      </div>
                 </div>
            </div>

            <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                 <div className="recent-activity glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                      <h3 style={{ marginBottom: '16px' }}>Derniers Paiements (Activité)</h3>
                      <ul className="activity-list" style={{ listStyle: 'none', padding: 0 }}>
                           {stats.recentPayments.length === 0 ? (
                               <li style={{ color: 'var(--text-secondary)' }}>Aucun paiement enregistré pour l'instant.</li>
                           ) : stats.recentPayments.map((payment: any) => (
                               <li key={payment.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                   <span>Reçu {payment.receiptNumber} - {payment.studentId}</span>
                                   <strong style={{ color: 'var(--success)' }}>+{payment.amount.toLocaleString()} FCFA</strong>
                               </li>
                           ))}
                      </ul>
                 </div>
                 <div className="quick-actions glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                      <h3 style={{ marginBottom: '16px' }}>Actions Rapides</h3>
                      <div className="actions-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           <a href="/users" style={{ textDecoration: 'none' }}><button className="btn-secondary" style={{ width: '100%', padding: '12px', textAlign: 'left' }}>+ Inscrire un Élève</button></a>
                           <a href="/payments" style={{ textDecoration: 'none' }}><button className="btn-secondary" style={{ width: '100%', padding: '12px', textAlign: 'left' }}>+ Enregistrer un Paiement</button></a>
                           <a href="/announcements" style={{ textDecoration: 'none' }}><button className="btn-secondary" style={{ width: '100%', padding: '12px', textAlign: 'left' }}>📢 Diffuser une Annonce</button></a>
                      </div>
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
