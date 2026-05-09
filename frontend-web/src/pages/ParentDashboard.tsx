
import { Bell, Calendar, FileText, AlertCircle, Clock, Plus } from 'lucide-react';
import '../MobileAesthetics.css';
import BottomNav from '../components/BottomNav';

const ParentDashboard = () => {
  return (
    <div className="mobile-dashboard parent">
      <header className="mobile-header parent">
        <div className="profile-section">
          <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="profile-pic" />
          <div className="welcome-text">
            <h2>Bonjour,</h2>
            <p>Mme Martin 👋</p>
          </div>
        </div>
        <div className="notif-bell">
          <Bell size={24} />
          <span className="notif-badge">2</span>
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
          <div className="child-tab active">
            <img src="https://i.pravatar.cc/150?img=44" alt="Emma" className="child-avatar" />
            <div>
              <div className="item-title" style={{ fontSize: '0.85rem' }}>Emma Martin</div>
              <div className="item-subtitle" style={{ fontSize: '0.75rem' }}>4ème B</div>
              <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>Moyenne: 14,2/20</div>
            </div>
          </div>
          <div className="child-tab">
            <img src="https://i.pravatar.cc/150?img=11" alt="Lucas" className="child-avatar" />
            <div>
              <div className="item-title" style={{ fontSize: '0.85rem' }}>Lucas Martin</div>
              <div className="item-subtitle" style={{ fontSize: '0.75rem' }}>2nde A</div>
              <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>Moyenne: 12,8/20</div>
            </div>
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
            <span className="summary-value">1</span>
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>ce mois</span>
          </div>
          <div className="summary-card">
            <div className="summary-icon-box" style={{ background: '#FFF7ED', color: '#F97316' }}>
              <Clock size={24} />
            </div>
            <h3>Retards</h3>
            <span className="summary-value">2</span>
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>ce mois</span>
          </div>
          <div className="summary-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%' }}>
              <div className="summary-icon-box" style={{ background: '#ECFDF5', color: '#10B981', marginBottom: 0 }}>
                <FileText size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ marginBottom: '2px' }}>Notes moyennes</h3>
                <span className="summary-value">13,5/20</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h2>Dernières notes - Emma</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>

        <div className="mobile-list-card">
          <div className="list-item">
            <div className="item-main-info">
              <div className="item-title">Mathématiques</div>
              <div className="item-subtitle">22 Mai</div>
            </div>
            <div className="item-extra" style={{ color: '#10B981' }}>18/20</div>
          </div>
          <div className="list-item">
            <div className="item-main-info">
              <div className="item-title">Français</div>
              <div className="item-subtitle">21 Mai</div>
            </div>
            <div className="item-extra" style={{ color: '#10B981' }}>14/20</div>
          </div>
          <div className="list-item">
            <div className="item-main-info">
              <div className="item-title">Anglais</div>
              <div className="item-subtitle">20 Mai</div>
            </div>
            <div className="item-extra" style={{ color: '#EF4444' }}>12/20</div>
          </div>
        </div>

        <div className="section-header">
          <h2>Prochains événements</h2>
        </div>

        <div className="mobile-list-card">
          <div className="list-item">
            <div className="summary-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6', marginRight: '16px', marginBottom: 0 }}>
              <Calendar size={20} />
            </div>
            <div className="item-main-info">
              <div className="item-title">Conseil de classe</div>
              <div className="item-subtitle">4ème B</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>30 Mai</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>14:00</div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav role="parent" activeTab="accueil" />
    </div>
  );
};

export default ParentDashboard;
