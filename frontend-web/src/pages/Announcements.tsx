import { useState } from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useAuth } from '../hooks/useAuth';

const Announcements = () => {
  const { currentSchoolId } = useAuth();
  const { announcements, isLoading } = useAnnouncements(currentSchoolId || undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
      return (
          <div className="page-container" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des annonces...</div>
          </div>
      );
  }

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Tableau d'Annonces</h2>
          <p>Communiquez facilement avec les parents, élèves et le corps professoral.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Nouvelle Annonce</button>
      </header>

      <div className="announcements-feed" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
          {announcements.map((ann: any) => (
              <article key={ann.id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', position: 'relative', borderLeft: ann.type === 'IMPORTANT' ? '4px solid var(--danger)' : '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '20px', margin: 0 }}>{ann.title}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {new Date(ann.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                  </div>
                  <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
                      {ann.content}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          ✍️
                      </div>
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Par <strong>{ann.authorName}</strong></span>
                  </div>
              </article>
          ))}

          {announcements.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  Aucune annonce n'a été publiée récemment.
              </div>
          )}
      </div>

      {/* Modal New Announcement */}
      {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '600px', maxWidth: '90%', padding: '24px' }}>
                  <h3>Rédiger une Annonce</h3>
                  
                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Titre de l'annonce</label>
                      <input type="text" placeholder="Ex: Réunion Parents-Profs" style={{ width: '100%' }} />
                  </div>

                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Niveau de priorité</label>
                      <select style={{ width: '100%', padding: '10px', background: 'var(--surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}>
                          <option value="INFO">Information Normale</option>
                          <option value="IMPORTANT">Important / Urgent</option>
                      </select>
                  </div>

                  <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Contenu du message</label>
                      <textarea placeholder="Saisissez votre message ici..." style={{ width: '100%', minHeight: '150px', padding: '12px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', resize: 'vertical' }}></textarea>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Annuler</button>
                      <button className="btn-primary" onClick={() => setIsModalOpen(false)}>Diffuser l'annonce</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Announcements;
