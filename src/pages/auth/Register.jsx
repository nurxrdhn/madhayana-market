import React, { useState } from 'react';

export default function Register() {
  const [roleChoice, setRoleChoice] = useState('Buyer');

  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Pendaftaran Akun Baru sebagai [${roleChoice}] Berhasil diproses!`);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #E2E8F0', borderRadius: '12px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#0052FF', marginBottom: '10px' }}>Daftar Akun Baru</h2>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>Pilih Peran Anda sesuai Blueprint Onboarding</p>

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Username Unik" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
        <input type="email" placeholder="Email" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
        
        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Pilih Peran Utama:</label>
        <select style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }} value={roleChoice} onChange={e => setRoleChoice(e.target.value)}>
          <option value="Guest">Guest (Hanya Melihat)</option>
          <option value="Buyer">Buyer (Beli & Download Lisensi)</option>
          <option value="Seller">Seller (Jual & Kelola Produk)</option>
        </select>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Daftar Sekarang</button>
      </form>
    </div>
  );
}
