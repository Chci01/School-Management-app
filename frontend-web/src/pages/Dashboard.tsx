
import { 
  Users, BookOpen, GraduationCap, CalendarX, 
  UserPlus, ChevronDown, Calendar as CalendarIcon, 
  FileText, ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts';
import './Dashboard.css';
import { useAuth } from '../hooks/useAuth';
import ProfessorDashboard from './ProfessorDashboard';
import ParentDashboard from './ParentDashboard';
import StudentDashboard from './StudentDashboard';

const lineData: any[] = [];
const notifications: any[] = [];
const topStudents: any[] = [];
const events: any[] = [];

import { useUsers } from '../hooks/useUsers';
import { useClasses } from '../hooks/useClasses';

const Dashboard = () => {
    const { user, currentSchoolId } = useAuth();
    const role = user?.role?.toUpperCase();
    const { users } = useUsers(currentSchoolId!);
    const { classes } = useClasses(currentSchoolId!);

    const allUsers = Array.isArray(users) ? users : [];
    const students = allUsers.filter(u => u.role === 'ELEVE');
    const teachers = allUsers.filter(u => u.role === 'ENSEIGNANT');
    const allClasses = Array.isArray(classes) ? classes : [];

    const pieDataReal = allClasses.map((c, i) => ({
        name: c.name,
        value: students.filter(s => s.classId === c.id).length,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#F43F5E'][i % 6]
    })).filter(c => c.value > 0);
    
    // Fallback if empty for preview
    const activePieData = pieDataReal.length > 0 ? pieDataReal : [{name: 'Aucun', value: 1, color: '#CBD5E1'}];

    if (role === 'TEACHER' || role === 'PROFESSOR' || role === 'ENSEIGNANT') {
        return <ProfessorDashboard />;
    }

    if (role === 'PARENT') {
        return <ParentDashboard />;
    }

    if (role === 'STUDENT' || role === 'ELEVE') {
        return <StudentDashboard />;
    }

    // Default Admin Dashboard
    return (
        <div className="dashboard-container">
            {/* Top Stat Cards */}
            <div className="dash-stats-grid">
                <div className="dash-card stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Élèves</span>
                        <div className="stat-value-row">
                            <span className="stat-val">{students.length}</span>
                        </div>
                        <div className="stat-trend trend-up">
                            <ArrowUpRight size={14} /> <span>Synchronisé</span>
                        </div>
                    </div>
                </div>

                <div className="dash-card stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#DCFCE7', color: '#10B981' }}>
                        <UserPlus size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Enseignants</span>
                        <div className="stat-value-row">
                            <span className="stat-val">{teachers.length}</span>
                        </div>
                        <div className="stat-trend trend-up">
                            <ArrowUpRight size={14} /> <span>Synchronisé</span>
                        </div>
                    </div>
                </div>

                <div className="dash-card stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#FFEDD5', color: '#F97316' }}>
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Classes</span>
                        <div className="stat-value-row">
                            <span className="stat-val">{allClasses.length}</span>
                        </div>
                        <div className="stat-trend trend-up">
                            <ArrowUpRight size={14} /> <span>Synchronisé</span>
                        </div>
                    </div>
                </div>

                <div className="dash-card stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#DBEAFE', color: '#3B82F6' }}>
                        <GraduationCap size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Moyenne générale</span>
                        <div className="stat-value-row">
                            <span className="stat-val">--</span><span className="stat-suffix">/20</span>
                        </div>
                        <div className="stat-trend trend-up">
                            <span>Calcul en cours...</span>
                        </div>
                    </div>
                </div>

                <div className="dash-card stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#FCE7F3', color: '#EC4899' }}>
                        <CalendarX size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Absences (Simulation)</span>
                        <div className="stat-value-row">
                            <span className="stat-val">0</span>
                        </div>
                        <div className="stat-trend">
                            <span>En attente de données</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section */}
            <div className="dash-grid-middle">
                {/* Chart */}
                <div className="dash-card">
                    <div className="card-header">
                        <h3 style={{color: 'var(--text)'}}>Évolution des moyennes</h3>
                        <div className="dropdown-mini">
                            Trimestre 2 <ChevronDown size={14} />
                        </div>
                    </div>
                    <div style={{ height: '250px', marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} domain={[0, 20]} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3B82F6'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Notifications */}
                <div className="dash-card">
                    <div className="card-header">
                        <h3 style={{color: 'var(--text)'}}>Notifications</h3>
                        <a href="#" className="link-sm">Voir tout</a>
                    </div>
                    <div className="notifications-list">
                        {notifications.map(n => (
                            <div key={n.id} className="notification-item">
                                <div className="notif-icon" style={{ backgroundColor: n.bgColor, color: n.color }}>
                                    <n.icon size={18} />
                                </div>
                                <div className="notif-content">
                                    <h4 style={{color: 'var(--text)'}}>{n.title}</h4>
                                    <p>{n.desc}</p>
                                </div>
                                <div className="notif-time">{n.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="dash-grid-bottom">
                {/* Pie Chart */}
                <div className="dash-card">
                    <div className="card-header">
                        <h3 style={{color: 'var(--text)'}}>Répartition des élèves par classe</h3>
                    </div>
                    <div className="pie-container">
                        <div className="pie-chart-wrapper" style={{ height: '220px', width: '220px', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activePieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {activePieData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <PieTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pie-center-text">
                                <span className="pie-total">{students.length}</span>
                                <span className="pie-label">Élèves</span>
                            </div>
                        </div>
                        <div className="pie-legend">
                            {activePieData.map((d: any, i: number) => (
                                <div key={i} className="legend-item">
                                    <div className="legend-left">
                                        <div className="legend-dot" style={{ backgroundColor: d.color }}></div>
                                        <span className="legend-name">{d.name}</span>
                                    </div>
                                    <div className="legend-right">
                                        <span className="legend-pct">{students.length > 0 ? ((d.value / students.length) * 100).toFixed(1) : 0}%</span>
                                        <span className="legend-val">({d.value})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top 5 Students */}
                <div className="dash-card">
                    <div className="card-header">
                        <h3 style={{color: 'var(--text)'}}>Top 5 des élèves</h3>
                    </div>
                    <div className="top-students-list">
                        {topStudents.map((s, i) => (
                            <div key={i} className="student-item">
                                <div className="student-rank">{s.rank}</div>
                                <img src={s.img} alt={s.name} className="student-avatar" />
                                <div className="student-info">
                                    <h4 style={{color: 'var(--text)'}}>{s.name}</h4>
                                    <p>Classe : {s.className}</p>
                                </div>
                                <div className="student-grade">{s.grade}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="dash-card">
                    <div className="card-header">
                        <h3 style={{color: 'var(--text)'}}>Prochains événements</h3>
                    </div>
                    <div className="events-list">
                        {events.map((e, i) => (
                            <div key={i} className="event-item">
                                <div className="event-date">
                                    <span className="e-day">{e.dateDay}</span>
                                    <span className="e-month">{e.dateMonth}</span>
                                </div>
                                <div className="event-content">
                                    <h4 style={{color: 'var(--text)'}}>{e.title}</h4>
                                    <p>{e.time}</p>
                                </div>
                                <div className="event-badge" style={{ backgroundColor: e.bgColor, color: e.color }}>
                                    {e.type}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

