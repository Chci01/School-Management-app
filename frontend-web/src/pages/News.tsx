import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Image, Video, Trash2, Plus } from 'lucide-react';

export const News = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Fetch News
  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['news', user?.schoolId],
    queryFn: async () => {
      // If superadmin, fetch all, else fetch school specific
      const url = user?.role === 'SUPER_ADMIN' ? '/news' : `/news/school/${user?.schoolId}`;
      const res = await api.get(url);
      return res.data;
    },
    enabled: !!user,
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => api.post('/news', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setIsModalOpen(false);
      setFormData({ title: '', content: '' });
    }
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/news/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] })
  });

  if (isLoading) return <div className="page-container" style={{ padding: '24px' }}>Chargement des actualités...</div>;

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Actualités & Annonces</h2>
          <p>Informez les élèves, parents et professeurs des nouveautés de l'école.</p>
        </div>
        {['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(user?.role || '') && (
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
             <Plus size={16} /> Publier
          </button>
        )}
      </header>

      <div className="news-feed" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
         {newsItems?.length === 0 && (
           <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', gridColumn: '1 / -1' }}>
              Aucune actualité publiée pour le moment.
           </div>
         )}
         {newsItems?.map((news: any) => (
           <article key={news.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                 <h3 style={{ margin: 0, fontSize: '18px' }}>{news.title}</h3>
                 {['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user?.role || '') && (
                   <button 
                     onClick={() => { if(window.confirm('Supprimer cette actualité ?')) deleteNewsMutation.mutate(news.id) }} 
                     className="btn-secondary" 
                     style={{ padding: '6px', color: 'var(--danger)', borderColor: 'transparent' }}
                   >
                     <Trash2 size={16} />
                   </button>
                 )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', flex: 1 }}>{news.content}</p>
              
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                 <span>Publié le {new Date(news.publishedAt).toLocaleDateString()}</span>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    {(() => {
                        try {
                           const imgs = typeof news.images === 'string' ? JSON.parse(news.images) : news.images;
                           return imgs && imgs.length > 0 ? <Image size={16} /> : null;
                        } catch(e) { return null; }
                    })()}
                    {(() => {
                        try {
                           const vids = typeof news.videos === 'string' ? JSON.parse(news.videos) : news.videos;
                           return vids && vids.length > 0 ? <Video size={16} /> : null;
                        } catch(e) { return null; }
                    })()}
                 </div>
              </div>
           </article>
         ))}
      </div>

      {/* Modal create */}
      {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '600px', maxWidth: '90%', padding: '24px' }}>
                  <h3>Publier une Actualité</h3>
                  <div className="input-group" style={{ marginTop: '20px' }}>
                      <label>Titre de l'annonce</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Sortie scolaire prévue le 15 Mars" 
                        style={{ width: '100%' }} 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      />
                  </div>
                  <div className="input-group">
                      <label>Contenu / Corps du texte</label>
                      <textarea 
                        rows={6} 
                        placeholder="Détails de l'actualité..." 
                        style={{ width: '100%', padding: '12px', background: 'var(--surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                      ></textarea>
                  </div>

                  {/* Future scope: Media Uploader. For now, we simulate empty arrays for DB schema constraints */}
                  <div style={{ marginTop: '16px', padding: '16px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>L'ajout de médias (Photos/Vidéos) sera branché au Storage ultérieurement.</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={createNewsMutation.isPending}>Annuler</button>
                      <button className="btn-primary" disabled={createNewsMutation.isPending || !formData.title || !formData.content} onClick={() => {
                          createNewsMutation.mutate({
                              ...formData,
                              schoolId: user?.role === 'SUPER_ADMIN' ? null : user?.schoolId,
                              images: [],
                              videos: []
                          });
                      }}>
                         {createNewsMutation.isPending ? 'Publication...' : 'Publier'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
