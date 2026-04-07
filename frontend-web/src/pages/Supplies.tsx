import { useState } from 'react';
import { useSupplies } from '../hooks/useSupplies';
// Temporary stub for useClasses
const useClasses = () => ({ classes: [], isLoading: false });

const Supplies = () => {
  const { supplies, isLoading, createSupply, deleteSupply } = useSupplies();
  const { classes } = useClasses();

  const [formData, setFormData] = useState({
    name: '',
    type: 'SUPPLY',
    price: '',
    description: '',
    classId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.classId || !formData.name) return alert('Classe et Nom obligatoires');
    
    setIsSubmitting(true);
    try {
      await createSupply({
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
      });
      setFormData({ name: '', type: 'SUPPLY', price: '', description: '', classId: '' });
    } catch (error) {
      alert("Erreur lors de l'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 p-6 glass-panel rounded-2xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fournitures & Tenues</h1>
          <p className="text-neutral-400">Configurez les listes par classe (livres, cahiers, tenues).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="glass-panel p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-bold mb-4">Ajouter un article</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-neutral-400">Classe</label>
              <select className="glass-input w-full mt-1" value={formData.classId} onChange={(e) => setFormData({...formData, classId: e.target.value})} required>
                <option value="">Sélectionner une classe</option>
                {classes?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-400">Nom de l'article</label>
              <input type="text" className="glass-input w-full mt-1" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ex: Tenue de Sport, Livre de Math..." required />
            </div>
            <div>
              <label className="text-sm text-neutral-400">Type</label>
              <select className="glass-input w-full mt-1" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="SUPPLY">Fournitures / Livres</option>
                <option value="UNIFORM">Tenue Scolaire</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-400">Prix (Optionnel)</label>
              <input type="number" className="glass-input w-full mt-1" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="Prix en FCFA" />
            </div>
            <div>
              <label className="text-sm text-neutral-400">Description</label>
              <textarea className="glass-input w-full mt-1 h-20" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Détails, couleur, etc." />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary mt-2">
              {isSubmitting ? 'Ajout...' : 'Ajouter à la liste'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Articles Enregistrés</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--glass-border)] text-sm text-neutral-400">
                  <th className="p-4">Article</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Classe</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplies?.map((s: any) => (
                  <tr key={s.id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-neutral-400">{s.description}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${s.type === 'UNIFORM' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="p-4">{s.class?.name || 'Toutes'}</td>
                    <td className="p-4 font-bold">{s.price ? `${s.price} FCFA` : '-'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => deleteSupply(s.id)} className="text-red-400 hover:text-red-300">Supprimer</button>
                    </td>
                  </tr>
                ))}
                {supplies?.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Aucun article enregistré.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supplies;
