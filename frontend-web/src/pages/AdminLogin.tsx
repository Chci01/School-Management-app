import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSchools } from '../hooks/useSchools';
import { ThemeToggle } from '../components/ThemeToggle';

const AdminLogin = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { login, isLoading, error } = useAuth();
  const { data: schools, isLoading: isLoadingSchools } = useSchools();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If super admin, schoolId is sent as null/undefined
    login({ matricule, password, schoolId: isSuperAdmin ? null : schoolId });
  };

  return (
    <div className="login-container">
      <div className="glass-panel login-box admin-login-box" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="login-header" style={{ position: 'relative' }}>
           <div style={{ position: 'absolute', top: 0, right: 0 }}>
               <ThemeToggle />
           </div>
           <div className="logo-placeholder" style={{ backgroundColor: 'transparent', margin: '0 auto', width: '160px', height: 'auto', marginBottom: '10px' }}>
               <img src="/logo.png" alt="KalanSira Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '12px' }} />
           </div>
           <h2>Portail Administration</h2>
           <p>Gérez votre établissement</p>
        </div>
        
        {error && (
          <div className="alert-error" style={{ color: 'var(--danger)', marginBottom: '16px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>
             Accès refusé. Vérifiez vos identifiants administrateur.
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-actions" style={{ marginBottom: '15px', justifyContent: 'center' }}>
             <label className="checkbox-container">
               <input 
                 type="checkbox" 
                 checked={isSuperAdmin} 
                 onChange={(e) => {
                     setIsSuperAdmin(e.target.checked);
                     if (e.target.checked) setSchoolId('');
                 }} 
               />
               <span className="checkmark"></span>
               Je suis un Super Administrateur (Global)
             </label>
          </div>

          {!isSuperAdmin && (
            <div className="input-group">
              <label>Établissement à administrer</label>
              <select 
                 value={schoolId} 
                 onChange={(e) => setSchoolId(e.target.value)} 
                 required={!isSuperAdmin}
                 disabled={isLoadingSchools}
                 className="school-select"
              >
                <option value="" style={{ color: 'black' }}>Sélectionnez votre école...</option>
                {schools?.map(school => (
                  <option key={school.id} value={school.id} style={{ color: 'black' }}>
                     {school.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="input-group">
            <label>Identifiant (Matricule Admin)</label>
            <input 
               type="text" 
               placeholder="Entrez votre identifiant" 
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

          <button type="submit" className="btn-primary" disabled={isLoading || (!isSuperAdmin && isLoadingSchools)}>
              {isLoading ? 'Authentification...' : 'Accéder au panneau'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
             <p style={{ opacity: 0.8 }}>Vous n'avez pas de compte ?</p>
             <a href="#/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                Créer un compte pour mon école
             </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
