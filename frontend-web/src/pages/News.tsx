import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Image, Video, Trash2, Plus, Calendar, User, Newspaper, Send, X, Search } from 'lucide-react';

export const News = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Fetch News
  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['news', user?.schoolId],
    queryFn: async () => {
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

  if (isLoading) {
    return (
      <div className="page-container" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="spinner" style={{ color: 'var(--primary)', marginBottom: '16px' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Chargement du fil d'actualités...</p>
      </div>
    );
  }

  const filteredNews = (newsItems || []).filter((n: any) => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', color: 'var(--primary)' }}>
            <Newspaper size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Journal de l'Établissement</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Partagez les moments forts et les informations importantes.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)', width: '300px' }}>
                <Search size={18} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', width: '100%', color: 'var(--text)' }} 
                />
            </div>
            {['SUPER_ADMIN', 'ADMIN_ECOLE', 'ENSEIGNANT'].includes(user?.role || '') && (
              <button 
                className="btn-primary" 
                onClick={() => setIsModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
              >
                 <Plus size={20} /> Publier un article
              </button>
            )}
        </div>
      </header>

      <div className="news-feed" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
         {filteredNews.length === 0 && (
           <div className="glass-panel" style={{ padding: '64px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed var(--border)', gridColumn: '1 / -1' }}>
              <Newspaper size={48} style={{ margin: '0 auto 20px', opacity: 0.1 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Aucun article ne correspond à votre recherche.</p>
           </div>
         )}
         {filteredNews.map((news: any) => (
           <article key={news.id} className="glass-panel card-hover" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)' }}>
              <div style={{ height: '200px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                 <Newspaper size={48} style={{ opacity: 0.2 }} />
                 {['SUPER_ADMIN', 'ADMIN_ECOLE'].includes(user?.role || '') && (
                    <button 
                      onClick={() => { if(window.confirm('Supprimer cette actualité ?')) deleteNewsMutation.mutate(news.id) }} 
                      style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '10px', padding: '8px', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                 )}
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Calendar size={14} />
                    {new Date(news.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.4rem', fontWeight: 800, lineHeight: '1.3' }}>{news.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '24px' }}>
                    {news.content}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                           <User size={16} color="var(--primary)" />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{news.authorName || 'Équipe KalanSira'}</span>
                     </div>
                     <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                        {(() => {
                            try {
                               const imgs = typeof news.images === 'string' ? JSON.parse(news.images) : news.images;
                               return imgs && imgs.length > 0 ? <Image size={18} /> : null;
                            } catch(e) { return null; }
                        })()}
                        {(() => {
                            try {
                               const vids = typeof news.videos === 'string' ? JSON.parse(news.videos) : news.videos;
                               return vids && vids.length > 0 ? <Video size={18} /> : null;
                            } catch(e) { return null; }
                        })()}
                     </div>
                  </div>
              </div>
           </article>
         ))}
      </div>

      {/* Modal create */}
      {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content glass-panel" style={{ width: '700px', maxWidth: '95%', padding: '40px', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Nouvel Article</h3>
                    <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={28} />
                    </button>
                  </div>
                  
                  <div className="input-group" style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Titre de l'article</label>
                      <input 
                        type="text" 
                        placeholder="Donnez un titre accrocheur..." 
                        style={{ width: '100%', padding: '14px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '1rem' }} 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      />
                  </div>
                  
                  <div className="input-group" style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Contenu / Corps du texte</label>
                      <textarea 
                        rows={8} 
                        placeholder="Racontez votre histoire ici..." 
                        style={{ width: '100%', padding: '16px 20px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '16px', fontSize: '1rem', lineHeight: '1.6', resize: 'vertical' }}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                      ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                      <button className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={createNewsMutation.isPending} style={{ flex: 1, padding: '16px', borderRadius: '14px' }}>Annuler</button>
                      <button 
                        className="btn-primary" 
                        disabled={createNewsMutation.isPending || !formData.title || !formData.content} 
                        style={{ flex: 2, padding: '16px', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        onClick={() => {
                          createNewsMutation.mutate({
                              ...formData,
                              schoolId: user?.role === 'SUPER_ADMIN' ? null : user?.schoolId,
                              authorId: user?.id,
                              authorName: `${user?.firstName} ${user?.lastName}`,
                              images: [],
                              videos: [],
                              publishedAt: new Date().toISOString()
                          });
                        }}
                      >
                         <Send size={20} />
                         {createNewsMutation.isPending ? 'Publication en cours...' : 'Publier l\'article'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
