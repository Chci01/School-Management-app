import React, { useState, useEffect } from 'react';
import { Calendar, Plus, BookOpen, Trash2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { useSubjects } from '../hooks/useSubjects';
import { useUsers } from '../hooks/useUsers';
import { api } from '../services/api';

const DAYS = [
  { id: 1, label: 'Lundi' },
  { id: 2, label: 'Mardi' },
  { id: 3, label: 'Mercredi' },
  { id: 4, label: 'Jeudi' },
  { id: 5, label: 'Vendredi' },
  { id: 6, label: 'Samedi' },
  { id: 7, label: 'Dimanche' }
];

const Timetable = () => {
  const { currentSchoolId } = useAuth();
  const { classes } = useClasses(currentSchoolId!);
  const { subjects } = useSubjects(currentSchoolId!);
  const { users } = useUsers(currentSchoolId!);
  
  const teachers = Array.isArray(users) ? users.filter(u => u.role === 'ENSEIGNANT') : [];

  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    subjectId: '',
    teacherId: '',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '10:00',
    room: ''
  });

  useEffect(() => {
    if (selectedClass) {
      fetchSchedules();
    } else {
      setSchedules([]);
    }
  }, [selectedClass]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get('/schedules', { params: { classId: selectedClass } });
      setSchedules(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return alert('Veuillez sélectionner une classe.');
    
    try {
      await api.post('/schedules', { ...formData, classId: selectedClass });
      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      alert('Erreur lors de l\'ajout du cours.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={28} color="#3B82F6" />
            Emploi du temps
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Gérez les horaires et cours par classe.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
          >
            <option value="">Sélectionner une classe</option>
            {classes?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <button 
            onClick={() => {
              if(!selectedClass) return alert("Sélectionnez d'abord une classe");
              setShowModal(true);
            }} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
      ) : schedules.length > 0 ? (
        <div className="dash-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ minWidth: '800px', width: '100%' }}>
              <thead>
                <tr>
                  <th>Jour</th>
                  <th>Horaire</th>
                  <th>Matière</th>
                  <th>Enseignant</th>
                  <th>Salle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{DAYS.find(d => d.id === s.dayOfWeek)?.label}</td>
                    <td>{s.startTime} - {s.endTime}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={14} color="#3B82F6" /> {s.subject?.name}
                      </div>
                    </td>
                    <td>{s.teacher?.firstName} {s.teacher?.lastName}</td>
                    <td>{s.room || 'Non définie'}</td>
                    <td>
                      <button className="icon-btn delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="dash-card" style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-secondary)' }}>
          <Calendar size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
          <h3 style={{color: 'var(--text)'}}>{selectedClass ? 'Aucun cours programmé' : 'Sélectionnez une classe pour commencer'}</h3>
          <p style={{ marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>Commencez par ajouter des éléments à ce module pour les voir apparaître ici.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ajouter un cours</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Jour de la semaine</label>
                <select value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})} required>
                  {DAYS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Heure de début</label>
                  <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Heure de fin</label>
                  <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Matière</label>
                <select value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} required>
                  <option value="">Sélectionner une matière...</option>
                  {subjects?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Enseignant</label>
                <select value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})} required>
                  <option value="">Sélectionner un enseignant...</option>
                  {teachers?.map((t: any) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Salle (Ex: Salle 10)</label>
                <input type="text" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
