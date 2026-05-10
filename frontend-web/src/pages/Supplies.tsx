import { useState } from 'react';
import { useSupplies } from '../hooks/useSupplies';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { ShoppingBag, Plus, Trash2, Tag, BookOpen, Package, X, CheckCircle } from 'lucide-react';

const Supplies = () => {
  const { currentSchoolId } = useAuth();
  const { supplies, isLoading, createSupply, deleteSupply } = useSupplies();
  const { classes } = useClasses(currentSchoolId!);

  const [formData, setFormData] = useState({
    name: '',
    type: 'SUPPLY',
    price: '',
    description: '',
    classId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.classId || !formData.name) return alert('La classe et le nom de l\'article sont obligatoires.');
    
    setIsSubmitting(true);
    try {
      await createSupply({
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        schoolId: currentSchoolId,
      });
      setFormData({ name: '', type: 'SUPPLY', price: '', description: '', classId: '' });
      setIsModalOpen(false);
    } catch (error) {
      alert("Erreur lors de l'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner" style={{ color: 'var(--primary)' }}>Chargement des fournitures...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <header className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', color: 'var(--primary)' }}>
            <ShoppingBag size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Fournitures & Uniformes</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Gérez les listes de matériel et tenues par classe.</p>
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
        >
          <Plus size={20} /> Ajouter un article
        </button>
      </header>

      <div className="dash-card glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <th style={{ padding: '0 24px' }}>Article</th>
                <th style={{ padding: '0 24px' }}>Type</th>
                <th style={{ padding: '0 24px' }}>Classe</th>
                <th style={{ padding: '0 24px' }}>Prix Estimé</th>
                <th style={{ padding: '0 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(supplies || []).map((s: any) => (
                <tr key={s.id} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                  <td style={{ padding: '20px 24px', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                          {s.type === 'UNIFORM' ? <Tag size={18} color="#F59E0B" /> : <BookOpen size={18} color="#3B82F6" />}
                       </div>
                       <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{s.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.description || 'Pas de description'}</div>
                       </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '8px', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      background: s.type === 'UNIFORM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: s.type === 'UNIFORM' ? '#F59E0B' : '#3B82F6',
                      textTransform: 'uppercase'
                    }}>
                      {s.type === 'UNIFORM' ? 'Uniforme' : 'Fourniture'}
                    </span>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                       <Package size={14} color="var(--text-muted)" />
                       {s.class?.name || 'Toutes les classes'}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                      {s.price ? `${s.price.toLocaleString()} FCFA` : 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px', textAlign: 'right', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
                    <button onClick={() => { if(window.confirm('Supprimer cet article ?')) deleteSupply(s.id) }} style={{ padding: '8px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {(supplies || []).length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.1 }} />
                    <p>Aucun article enregistré pour le moment.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '500px', maxWidth: '95%', padding: '40px', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Ajouter un Article</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nom de l'article</label>
                <input required type="text" placeholder="Ex: Tenue de Sport, Livre de Math..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                    <option value="SUPPLY">Fourniture</option>
                    <option value="UNIFORM">Uniforme</option>
                  </select>
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Prix (FCFA)</label>
                  <input type="number" placeholder="Optionnel" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Classe concernée</label>
                <select required value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  <option value="">Sélectionner une classe</option>
                  {classes?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
                <textarea rows={3} placeholder="Détails additionnels..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '16px', borderRadius: '14px' }}>Annuler</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 2, padding: '16px', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isSubmitting ? 'Ajout en cours...' : <><CheckCircle size={20} /> Enregistrer l'article</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplies;

