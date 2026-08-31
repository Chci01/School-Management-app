import { Bell, Clock, ClipboardList, CalendarX, Users, LogOut } from 'lucide-react';
import '../MobileAesthetics.css';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../hooks/useAuth';

const ProfessorDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="mobile-dashboard professor">
      <header className="mobile-header professor">
        <div className="profile-section">
          <img src={user?.photo || "https://i.pravatar.cc/150?img=12"} alt="Profile" className="profile-pic" />
          <div className="welcome-text">
            <h2>Bonjour,</h2>
            <p>M. {user?.lastName || 'Dupont'} 👋</p>
          </div>
        </div>
        <div className="notif-bell" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Bell size={24} />
            <span className="notif-badge">3</span>
          </div>
          <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="mobile-content">
        <div className="section-header" style={{ color: 'white', marginBottom: '20px', marginTop: '-20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Aperçu Aujourd'hui</h2>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>24 Mai 2024</span>
        </div>

        <div className="mobile-summary-grid">
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
              <Users size={24} />
            </div>
            <h3>Mes classes</h3>
            <span className="summary-value">--</span>
          </div>
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
              <Clock size={24} />
            </div>
            <h3>Cours du jour</h3>
            <span className="summary-value">--</span>
          </div>
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#FFF7ED', color: '#F97316' }}>
              <ClipboardList size={24} />
            </div>
            <h3>Devoirs à corriger</h3>
            <span className="summary-value">--</span>
          </div>
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#FEF2F2', color: '#EF4444' }}>
              <CalendarX size={24} />
            </div>
            <h3>Absences</h3>
            <span className="summary-value">--</span>
          </div>
        </div>

        <div className="section-header">
          <h2>Emploi du temps</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item" style={{display:'flex', justifyContent:'center', color:'#64748B'}}>
            Synchronisation de votre emploi du temps en cours...
          </div>
        </div>

        <div className="section-header">
          <h2>Devoirs à corriger</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item" style={{display:'flex', justifyContent:'center', color:'#64748B'}}>
            Synchronisation des devoirs en cours...
          </div>
        </div>
      </main>

      <BottomNav role="professor" activeTab="accueil" />
    </div>
  );
};

export default ProfessorDashboard;
