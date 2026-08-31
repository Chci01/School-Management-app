
import { Bell, TrendingUp, LogOut } from 'lucide-react';
import '../MobileAesthetics.css';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../hooks/useAuth';

const StudentDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="mobile-dashboard student">
      <header className="mobile-header student">
        <div className="profile-section">
          <img src={user?.photo || "https://i.pravatar.cc/150?img=13"} alt="Profile" className="profile-pic" />
          <div className="welcome-text">
            <h2>Bonjour,</h2>
            <p>{user?.firstName || 'Élève'} 👋</p>
          </div>
        </div>
        <div className="notif-bell" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Bell size={24} />
            <span className="notif-badge">1</span>
          </div>
          <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="mobile-content">
        <div className="student-main-card">
          <div className="stat-row">
            <div className="stat-group">
              <label>Moyenne générale</label>
              <div className="big-stat">--<span style={{ fontSize: '1rem', color: '#94A3B8' }}>/20</span></div>
            </div>
            <div className="rank-box">
              <label>Classement</label>
              <div className="rank-val">-- / --</div>
              <div className="rank-trend">
                <TrendingUp size={14} />
                <span>Synchronisation...</span>
              </div>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: '73%', background: 'var(--student-primary)' }}></div>
          </div>
        </div>

        <div className="section-header">
          <h2>Emploi du temps</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item" style={{display:'flex', justifyContent:'center', color:'#64748B'}}>
            Synchronisation de l'emploi du temps...
          </div>
        </div>

        <div className="section-header">
          <h2>Prochains devoirs</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item" style={{display:'flex', justifyContent:'center', color:'#64748B'}}>
            Synchronisation des devoirs...
          </div>
        </div>

        <div className="section-header">
          <h2>Dernières notes</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item" style={{display:'flex', justifyContent:'center', color:'#64748B'}}>
            Synchronisation des notes...
          </div>
        </div>
      </main>

      <BottomNav role="student" activeTab="accueil" />
    </div>
  );
};

export default StudentDashboard;
