import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSchools } from '../hooks/useSchools';
import { ThemeToggle } from '../components/ThemeToggle';

const MobileLogin = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const { login, isLoading, error } = useAuth();
  const { data: schools, isLoading: isLoadingSchools } = useSchools();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ matricule, password, schoolId });
  };

  return (
    <div className="login-container mobile-login-container">
      <div className="glass-panel login-box mobile-login-box">
        <div className="login-header" style={{ position: 'relative' }}>
           <div style={{ position: 'absolute', top: 0, right: 0 }}>
               <ThemeToggle />
           </div>
           <div className="logo-placeholder" style={{ backgroundColor: 'transparent', margin: '0 auto', width: '160px', height: 'auto', marginBottom: '10px' }}>
              <img src="/logo.png" alt="KalanSira Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '12px' }} />
           </div>
           <h2>Espace Utilisateur</h2>
           <p>Étudiants, Parents & Professeurs</p>
        </div>
        
        {error && (
          <div className="alert-error" style={{ color: 'var(--danger)', marginBottom: '16px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>
             Identifiants invalides ou école non sélectionnée.
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Votre Établissement</label>
            <select 
               value={schoolId} 
               onChange={(e) => setSchoolId(e.target.value)} 
               required
               disabled={isLoadingSchools}
               className="school-select"
            >
              <option value="">Sélectionnez une école...</option>
              {schools?.map(school => (
                <option key={school.id} value={school.id}>
                   {school.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Matricule / Identifiant</label>
            <input 
               type="text" 
               placeholder="Entrez votre matricule" 
               value={matricule}
               onChange={(e) => setMatricule(e.target.value)}
               required 
            />
          </div>
          
          <div className="input-group">
            <label>Mot de passe</label>
            <input 
               type="password" 
               placeholder="••••••••" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading || isLoadingSchools} style={{ marginTop: '10px', width: '100%', padding: '14px', fontSize: '16px' }}>
              {isLoading ? 'Connexion...' : 'Se Connecter'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
             <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Vous êtes un administrateur ?</p>
             <a href="#/admin/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                Accéder au Portail Administration
             </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileLogin;
