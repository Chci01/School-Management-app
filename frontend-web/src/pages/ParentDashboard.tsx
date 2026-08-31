
import { Bell, FileText, AlertCircle, Clock, Plus, LogOut } from 'lucide-react';
import '../MobileAesthetics.css';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../hooks/useAuth';

const ParentDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="mobile-dashboard parent">
      <header className="mobile-header parent">
        <div className="profile-section">
          <img src={user?.photo || "https://i.pravatar.cc/150?img=32"} alt="Profile" className="profile-pic" />
          <div className="welcome-text">
            <h2>Bonjour,</h2>
            <p>M/Mme {user?.lastName || 'Martin'} 👋</p>
          </div>
        </div>
        <div className="notif-bell" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Bell size={24} />
            <span className="notif-badge">2</span>
          </div>
          <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="mobile-content">
        <div className="section-header" style={{ color: 'white', marginBottom: '16px', marginTop: '-20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Mes enfants</h2>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px', borderRadius: '8px' }}>
             <Plus size={18} />
          </div>
        </div>

        <div className="child-selector">
          <div className="child-tab active" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '16px', color: 'rgba(255,255,255,0.7)' }}>
            Synchronisation des données des enfants en cours...
          </div>
        </div>

        <div className="section-header">
          <h2>Résumé global</h2>
        </div>

        <div className="mobile-summary-grid">
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#FEF2F2', color: '#EF4444' }}>
              <AlertCircle size={24} />
            </div>
            <h3>Absences</h3>
            <span className="summary-value">--</span>
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>ce mois</span>
          </div>
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#FFF7ED', color: '#F97316' }}>
              <Clock size={24} />
            </div>
            <h3>Retards</h3>
            <span className="summary-value">--</span>
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>ce mois</span>
          </div>
          <div className="summary-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%' }}>
              <div className="summary-icon-box" style={{ background: '#ECFDF5', color: '#10B981', marginBottom: 0 }}>
                <FileText size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ marginBottom: '2px' }}>Notes moyennes</h3>
                <span className="summary-value">-- / 20</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h2>Dernières notes - Emma</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item" style={{display:'flex', justifyContent:'center', color:'#64748B'}}>
            Synchronisation des notes en cours...
          </div>
        </div>

        <div className="section-header">
          <h2>Prochains événements</h2>
        </div>

        <div className="mobile-list-card">
          <div className="list-item" style={{display:'flex', justifyContent:'center', color:'#64748B'}}>
            Synchronisation des annonces en cours...
          </div>
        </div>
      </main>

      <BottomNav role="parent" activeTab="accueil" />
    </div>
  );
};

export default ParentDashboard;
