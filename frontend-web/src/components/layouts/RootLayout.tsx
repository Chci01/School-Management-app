import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { LogOut, Menu, X, LayoutDashboard, Users, UserCheck, Briefcase, Layers, BookOpen, ClipboardList, CalendarX, Calendar, FileText, MessageSquare, CreditCard, Library, BarChart, Settings, GraduationCap, FolderOpen, HeartPulse, Package, Activity, Award, Newspaper, Bell, UserCog, DollarSign } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useAcademic } from '../../hooks/useAcademic';
import { BackButton } from '../common/BackButton';

const RootLayout = () => {
    const { logout, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);
    const { academicYears, activeYear } = useAcademic(user?.schoolId);

    const routeNames: Record<string, string> = {
        '/': 'Tableau de bord',
        '/students': 'Élèves',
        '/parents': 'Parents',
        '/teachers': 'Enseignants',
        '/classes': 'Classes',
        '/subjects': 'Matières',
        '/grades': 'Notes',
        '/reports': 'Bulletins',
        '/absences': 'Absences',
        '/timetable': 'Emploi du temps',
        '/exams': 'Examens',
        '/academic': 'Années Scolaires',
        '/messages': 'Messages',
        '/news': 'Actualités',
        '/conduct': 'Conduite',
        '/badges': 'Badges',
        '/payments': 'Frais scolaires',
        '/finances': 'Finances',
        '/personnel': 'Personnel',
        '/library': 'Bibliothèque',
        '/documents': 'Documents',
        '/health': 'Infirmerie',
        '/supplies': 'Fournitures',
        '/settings': 'Paramètres'
    };
    const currentPageName = routeNames[location.pathname] || 'Tableau de bord';
    const schoolName = user?.schoolName || "Lycée KalanSira";

    const isMobileRole = ['TEACHER', 'PROFESSOR', 'PARENT', 'STUDENT', 'ENSEIGNANT', 'ELEVE'].includes(user?.role?.toUpperCase() || '');

    if (isMobileRole) {
        return (
            <div className="app-container" style={{ display: 'block', height: '100vh', overflowY: 'auto' }}>
                <Outlet />
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            <aside className={`sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={user?.schoolLogo || logo} alt="App Logo" style={{ height: '32px', objectFit: 'contain' }} />
                        <div>
                            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text)' }}>{schoolName}</h3>
                            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>Mali</p>
                        </div>
                    </div>
                    <button className="sidebar-close-btn" onClick={closeSidebar}>
                        <X size={20} />
                    </button>
                </div>
                 <nav className="sidebar-nav">
                     <ul style={{ paddingBottom: '64px' }}>
                         <li className="nav-group-title" style={{ padding: '12px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600 }}>Principal</li>
                         <li><NavLink to="/" end onClick={closeSidebar}><LayoutDashboard size={20} /> Tableau de bord</NavLink></li>
                         <li><NavLink to="/students" onClick={closeSidebar}><Users size={20} /> Élèves</NavLink></li>
                         <li><NavLink to="/parents" onClick={closeSidebar}><UserCheck size={20} /> Parents</NavLink></li>
                         <li><NavLink to="/teachers" onClick={closeSidebar}><Briefcase size={20} /> Enseignants</NavLink></li>
                         <li><NavLink to="/classes" onClick={closeSidebar}><Layers size={20} /> Classes</NavLink></li>
                         <li><NavLink to="/subjects" onClick={closeSidebar}><BookOpen size={20} /> Matières</NavLink></li>
                         
                         <li className="nav-group-title" style={{ padding: '12px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px' }}>Scolarité & Pédagogie</li>
                         <li><NavLink to="/grades" onClick={closeSidebar}><ClipboardList size={20} /> Notes</NavLink></li>
                         <li><NavLink to="/reports" onClick={closeSidebar}><BarChart size={20} /> Bulletins</NavLink></li>
                         <li><NavLink to="/absences" onClick={closeSidebar}><CalendarX size={20} /> Absences</NavLink></li>
                         <li><NavLink to="/timetable" onClick={closeSidebar}><Calendar size={20} /> Emploi du temps</NavLink></li>
                         <li><NavLink to="/exams" onClick={closeSidebar}><FileText size={20} /> Examens</NavLink></li>
                         <li><NavLink to="/academic" onClick={closeSidebar}><GraduationCap size={20} /> Années Scolaires</NavLink></li>
                         
                         <li className="nav-group-title" style={{ padding: '12px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px' }}>Communication & Vie</li>
                         <li><NavLink to="/messages" onClick={closeSidebar}><MessageSquare size={20} /> Messages</NavLink></li>
                         <li><NavLink to="/news" onClick={closeSidebar}><Newspaper size={20} /> Actualités</NavLink></li>
                         <li><NavLink to="/conduct" onClick={closeSidebar}><Activity size={20} /> Conduite</NavLink></li>
                         <li><NavLink to="/badges" onClick={closeSidebar}><Award size={20} /> Badges</NavLink></li>
                         
                         <li className="nav-group-title" style={{ padding: '12px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px' }}>Administration</li>
                         <li><NavLink to="/personnel" onClick={closeSidebar}><UserCog size={20} /> Personnel</NavLink></li>
                         <li><NavLink to="/payments" onClick={closeSidebar}><CreditCard size={20} /> Frais scolaires</NavLink></li>
                         <li><NavLink to="/finances" onClick={closeSidebar}><DollarSign size={20} /> Finances (Dépenses)</NavLink></li>
                         <li><NavLink to="/library" onClick={closeSidebar}><Library size={20} /> Bibliothèque</NavLink></li>
                         <li><NavLink to="/documents" onClick={closeSidebar}><FolderOpen size={20} /> Documents</NavLink></li>
                         <li><NavLink to="/health" onClick={closeSidebar}><HeartPulse size={20} /> Infirmerie</NavLink></li>
                         <li><NavLink to="/supplies" onClick={closeSidebar}><Package size={20} /> Fournitures</NavLink></li>
                         <li><NavLink to="/settings" onClick={closeSidebar}><Settings size={20} /> Paramètres</NavLink></li>
                     </ul>
                 </nav>
                 
                 <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
                    <button onClick={logout} className="logout-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '12px', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s ease' }}>
                        <LogOut size={20} /> Déconnexion
                    </button>
                 </div>
             </aside>

            <main className="main-content">
                <header className="topbar glass-panel">
                     <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BackButton absolute={false} />
                        <button className="menu-toggle-btn" onClick={toggleSidebar}>
                            <Menu size={24} color="var(--text)" />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Menu size={20} color="var(--text-muted)" className="mobile-hidden" /> {currentPageName}
                        </h2>
                     </div>
                     <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div className="mobile-hidden" style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '14px' }}>
                              {schoolName}
                          </div>
                          
                          <div className="dropdown-mini mobile-hidden" style={{ border: '1px solid var(--glass-border)', padding: '4px 8px', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                              <select style={{ background: 'transparent', border: 'none', color: 'inherit', outline: 'none', cursor: 'pointer' }} defaultValue={activeYear?.id || ''}>
                                  {academicYears && academicYears.length > 0 ? academicYears.map((y: any) => (
                                      <option key={y.id} value={y.id}>{y.name}</option>
                                  )) : <option value="">Année scolaire --</option>}
                              </select>
                          </div>
                          
                          <div style={{ position: 'relative', cursor: 'pointer', padding: '8px' }}>
                              <Bell size={22} color="var(--text-muted)" />
                              <span style={{ position: 'absolute', top: '6px', right: '8px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid var(--surface)' }}></span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                              <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                                  <img src={user?.photo || "https://i.pravatar.cc/150?u=admin"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div className="user-info mobile-hidden">
                                  <span className="user-name" style={{ color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>{user?.firstName || 'Admin'}</span>
                                  <span className="user-role" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.role || 'Administrateur'}</span>
                              </div>
                          </div>
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
