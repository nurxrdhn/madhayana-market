import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = (e) => {
    e.preventDefault();
    // Simulasi Login Email berhasil langsung menjadi Buyer
    setUser({ role: 'Buyer', id: 'BYR-2026-089123' });
    alert('Login via Email Sukses sebagai Buyer!');
  };

  const handleGoogleLogin = () => {
    // Simulasi Firebase Google Login
    setUser({ role: 'Seller', id: 'SLR-2026-044211' });
    alert('Login via Google Firebase Sukses sebagai Seller!');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #E2E8F0', borderRadius: '12px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#0052FF', marginBottom: '20px' }}>Masuk Madhayana Market</h2>
      
      <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Email Anda" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0052FF', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Masuk dengan Email</button>
      </form>

      <div style={{ textTransform: 'uppercase', textAlign: 'center', margin: '20px 0', fontSize: '12px', color: '#94A3B8' }}>atau</div>

      <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '10px', backgroundColor: '#FFFFFF', color: '#334155', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        🌐 Masuk Direct Google
      </button>
    </div>
  );
}
