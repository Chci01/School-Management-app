import { useState } from 'react';
import { MessageSquare, Plus, Bell, X, Trash2, Send, Users } from 'lucide-react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useAuth } from '../hooks/useAuth';

const Messages = () => {
  const { currentSchoolId, user } = useAuth();
  const { announcements, isLoading, isCreating, createAnnouncement, deleteAnnouncement } = useAnnouncements(currentSchoolId!);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', target: 'ALL' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    createAnnouncement({
      title: formData.title,
      content: formData.content,
      target: formData.target,
      schoolId: currentSchoolId,
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: '', content: '', target: 'ALL' });
      }
    });
  };

  const isEditor = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_ECOLE';

  if (isLoading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner" style={{ color: '#8B5CF6' }}>Chargement des messages...</div>
      </div>
    );
  }

  const displayedAnnouncements = Array.isArray(announcements) ? announcements : [];

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8B5CF6' }}>
              <MessageSquare size={28} />
            </div>
            Messagerie & Annonces
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Gardez le contact avec l'ensemble de l'établissement.</p>
        </div>
        
        {isEditor && (
          <button 
            className="btn-primary" 
            style={{ background: '#8B5CF6', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} /> Nouvelle Annonce
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {displayedAnnouncements.map((msg: any) => (
          <div key={msg.id} className="dash-card glass-panel" style={{ padding: '24px', borderRadius: '24px', borderLeft: '4px solid #8B5CF6', display: 'flex', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <Bell size={24} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>{msg.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(msg.createdAt).toLocaleDateString('fr-FR')} {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  {isEditor && (
                    <button onClick={() => { if(window.confirm('Supprimer cette annonce ?')) deleteAnnouncement(msg.id) }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border)' }}>
                 <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>{msg.content}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Users size={14} /> 
                Destinataires: <span style={{ fontWeight: 600, color: 'var(--text)', background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px' }}>{msg.target === 'ALL' ? 'Tout le monde' : msg.target}</span>
              </div>
            </div>
          </div>
        ))}

        {displayedAnnouncements.length === 0 && (
          <div className="dash-card glass-panel" style={{ textAlign: 'center', padding: '64px 20px', borderRadius: '24px' }}>
            <MessageSquare size={48} style={{ marginBottom: '16px', color: '#8B5CF6', opacity: 0.5, margin: '0 auto' }} />
            <h3 style={{color: 'var(--text)', fontSize: '1.3rem'}}>Aucun message pour le moment</h3>
            <p style={{ marginTop: '8px', maxWidth: '400px', margin: '8px auto 0', color: 'var(--text-secondary)' }}>Commencez par ajouter des éléments à ce module pour les voir apparaître ici.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="modal-content glass-panel" style={{ width: '600px', maxWidth: '100%', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8B5CF6' }}>
                  <MessageSquare size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Envoyer une Annonce</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Objet de l'annonce</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Réunion de Parents..." style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Contenu</label>
                <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Votre message..." rows={5} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', resize: 'vertical' }}></textarea>
              </div>

              <div className="input-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Envoyer à :</label>
                <select value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  <option value="ALL">Tout le monde (Professeurs, Parents, Élèves)</option>
                  <option value="ENSEIGNANT">Enseignants uniquement</option>
                  <option value="PARENT">Parents d'élèves uniquement</option>
                  <option value="ELEVE">Élèves uniquement</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>Annuler</button>
                <button type="submit" disabled={isCreating} className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', background: '#8B5CF6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isCreating ? 0.7 : 1 }}>
                  {isCreating ? 'Envoi...' : <><Send size={20} /> Envoyer</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
