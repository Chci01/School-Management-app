import { useState } from 'react';
import { useGrades } from '../hooks/useGrades';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { useSubjects } from '../hooks/useSubjects';
import { useUsers } from '../hooks/useUsers';
import { ClipboardList, Plus, Edit, Save, Filter, CheckCircle, AlertCircle, User, Book } from 'lucide-react';

const Grades = () => {
  const { currentSchoolId } = useAuth();
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('DEVOIR');

  const { classes } = useClasses(currentSchoolId!);
  const { subjects } = useSubjects(currentSchoolId!);
  const { users: students } = useUsers(currentSchoolId!, 'ELEVE');
  const { grades, isLoading, error, saveBulkGrades, isSaving } = useGrades(currentSchoolId!, selectedClass || undefined, selectedSubject || undefined);

  // For bulk entry
  const [bulkGrades, setBulkGrades] = useState<{[key: string]: number}>({});

  const handleBulkSave = async () => {
    if (!selectedClass || !selectedSubject) {
      alert("Veuillez sélectionner une classe et une matière.");
      return;
    }

    const gradesToSave = Object.entries(bulkGrades).map(([studentId, value]) => ({
      studentId,
      classId: selectedClass,
      subjectId: selectedSubject,
      schoolId: currentSchoolId,
      type: selectedType,
      value: Number(value),
      date: new Date().toISOString()
    }));

    if (gradesToSave.length === 0) return;

    try {
      await saveBulkGrades(gradesToSave);
      setIsBulkMode(false);
      setBulkGrades({});
      alert("Notes enregistrées avec succès !");
    } catch (e) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  if (isLoading && (!classes || !subjects)) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement du module de notes...</div>
      </div>
    );
  }

  const filteredStudents = (Array.isArray(students) ? students : []).filter((s: any) => 
    !selectedClass || s.classId === selectedClass
  );

  const displayedGrades = Array.isArray(grades) ? grades : [];

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8B5CF6' }}>
              <ClipboardList size={28} />
            </div>
            Gestion des Évaluations
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Saisissez les notes et suivez la progression des élèves.</p>
        </div>
        {!isBulkMode ? (
          <button 
            className="btn-primary" 
            onClick={() => setIsBulkMode(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, background: '#8B5CF6', border: 'none', cursor: 'pointer', color: '#fff' }}
          >
            <Plus size={20} /> Saisie Multiple
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
             <button className="btn-secondary" onClick={() => setIsBulkMode(false)} style={{ padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}>Annuler</button>
             <button 
               className="btn-primary" 
               onClick={handleBulkSave} 
               disabled={isSaving}
               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, background: '#10B981', border: 'none', cursor: 'pointer', color: '#fff' }}
             >
               <Save size={20} /> {isSaving ? 'Enregistrement...' : 'Enregistrer les notes'}
             </button>
          </div>
        )}
      </div>

      <div className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> CLASSE
            </label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', minWidth: '220px' }}
            >
              <option value="">Sélectionner une classe</option>
              {Array.isArray(classes) && classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Book size={14} /> MATIÈRE
            </label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', minWidth: '220px' }}
            >
              <option value="">Sélectionner une matière</option>
              {Array.isArray(subjects) && subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TYPE D'ÉVALUATION</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', minWidth: '180px' }}
            >
              <option value="DEVOIR">Devoir</option>
              <option value="COMPOSITION">Composition</option>
              <option value="EXAMEN">Examen</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} /> Erreur de chargement des données.
          </div>
        )}

        {/* View Mode */}
        {!isBulkMode ? (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                  <th style={{ padding: '12px 20px' }}>Élève</th>
                  <th style={{ padding: '12px 20px' }}>Classe</th>
                  <th style={{ padding: '12px 20px' }}>Matière</th>
                  <th style={{ padding: '12px 20px' }}>Type</th>
                  <th style={{ padding: '12px 20px' }}>Note (/20)</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedGrades.map((g: any) => (
                  <tr key={g.id} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <td style={{ padding: '16px 20px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                           <User size={16} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{g.student ? `${g.student.firstName} ${g.student.lastName}` : 'Chargement...'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{g.class?.name || '-'}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{g.subject?.name || '-'}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }}>{g.type}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 900, 
                        color: g.value >= 12 ? '#10B981' : g.value >= 10 ? '#F59E0B' : '#EF4444',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '6px 12px',
                        borderRadius: '8px'
                      }}>
                        {g.value.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                      <button className="btn-secondary" style={{ padding: '8px', cursor: 'pointer' }}><Edit size={16} /></button>
                    </td>
                  </tr>
                ))}
                {displayedGrades.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={6} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                       <ClipboardList size={48} style={{ margin: '0 auto 16px', opacity: 0.1 }} />
                       <p>Sélectionnez une classe et une matière pour voir les notes.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Bulk Entry Mode */
          <div style={{ marginTop: '20px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
               <h4 style={{ margin: 0, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <CheckCircle size={18} /> Mode Saisie Rapide
               </h4>
               <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                 Saisissez les notes de tous les élèves de la classe sélectionnée ci-dessous. Les notes non renseignées ne seront pas modifiées.
               </p>
            </div>

            {!selectedClass || !selectedSubject ? (
               <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                 Veuillez d'abord sélectionner une <strong>Classe</strong> et une <strong>Matière</strong> dans les filtres ci-dessus.
               </div>
            ) : (
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                      <th style={{ padding: '12px 20px' }}>Matricule</th>
                      <th style={{ padding: '12px 20px' }}>Élève</th>
                      <th style={{ padding: '12px 20px', width: '150px' }}>Note (/20)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student: any) => (
                      <tr key={student.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                        <td style={{ padding: '16px 20px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                           <code style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>{student.matricule}</code>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 600 }}>{student.firstName} {student.lastName}</div>
                        </td>
                        <td style={{ padding: '16px 20px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                          <input 
                            type="number" 
                            step="0.25" 
                            min="0" 
                            max="20"
                            placeholder="--"
                            value={bulkGrades[student.id] || ''}
                            onChange={(e) => setBulkGrades({...bulkGrades, [student.id]: Number(e.target.value)})}
                            style={{ width: '100%', padding: '10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;
