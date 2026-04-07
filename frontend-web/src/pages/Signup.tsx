import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';

const Signup = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');
    try {
      await api.post('/registration/signup', formData);
      setStatus('SUCCESS');
    } catch (err: any) {
      setStatus('ERROR');
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la création du compte.');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="login-container">
        <div className="glass-panel login-box success-box" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="success-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>Compte Créé avec Succès !</h2>
          <p style={{ fontSize: '18px', marginBottom: '24px' }}>
            Votre compte pour <strong>{formData.schoolName}</strong> a été créé avec succès.
          </p>
          <div className="alert-info" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
             <p style={{ margin: 0 }}>Il doit maintenant être activé avec une licence pour accéder au logiciel.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/activate')} style={{ width: '100%', padding: '15px' }}>
            Activer ma licence
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="glass-panel login-box" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="login-header">
           <div style={{ position: 'absolute', top: 20, right: 20 }}>
               <ThemeToggle />
           </div>
           <h2>Créer un compte école</h2>
           <p>Inscrivez votre établissement dès aujourd'hui</p>
        </div>

        {status === 'ERROR' && (
          <div className="alert-error" style={{ marginBottom: '16px' }}>
             {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nom de l'école</label>
            <input 
              type="text" 
              placeholder="Ex: École Excellence"
              value={formData.schoolName}
              onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label>Adresse Email</label>
            <input 
              type="email" 
              placeholder="admin@ecole.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={status === 'LOADING'}>
            {status === 'LOADING' ? 'Création en cours...' : 'Créer mon compte'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/admin/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
               Déjà un compte ? Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
