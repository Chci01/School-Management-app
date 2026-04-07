import { Outlet, NavLink } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

const RootLayout = () => {
    const { user, logout } = useAuth();
    return (
        <div className="app-container">
            <aside className="sidebar glass-panel">
                <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <img src="/logo.png" alt="App Logo" style={{ height: '36px', objectFit: 'contain' }} />
                     <h3 style={{ fontSize: '1.2rem' }}>KalanSira du Mali</h3>
                </div>
                 <nav className="sidebar-nav">
                    <ul>
                         <li><NavLink to="/" end>Tableau de Bord</NavLink></li>
                         <li><NavLink to="/schools">Écoles</NavLink></li>
                         <li><NavLink to="/users">Utilisateurs</NavLink></li>
                         <li><NavLink to="/academic">Scolarité</NavLink></li>
                         <li><NavLink to="/reports">Bulletins</NavLink></li>
                         <li><NavLink to="/payments">Paiements</NavLink></li>
                         <li><NavLink to="/documents">Documents</NavLink></li>
                         <li><NavLink to="/health">Infirmerie</NavLink></li>
                         <li><NavLink to="/supplies">Fournitures</NavLink></li>
                         <li><NavLink to="/conduct">Conduite</NavLink></li>
                         <li><NavLink to="/badges">Badges</NavLink></li>
                         <li><NavLink to="/news">Actualités</NavLink></li>
                         <li><NavLink to="/subscription">Abonnement</NavLink></li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <header className="topbar glass-panel">
                     <div className="topbar-search">
                          <input type="text" placeholder="Rechercher..." />
                     </div>
                     <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <ThemeToggle />
                          <div className="avatar">{user?.firstName?.[0] ? user.firstName[0].toUpperCase() : 'U'}</div>
                          <div className="user-info">
                              <span className="user-name">{user?.firstName || 'Utilisateur'} {user?.lastName || ''}</span>
                              <span className="user-role" style={{ fontSize: '12px', opacity: 0.8 }}>{user?.role || ''}</span>
                          </div>
                          <button onClick={logout} className="btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 59, 48, 0.1)', color: 'var(--danger, #ff3b30)', border: '1px solid rgba(255, 59, 48, 0.2)', borderRadius: '8px', cursor: 'pointer' }} title="Se déconnecter">
                              <LogOut size={18} />
                          </button>
                     </div>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default RootLayout;
