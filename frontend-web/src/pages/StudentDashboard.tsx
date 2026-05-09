
import { Bell, TrendingUp, BookOpen, Calendar } from 'lucide-react';
import '../MobileAesthetics.css';
import BottomNav from '../components/BottomNav';

const StudentDashboard = () => {
  return (
    <div className="mobile-dashboard student">
      <header className="mobile-header student">
        <div className="profile-section">
          <img src="https://i.pravatar.cc/150?img=13" alt="Profile" className="profile-pic" />
          <div className="welcome-text">
            <h2>Bonjour,</h2>
            <p>Alexandre 👋</p>
          </div>
        </div>
        <div className="notif-bell">
          <Bell size={24} />
          <span className="notif-badge">1</span>
        </div>
      </header>

      <main className="mobile-content">
        <div className="student-main-card">
          <div className="stat-row">
            <div className="stat-group">
              <label>Moyenne générale</label>
              <div className="big-stat">14,6<span style={{ fontSize: '1rem', color: '#94A3B8' }}>/20</span></div>
            </div>
            <div className="rank-box">
              <label>Classement</label>
              <div className="rank-val">8 / 28</div>
              <div className="rank-trend">
                <TrendingUp size={14} />
                <span>↑ 2 ce mois</span>
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
          <div className="list-item">
            <div className="time-box">08:00 - 09:00</div>
            <div className="item-main-info">
              <div className="item-title">Mathématiques</div>
            </div>
            <div className="item-extra" style={{ color: '#3B82F6', background: '#EFF6FF', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>Salle 12</div>
          </div>
          <div className="list-item">
            <div className="time-box">10:00 - 11:00</div>
            <div className="item-main-info">
              <div className="item-title">Français</div>
            </div>
            <div className="item-extra" style={{ color: '#8B5CF6', background: '#F5F3FF', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>Salle 5</div>
          </div>
          <div className="list-item">
            <div className="time-box">14:00 - 15:00</div>
            <div className="item-main-info">
              <div className="item-title">SVT</div>
            </div>
            <div className="item-extra" style={{ color: '#10B981', background: '#ECFDF5', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>Salle 9</div>
          </div>
        </div>

        <div className="section-header">
          <h2>Prochains devoirs</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item">
            <div className="summary-icon-box" style={{ background: '#F5F3FF', color: '#8B5CF6', marginRight: '16px', marginBottom: 0, width: '40px', height: '40px' }}>
              <BookOpen size={18} />
            </div>
            <div className="item-main-info">
              <div className="item-title">Mathématiques</div>
              <div className="item-subtitle">Exercices n°24 à 36</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748B' }}>
                <Calendar size={12} /> 27 Mai
              </div>
            </div>
          </div>
          <div className="list-item">
            <div className="summary-icon-box" style={{ background: '#FDF2F8', color: '#DB2777', marginRight: '16px', marginBottom: 0, width: '40px', height: '40px' }}>
              <BookOpen size={18} />
            </div>
            <div className="item-main-info">
              <div className="item-title">Français</div>
              <div className="item-subtitle">Rédaction : Le roman</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748B' }}>
                <Calendar size={12} /> 28 Mai
              </div>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h2>Dernières notes</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item">
            <div className="item-main-info">
              <div className="item-title">Mathématiques</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontWeight: 700, color: '#10B981' }}>18/20</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>22 Mai</div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav role="student" activeTab="accueil" />
    </div>
  );
};

export default StudentDashboard;
