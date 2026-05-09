import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';
const hooksDir = 'src/hooks';

// --- Create useClasses hook ---
const useClassesContent = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useClasses = (schoolId?: string, academicYearId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['classes', { schoolId, academicYearId }],
    queryFn: async () => {
      const response = await api.get('/classes', { params: { schoolId, academicYearId } });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/classes', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(\`/classes/\${id}\`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });

  return {
    classes: data || [],
    isLoading,
    error,
    createClass: createMutation.mutate,
    isCreating: createMutation.isPending,
    deleteClass: deleteMutation.mutate,
  };
};
`;
fs.writeFileSync(path.join(hooksDir, 'useClasses.ts'), useClassesContent);

// --- Generic Users Page Generator ---
const generateUserPage = (role, title, singular, icon) => `
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { ${icon}, Plus, Search, Trash2, Edit } from 'lucide-react';

const ${role} = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { users, isLoading, error, deleteUser } = useUsers(undefined, '${role === 'Students' ? 'ELEVE' : role === 'Parents' ? 'PARENT' : 'ENSEIGNANT'}');

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <${icon} size={28} color="#3B82F6" />
            Gestion des ${title}
          </h2>
          <p style={{ color: '#64748B', marginTop: '4px' }}>Consultez, ajoutez ou modifiez les profils des ${title.toLowerCase()}.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Ajouter un ${singular}
        </button>
      </div>

      <div className="dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', padding: '8px 16px', borderRadius: '8px', width: '300px' }}>
            <Search size={18} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', color: '#0F172A' }} 
            />
          </div>
        </div>

        {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>Erreur de chargement.</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Photo</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Matricule</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nom Complet</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Contact</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user: any) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px' }}>
                  <img src={user.photo || 'https://via.placeholder.com/40'} alt={user.firstName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#475569' }}>{user.matricule}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0F172A' }}>{user.firstName} {user.lastName}</td>
                <td style={{ padding: '12px 16px', color: '#64748B' }}>
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
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>Aucun résultat trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ${role};
`;

fs.writeFileSync(path.join(pagesDir, 'Students.tsx'), generateUserPage('Students', 'Élèves', 'élève', 'Users'));
fs.writeFileSync(path.join(pagesDir, 'Parents.tsx'), generateUserPage('Parents', 'Parents', 'parent', 'Users'));
fs.writeFileSync(path.join(pagesDir, 'Teachers.tsx'), generateUserPage('Teachers', 'Enseignants', 'enseignant', 'Users'));

// --- Classes Page Generator ---
const classesContent = `
import { useState } from 'react';
import { useClasses } from '../hooks/useClasses';
import { Layers, Plus, Search, Trash2, Edit } from 'lucide-react';

const Classes = () => {
  const { classes, isLoading, error, deleteClass } = useClasses();

  if (isLoading) return <div className="dashboard-container"><div className="spinner">Chargement...</div></div>;

  const displayedClasses = Array.isArray(classes) ? classes : [];

  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={28} color="#F97316" />
            Gestion des Classes
          </h2>
          <p style={{ color: '#64748B', marginTop: '4px' }}>Consultez, ajoutez ou modifiez les classes de l'établissement.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F97316', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Nouvelle Classe
        </button>
      </div>

      <div className="dash-card">
        {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>Erreur de chargement.</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nom de la classe</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Niveau</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedClasses.map((cls: any) => (
              <tr key={cls.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0F172A' }}>{cls.name}</td>
                <td style={{ padding: '12px 16px', color: '#64748B' }}>Niveau {cls.level}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3B82F6', marginRight: '12px' }}><Edit size={18} /></button>
                  <button onClick={() => { if(window.confirm('Supprimer ?')) deleteClass(cls.id) }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {displayedClasses.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>Aucune classe trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classes;
`;
fs.writeFileSync(path.join(pagesDir, 'Classes.tsx'), classesContent);

// --- Subjects Page Generator ---
const subjectsContent = `
import { useSubjects } from '../hooks/useSubjects';
import { BookOpen, Plus, Trash2, Edit } from 'lucide-react';

const Subjects = () => {
  const { subjects, isLoading, error, deleteSubject } = useSubjects();

  if (isLoading) return <div className="dashboard-container"><div className="spinner">Chargement...</div></div>;

  const displayedSubjects = Array.isArray(subjects) ? subjects : [];

  return (
    <div className="dashboard-container">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={28} color="#10B981" />
            Gestion des Matières
          </h2>
          <p style={{ color: '#64748B', marginTop: '4px' }}>Consultez, ajoutez ou modifiez les matières enseignées.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10B981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={18} /> Nouvelle Matière
        </button>
      </div>

      <div className="dash-card">
        {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>Erreur de chargement.</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nom</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Coefficient</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSubjects.map((sub: any) => (
              <tr key={sub.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0F172A' }}>{sub.name}</td>
                <td style={{ padding: '12px 16px', color: '#64748B' }}>{sub.coefficient}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3B82F6', marginRight: '12px' }}><Edit size={18} /></button>
                  <button onClick={() => { if(window.confirm('Supprimer ?')) deleteSubject(sub.id) }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {displayedSubjects.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>Aucune matière trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subjects;
`;
fs.writeFileSync(path.join(pagesDir, 'Subjects.tsx'), subjectsContent);

console.log('Pages generated successfully!');
