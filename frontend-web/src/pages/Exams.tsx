import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, Trash2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { useSubjects } from '../hooks/useSubjects';
import { useUsers } from '../hooks/useUsers';
import { api } from '../services/api';

const Exams = () => {
  const { currentSchoolId } = useAuth();
  const { classes } = useClasses(currentSchoolId!);
  const { subjects } = useSubjects(currentSchoolId!);
  const { users } = useUsers(currentSchoolId!);
  
  const teachers = Array.isArray(users) ? users.filter(u => u.role === 'ENSEIGNANT') : [];

  const [exams, setExams] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State (Utilise le backend Homework pour stocker les sessions d'examens planifiées)
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    teacherId: '',
    dueDate: '',
    description: ''
  });

  useEffect(() => {
    if (selectedClass) {
      fetchExams();
    } else {
      setExams([]);
    }
  }, [selectedClass]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      // On récupère via le point de terminaison homeworks mais filtré par classe pour afficher en mode Examen
      const res = await api.get(`/classes/${selectedClass}`);
      if (res.data && res.data.homeworks) {
          // Si l'endpoint retourne les devoirs/examens inclus
          setExams(res.data.homeworks);
      } else {
          // Fallback sur une API générique si disponible, sinon tableau vide en attendant l'API dédiée
          setExams([]);
      }
    } catch (error) {
      console.error(error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return alert('Veuillez sélectionner une classe.');
    
    try {
      await api.post('/homeworks', { ...formData, classId: selectedClass });
      setShowModal(false);
      alert('Examen programmé avec succès.');
      fetchExams();
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'examen. L\'API Dédiee n\'est pas encore complètement déployée pour les examens.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={28} color="#F59E0B" />
            Planification des Examens
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Programmer les évaluations et examens pour chaque classe.</p>
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
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F59E0B', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Plus size={18} /> Planifier
          </button>
        </div>
      </div>

      {loading ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
      ) : exams.length > 0 ? (
        <div className="dash-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ minWidth: '800px', width: '100%' }}>
              <thead>
                <tr>
                  <th>Date prévue</th>
                  <th>Intitulé de l'examen</th>
                  <th>Matière</th>
                  <th>Surveillant / Responsable</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{new Date(e.dueDate).toLocaleDateString()}</td>
                    <td>{e.title}</td>
                    <td>{e.subject?.name || 'N/A'}</td>
                    <td>{e.teacher?.firstName} {e.teacher?.lastName}</td>
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
          <FileText size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
          <h3 style={{color: 'var(--text)'}}>{selectedClass ? 'Aucun examen programmé' : 'Sélectionnez une classe pour commencer'}</h3>
          <p style={{ marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>Planifiez un examen pour qu'il s'affiche dans l'espace des élèves et parents.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Planifier un Examen</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Titre de l'examen (ex: Compo 1er Trimestre)</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date de l'épreuve</label>
                <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Matière concernée</label>
                <select value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} required>
                  <option value="">Sélectionner une matière...</option>
                  {subjects?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Responsable de l'épreuve</label>
                <select value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})} required>
                  <option value="">Sélectionner un enseignant...</option>
                  {teachers?.map((t: any) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Instructions ou Salle prévue (Optionnel)</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary" style={{background: '#F59E0B', borderColor: '#F59E0B'}}>Enregistrer l'examen</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
