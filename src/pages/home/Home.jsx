import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

export default function Home() {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data untuk simulasi visual produk digital V100
  const featuredProducts = [
    { id: 1, name: "SaaS Biometric Attendance System", category: "Aplikasi", price: "Rp 450.000", rating: 4.9 },
    { id: 2, name: "Premium Web Source Code (Grid Layout)", category: "Software", price: "Rp 150.000", rating: 4.8 },
    { id: 3, name: "Custom Jasa UI/UX & Web Development", category: "Jasa", price: "Rp 800.000", rating: 5.0 },
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', paddingBottom: '50px' }}>
      {/* HEADER UTAMA */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px 30px', borderBottom: '1px solid #E2E8F0',
        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#0052FF' }}>MADHAYANA MARKET</div>
        
        {/* Search Bar */}
        <input 
          type="text" 
          placeholder="Cari software, aplikasi, atau jasa..." 
          style={{ width: '40%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Info & Menu Ringkas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px' }}>
          <span>🪙 100 Koin</span>
          <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Gold Member</span>
          <span>🔔 Notifikasi</span>
          <button onClick={toggleTheme} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div style={{ fontWeight: 'bold' }}>👤 {user?.role || 'Guest'}</div>
        </div>
      </header>

      {/* BANNER CAROUSEL SIMULATION */}
      <section style={{ margin: '30px', padding: '40px', backgroundColor: '#0052FF', color: '#fff', borderRadius: '12px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Marketplace Digital Indonesia</h1>
        <p style={{ opacity: 0.9 }}>Temukan Software, Aplikasi, Jasa, dan Sertifikasi Terintegrasi Sistem Keamanan Tinggi.</p>
      </section>

      {/* 3 GRID MENU WIDGET (Top Up, Jual, Beli) */}
      <section style={{ margin: '0 30px 30px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '600px', margin: '0 auto' }}>
          <button style={{ padding: '15px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#1E40AF' }}>
            💳 Top Up Koin
          </button>
          <button style={{ padding: '15px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#065F46' }}>
            📈 Jual Produk
          </button>
          <button style={{ padding: '15px', backgroundColor: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#9D174D' }}>
            🛒 Beli Lisensi
          </button>
        </div>
      </section>

      {/* KATEGORI PRODUK */}
      <section style={{ margin: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Kategori Pilihan</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {PRODUCT_CATEGORIES.map((cat, idx) => (
            <span key={idx} style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', color: '#334155', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* PRODUK UNGGULAN */}
      <section style={{ margin: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Produk Unggulan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {featuredProducts.map(prod => (
            <div key={prod.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', color: '#0052FF', fontWeight: 'bold' }}>{prod.category}</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{prod.name}</div>
              <div style={{ color: '#059669', fontWeight: 'bold' }}>{prod.price}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '13px' }}>⭐ {prod.rating}</span>
                <button style={{ padding: '6px 12px', backgroundColor: '#0052FF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
