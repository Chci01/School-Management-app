import { useState } from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useAuth } from '../hooks/useAuth';
import { Megaphone, Plus, User, Clock, Trash2, X, Send, AlertTriangle, Info } from 'lucide-react';

const Announcements = () => {
  const { currentSchoolId, user: authUser } = useAuth();
  const { announcements, isLoading, createAnnouncement, deleteAnnouncement } = useAnnouncements(currentSchoolId || undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'INFO',
    target: 'ALL'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncement({
      ...formData,
      schoolId: currentSchoolId,
      authorId: authUser?.id,
      authorName: `${authUser?.firstName} ${authUser?.lastName}`,
      date: new Date().toISOString()
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: '', content: '', type: 'INFO', target: 'ALL' });
      }
    });
  };

  if (isLoading) {
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des annonces...</div>
          </div>
      );
  }

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', color: 'var(--primary)' }}>
            <Megaphone size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Annonces & Communication</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Communiquez avec les parents, les élèves et le personnel.</p>
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
        >
          <Plus size={20} /> Nouvelle Annonce
        </button>
      </header>

      <div className="announcements-feed" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {announcements.map((ann: any) => (
              <article key={ann.id} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', position: 'relative', borderLeft: ann.type === 'IMPORTANT' ? '6px solid #ef4444' : '6px solid var(--primary)', transition: 'transform 0.2s' }}>
                  <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                    <button 
                      onClick={() => { if(window.confirm('Supprimer cette annonce ?')) deleteAnnouncement(ann.id) }}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '8px' }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    {ann.type === 'IMPORTANT' ? <AlertTriangle size={20} color="#ef4444" /> : <Info size={20} color="var(--primary)" />}
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: ann.type === 'IMPORTANT' ? '#ef4444' : 'var(--primary)', letterSpacing: '1px' }}>
                      {ann.type === 'IMPORTANT' ? 'Urgente' : 'Information'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>{ann.title}</h3>
                  
                  <p style={{ lineHeight: '1.8', color: 'var(--text)', marginBottom: '32px', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                      {ann.content}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <User size={20} color="var(--primary)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{ann.authorName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Administrateur</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <Clock size={16} />
                        {new Date(ann.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
              </article>
          ))}

          {announcements.length === 0 && (
              <div style={{ padding: '80px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed var(--border)' }}>
                  <Megaphone size={48} style={{ margin: '0 auto 20px', opacity: 0.1 }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                      Aucune annonce n'a été publiée.
                  </p>
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: '20px' }}>Publier une première annonce</button>
              </div>
          )}
      </div>

      {/* Modal New Announcement */}
      {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '700px', maxWidth: '95%', padding: '40px', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Rédiger une Annonce</h3>
                    <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={28} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Titre de l'annonce</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Ex: Réunion de rentrée, Maintenance du système..." 
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          style={{ width: '100%', padding: '14px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} 
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Type d'importance</label>
                        <select 
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value})}
                          style={{ width: '100%', padding: '14px 20px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '12px' }}
                        >
                            <option value="INFO">Information Standard</option>
                            <option value="IMPORTANT">⚠️ Urgente / Importante</option>
                        </select>
                    </div>

                    <div className="input-group" style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Message</label>
                        <textarea 
                          required
                          placeholder="Saisissez votre message ici..." 
                          value={formData.content}
                          onChange={e => setFormData({...formData, content: e.target.value})}
                          style={{ width: '100%', minHeight: '180px', padding: '16px 20px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '16px', resize: 'vertical', fontSize: '1rem' }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '16px', borderRadius: '14px' }}>Annuler</button>
                        <button type="submit" className="btn-primary" style={{ flex: 2, padding: '16px', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                          <Send size={20} /> Diffuser l'annonce
                        </button>
                    </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default Announcements;

