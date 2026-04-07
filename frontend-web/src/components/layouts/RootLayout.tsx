import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Menu, X } from 'lucide-react';

const RootLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-container">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            <aside className={`sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="logo.png" alt="App Logo" style={{ height: '32px', objectFit: 'contain' }} />
                        <h3 style={{ fontSize: '1.1rem' }}>KalanSira Mali</h3>
                    </div>
                    <button className="sidebar-close-btn" onClick={closeSidebar}>
                        <X size={20} />
                    </button>
                </div>
                 <nav className="sidebar-nav">
                    <ul>
                         <li><NavLink to="/" end onClick={closeSidebar}>Tableau de Bord</NavLink></li>
                         <li><NavLink to="/schools" onClick={closeSidebar}>Écoles</NavLink></li>
                         <li><NavLink to="/users" onClick={closeSidebar}>Utilisateurs</NavLink></li>
                         <li><NavLink to="/academic" onClick={closeSidebar}>Scolarité</NavLink></li>
                         <li><NavLink to="/reports" onClick={closeSidebar}>Bulletins</NavLink></li>
                         <li><NavLink to="/payments" onClick={closeSidebar}>Paiements</NavLink></li>
                         <li><NavLink to="/documents" onClick={closeSidebar}>Documents</NavLink></li>
                         <li><NavLink to="/health" onClick={closeSidebar}>Infirmerie</NavLink></li>
                         <li><NavLink to="/supplies" onClick={closeSidebar}>Fournitures</NavLink></li>
                         <li><NavLink to="/conduct" onClick={closeSidebar}>Conduite</NavLink></li>
                         <li><NavLink to="/badges" onClick={closeSidebar}>Badges</NavLink></li>
                         <li><NavLink to="/news" onClick={closeSidebar}>Actualités</NavLink></li>
                         <li><NavLink to="/subscription" onClick={closeSidebar}>Abonnement</NavLink></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <header className="topbar glass-panel">
                     <div className="topbar-left">
                        <button className="menu-toggle-btn" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <div className="topbar-search">
                            <input type="text" placeholder="Rechercher..." />
                        </div>
                     </div>
                     <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <ThemeToggle />
                          <div className="avatar">{user?.firstName?.[0] ? user.firstName[0].toUpperCase() : 'U'}</div>
                          <div className="user-info mobile-hidden">
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
