import { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { useUsers } from '../hooks/useUsers';
import { CalendarX, Plus, Filter, Save, Calendar, User, Clock, AlertCircle } from 'lucide-react';

const Absences = () => {
  const { currentSchoolId } = useAuth();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const { classes } = useClasses(currentSchoolId!);
  const { users: students } = useUsers(currentSchoolId!, 'ELEVE');
  const { attendance, isLoading, saveBatchAttendance, isSaving } = useAttendance(currentSchoolId!, selectedClass || undefined, selectedDate);

  // For bulk entry
  const [batchStatus, setBatchStatus] = useState<{[key: string]: string}>({});

  const handleSaveBatch = async () => {
    if (!selectedClass) return alert("Veuillez sélectionner une classe.");
    
    const records = Object.entries(batchStatus).map(([studentId, status]) => ({
      studentId,
      classId: selectedClass,
      schoolId: currentSchoolId,
      status,
      date: selectedDate,
    }));

    if (records.length === 0) return;

    try {
      await saveBatchAttendance({ records });
      alert("Présences enregistrées !");
      setIsBulkMode(false);
      setBatchStatus({});
    } catch (e) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  if (isLoading && !classes) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner" style={{ color: '#EF4444' }}>Chargement des présences...</div>
      </div>
    );
  }

  const filteredStudents = (Array.isArray(students) ? students : []).filter((s: any) => 
    !selectedClass || s.classId === selectedClass
  );

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', color: '#EF4444' }}>
            <CalendarX size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Gestion des Présences</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Suivez l'assiduité des élèves au quotidien.</p>
          </div>
        </div>
        {!isBulkMode ? (
          <button 
            className="btn-primary" 
            onClick={() => setIsBulkMode(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, background: '#EF4444' }}
          >
            <Plus size={20} /> Faire l'appel
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
             <button className="btn-secondary" onClick={() => setIsBulkMode(false)} style={{ padding: '12px 24px', borderRadius: '12px' }}>Annuler</button>
             <button 
               className="btn-primary" 
               onClick={handleSaveBatch} 
               disabled={isSaving}
               style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, background: '#10B981' }}
             >
               <Save size={20} /> {isSaving ? 'Enregistrement...' : 'Enregistrer l\'appel'}
             </button>
          </div>
        )}
      </header>

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
              <option value="">Toutes les classes</option>
              {Array.isArray(classes) && classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> DATE
            </label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', minWidth: '200px' }}
            />
          </div>
        </div>

        {!isBulkMode ? (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                  <th style={{ padding: '12px 20px' }}>Élève</th>
                  <th style={{ padding: '12px 20px' }}>Classe</th>
                  <th style={{ padding: '12px 20px' }}>Statut</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Détails</th>
                </tr>
              </thead>
              <tbody>
                {(attendance || []).map((a: any) => (
                  <tr key={a.id} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <td style={{ padding: '16px 20px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <User size={16} color="var(--text-muted)" />
                          <span style={{ fontWeight: 600 }}>{a.student?.firstName} {a.student?.lastName}</span>
                       </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{a.class?.name}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '8px', 
                        fontSize: '0.75rem', 
                        fontWeight: 800,
                        background: a.status === 'PRESENT' ? 'rgba(16, 185, 129, 0.1)' : a.status === 'ABSENT' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: a.status === 'PRESENT' ? '#10B981' : a.status === 'ABSENT' ? '#EF4444' : '#F59E0B',
                      }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                      <AlertCircle size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                    </td>
                  </tr>
                ))}
                {(attendance || []).length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                       <CalendarX size={48} style={{ margin: '0 auto 16px', opacity: 0.1 }} />
                       <p>Aucun enregistrement pour cette date/classe.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Bulk Entry Mode */
          <div>
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
               <h4 style={{ margin: 0, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Clock size={18} /> Mode Appel : {selectedDate}
               </h4>
               <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                 Cochez le statut de chaque élève pour enregistrer l'appel du jour.
               </p>
            </div>

            {!selectedClass ? (
               <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                 Veuillez sélectionner une classe pour faire l'appel.
               </div>
            ) : (
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                      <th style={{ padding: '12px 20px' }}>Élève</th>
                      <th style={{ padding: '12px 20px', textAlign: 'center' }}>Statut de présence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student: any) => (
                      <tr key={student.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                        <td style={{ padding: '16px 20px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                           <div style={{ fontWeight: 600 }}>{student.firstName} {student.lastName}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.matricule}</div>
                        </td>
                        <td style={{ padding: '16px 20px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                             <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                               <input type="radio" name={`status-${student.id}`} value="PRESENT" checked={batchStatus[student.id] === 'PRESENT'} onChange={() => setBatchStatus({...batchStatus, [student.id]: 'PRESENT'})} />
                               <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.85rem' }}>Présent</span>
                             </label>
                             <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                               <input type="radio" name={`status-${student.id}`} value="ABSENT" checked={batchStatus[student.id] === 'ABSENT'} onChange={() => setBatchStatus({...batchStatus, [student.id]: 'ABSENT'})} />
                               <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.85rem' }}>Absent</span>
                             </label>
                             <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                               <input type="radio" name={`status-${student.id}`} value="LATE" checked={batchStatus[student.id] === 'LATE'} onChange={() => setBatchStatus({...batchStatus, [student.id]: 'LATE'})} />
                               <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>Retard</span>
                             </label>
                          </div>
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

export default Absences;

