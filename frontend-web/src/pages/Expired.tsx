const Expired = () => {
  return (
    <div className="login-container">
      <div className="glass-panel login-box" style={{ textAlign: 'center' }}>
        <div className="login-header">
           <div className="logo-placeholder" style={{ backgroundColor: 'var(--danger)' }}></div>
           <h2 style={{ color: 'var(--danger)' }}>Accès Bloqué</h2>
           <p>Abonnement expiré ou compte inactif</p>
        </div>
        
        <div style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
             Le système a détecté que la licence d'utilisation de votre école a expiré, ou que le compte a été suspendu par l'administration générale.
        </div>
        <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
             Veuillez contacter le support ou la direction pour renouveler l'abonnement et rétablir l'accès à vos données.
        </div>
        
        <a href="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default Expired;
