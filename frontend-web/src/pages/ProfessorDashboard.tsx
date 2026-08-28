import { Bell, Clock, BookOpen, ClipboardList, CalendarX, CheckSquare, Users, LogOut } from 'lucide-react';
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
            <span className="summary-value">4</span>
          </div>
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
              <Clock size={24} />
            </div>
            <h3>Cours du jour</h3>
            <span className="summary-value">3</span>
          </div>
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#FFF7ED', color: '#F97316' }}>
              <ClipboardList size={24} />
            </div>
            <h3>Devoirs à corriger</h3>
            <span className="summary-value">12</span>
          </div>
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#FEF2F2', color: '#EF4444' }}>
              <CalendarX size={24} />
            </div>
            <h3>Absences</h3>
            <span className="summary-value">2</span>
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
              <div className="item-subtitle">6ème A</div>
            </div>
            <div className="item-extra">Salle 12</div>
          </div>
          <div className="list-item">
            <div className="time-box">10:00 - 11:00</div>
            <div className="item-main-info">
              <div className="item-title">Mathématiques</div>
              <div className="item-subtitle">4ème B</div>
            </div>
            <div className="item-extra">Salle 8</div>
          </div>
          <div className="list-item">
            <div className="time-box">14:00 - 15:00</div>
            <div className="item-main-info">
              <div className="item-title">Soutien scolaire</div>
              <div className="item-subtitle">3ème A</div>
            </div>
            <div className="item-extra">Salle 6</div>
          </div>
        </div>

        <div className="section-header">
          <h2>Devoirs à corriger</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item grading-card">
            <div className="grading-icon-box" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
              <BookOpen size={24} />
            </div>
            <div className="item-main-info">
              <div className="item-title">6ème A</div>
              <div className="item-subtitle">12 copies • À rendre le 28 Mai</div>
            </div>
            <div className="progress-circle">
               <svg viewBox="0 0 36 36" style={{ width: '44px' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="60, 100" />
                  <text x="18" y="20.35" className="percentage" style={{ fontSize: '8px', textAnchor: 'middle', fontWeight: 700, fill: '#1E293B' }}>60%</text>
               </svg>
            </div>
          </div>
          <div className="list-item grading-card">
            <div className="grading-icon-box" style={{ background: '#FFF7ED', color: '#F97316' }}>
              <CheckSquare size={24} />
            </div>
            <div className="item-main-info">
              <div className="item-title">4ème B</div>
              <div className="item-subtitle">8 copies • À rendre le 27 Mai</div>
            </div>
            <div className="progress-circle">
               <svg viewBox="0 0 36 36" style={{ width: '44px' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F97316" strokeWidth="3" strokeDasharray="30, 100" />
                  <text x="18" y="20.35" className="percentage" style={{ fontSize: '8px', textAnchor: 'middle', fontWeight: 700, fill: '#1E293B' }}>30%</text>
               </svg>
            </div>
          </div>
        </div>
      </main>

      <BottomNav role="professor" activeTab="accueil" />
    </div>
  );
};

export default ProfessorDashboard;
