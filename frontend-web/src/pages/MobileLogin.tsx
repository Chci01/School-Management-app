import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ThemeToggle';
import { User, Lock, ChevronRight } from 'lucide-react';
import { BackButton } from '../components/common/BackButton';
import logo from '../assets/logo.png';
import '../MobileAesthetics.css';

const MobileLogin = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ matricule, password, schoolId: null });
  };

  return (
    <div className="login-container mobile-login-page" style={{ 
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0'
    }}>
      <BackButton absolute={true} />
      <div style={{ 
        background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', 
        height: '35vh', 
        width: '100%', 
        borderBottomLeftRadius: '40px', 
        borderBottomRightRadius: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative'
      }}>
         <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <ThemeToggle />
         </div>
         <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '24px', marginBottom: '15px' }}>
            <img src={logo} alt="KalanSira Logo" style={{ width: '80px', height: 'auto', filter: 'brightness(0) invert(1)' }} />
         </div>
         <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>KalanSira</h1>
         <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Votre portail éducatif intelligent</p>
      </div>

      <div style={{ 
        marginTop: '-40px', 
        padding: '0 24px', 
        width: '100%',
        maxWidth: '500px',
        margin: '-40px auto 0 auto'
      }}>
        <div className="glass-panel" style={{ 
          background: 'white', 
          padding: '32px', 
          borderRadius: '32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>Connexion</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Entrez vos identifiants pour accéder à votre espace.</p>
          </div>
          
          {error && (
            <div style={{ 
              color: '#EF4444', 
              marginBottom: '20px', 
              fontSize: '0.85rem', 
              backgroundColor: '#FEF2F2', 
              padding: '12px', 
              borderRadius: '12px',
              border: '1px solid #FEE2E2',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
               Identifiants invalides ou erreur de connexion.
            </div>
          )}

          <form onSubmit={handleSubmit}>


            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '8px', display: 'block' }}>Matricule</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  placeholder="Ex: 2024-STUD-001" 
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px 14px 48px', 
                    borderRadius: '16px', 
                    border: '1.5px solid #F1F5F9', 
                    background: '#F8FAFC',
                    fontSize: '0.95rem',
                    color: '#1E293B'
                  }}
                />
              </div>
            </div>
            
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '8px', display: 'block' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px 14px 48px', 
                    borderRadius: '16px', 
                    border: '1.5px solid #F1F5F9', 
                    background: '#F8FAFC',
                    fontSize: '0.95rem',
                    color: '#1E293B'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              style={{ 
                width: '100%', 
                padding: '16px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)', 
                color: 'white', 
                border: 'none', 
                fontSize: '1rem', 
                fontWeight: 700, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)'
              }}
            >
              {isLoading ? 'Connexion en cours...' : (
                <>
                  Se Connecter <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
             <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Vous rencontrez un problème ?</p>
             <a href="mailto:support@kalansira.com" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                Contacter le support
             </a>
          </div>
        </div>
        
        <div style={{ marginTop: '30px', textAlign: 'center', paddingBottom: '40px' }}>
           <a href="#/admin/login" style={{ 
             color: '#64748B', 
             textDecoration: 'none', 
             fontSize: '0.85rem', 
             background: 'rgba(255,255,255,0.5)', 
             padding: '8px 16px', 
             borderRadius: '20px',
             border: '1px solid #E2E8F0'
           }}>
              Portail Administration
           </a>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;

