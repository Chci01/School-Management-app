import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ absolute = true }: { absolute?: boolean }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: absolute ? 'absolute' : 'relative',
        top: absolute ? '20px' : '0',
        left: absolute ? '20px' : '0',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        color: 'inherit',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out'
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.4)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      title="Retour"
    >
      <ArrowLeft size={20} />
    </button>
  );
};
