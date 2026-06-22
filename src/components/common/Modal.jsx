import React, { useEffect } from 'react';
export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px', color: '#000' }} onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose} style={{ marginTop: '15px', width: '100%' }}>Tutup (ESC)</button>
      </div>
    </div>
  );
}
