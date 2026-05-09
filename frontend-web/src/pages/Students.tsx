
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { Users, Plus, Search, Trash2, Edit } from 'lucide-react';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { currentSchoolId } = useAuth();
  const { users, isLoading, error, deleteUser } = useUsers(currentSchoolId!, 'ELEVE');

  if (isLoading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner" style={{ color: '#3B82F6' }}>Chargement...</div>
      </div>
    );
  }

  const displayedUsers = (Array.isArray(users) ? users : []).filter((u: any) => 
    (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.matricule || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={28} color="#3B82F6" />
            Gestion des Élèves
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Consultez, ajoutez ou modifiez les profils des élèves.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', color: 'var(--text)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Ajouter un élève
        </button>
      </div>

      <div className="dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '8px 16px', borderRadius: '8px', width: '300px' }}>
            <Search size={18} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', color: 'var(--text)' }} 
            />
          </div>
        </div>

        {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>Erreur de chargement.</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Photo</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Matricule</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nom Complet</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Contact</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user: any) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <img src={user.photo || 'https://via.placeholder.com/40'} alt={user.firstName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{user.matricule}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text)' }}>{user.firstName} {user.lastName}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                  <div>{user.phone || 'Non renseigné'}</div>
                  <div style={{ fontSize: '0.75rem' }}>{user.email || ''}</div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3B82F6', marginRight: '12px' }}><Edit size={18} /></button>
                  <button onClick={() => { if(window.confirm('Supprimer ?')) deleteUser(user.id) }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {displayedUsers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucun résultat trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
