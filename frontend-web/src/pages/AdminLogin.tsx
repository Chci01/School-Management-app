import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ThemeToggle';
import { BackButton } from '../components/common/BackButton';
import logo from '../assets/logo.png';

const AdminLogin = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ matricule, password, schoolId: null });
  };

  return (
    <div className="login-container">
      <BackButton absolute={true} />
      <div className="glass-panel login-box admin-login-box" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="login-header" style={{ position: 'relative' }}>
           <div style={{ position: 'absolute', top: 0, right: 0 }}>
               <ThemeToggle />
           </div>
           <div className="logo-placeholder" style={{ backgroundColor: 'transparent', margin: '0 auto', width: '160px', height: 'auto', marginBottom: '10px' }}>
               <img src={logo} alt="KalanSira Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '12px' }} />
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


          <div className="input-group">
            <label>Identifiant (Email ou Matricule)</label>
            <input 
               type="text" 
               placeholder="Email ou Matricule admin" 
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

          <button type="submit" className="btn-primary" disabled={isLoading}>
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
