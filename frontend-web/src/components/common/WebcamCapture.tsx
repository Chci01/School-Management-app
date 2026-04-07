import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react'; // Vite/Lucide-react already available

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

const WebcamCapture = ({ onCapture, onCancel }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 400, height: 400 } // Square crop optimized for IDs/Profils
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions du navigateur.');
      console.error(err);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Hook startup
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.9); // 90% quality JPEG
        setCapturedImage(imageBase64);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  return (
    <div className="webcam-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="webcam-modal glass-panel" style={{
        padding: '24px', borderRadius: '16px', maxWidth: '500px', width: '100%', textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Photo d'Identité</h3>
        
        {error ? (
          <div className="alert-error" style={{ color: 'var(--danger)', marginBottom: '20px' }}>{error}</div>
        ) : (
          <div className="camera-viewport" style={{
            position: 'relative', width: '100%', aspectRatio: '1/1', background: '#000', 
            borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
             {!capturedImage ? (
                <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
                />
             ) : (
                <img 
                   src={capturedImage} 
                   alt="Captured" 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
             )}
             <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        <div className="camera-controls" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
             {!capturedImage ? (
                <>
                  <button className="btn-secondary" onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <X size={18} /> Annuler
                  </button>
                  <button className="btn-primary" onClick={capturePhoto} disabled={!!error} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Camera size={18} /> Capturer
                  </button>
                </>
             ) : (
                <>
                  <button className="btn-secondary" onClick={retakePhoto} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <RefreshCw size={18} /> Reprendre
                  </button>
                  <button className="btn-primary" onClick={confirmPhoto} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--success)', borderColor: 'var(--success)' }}>
                     <Check size={18} /> Confirmer
                  </button>
                </>
             )}
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
