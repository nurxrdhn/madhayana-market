import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function OperatorDashboard() {
  const { user } = useAuth();

  // Simulasi antrean tugas moderasi produk digital V100 (Blueprint 13)
  const moderationQueue = [
    { id: "PROD-091", title: "Source Code Script E-Commerce React", seller: "SLR-2026-044211", category: "Software" },
    { id: "PROD-092", title: "Template Canva Microblogging Premium", seller: "SLR-2026-011234", category: "Template" }
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '30px', backgroundColor: '#FFF7ED', minHeight: '100vh' }}>
      {/* Top Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#C2410C', margin: 0 }}>Operator Control Center</h2>
          <p style={{ color: '#9A3412', margin: '5px 0 0 0', fontSize: '14px' }}>ID Operator: {user?.id || "OP-2026-XXXXXX"}</p>
        </div>
        
        {/* Aturan UI/UX Poin 25: Tombol "+" hanya muncul untuk OP, SPV, ADM */}
        <button style={{ padding: '10px 20px', backgroundColor: '#C2410C', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
          ➕ Tambah Banner Baru
        </button>
      </div>

      {/* STATUS OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
          <div style={{ fontSize: '14px', color: '#7C2D12' }}>⏳ Antrean Moderasi Produk</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#EA580C', marginTop: '5px' }}>{moderationQueue.length} Produk</div>
        </div>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
          <div style={{ fontSize: '14px', color: '#7C2D12' }}>🎫 Tiket CS Aktif</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#EA580C', marginTop: '5px' }}>4 Tiket</div>
        </div>
      </div>

      {/* MODERATION BOARD */}
      <div style={{ backgroundColor: '#FFF', padding: '25px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#7C2D12' }}>🛡️ Panel Review & Verifikasi Produk Digital</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {moderationQueue.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#FAFAFA' }}>
              <div>
                <span style={{ fontSize: '11px', backgroundColor: '#FFEDD5', color: '#C2410C', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{item.category}</span>
                <h4 style={{ margin: '5px 0 2px 0', color: '#1E293B' }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Pengirim: {item.seller}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ padding: '6px 14px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Setujui
                </button>
                <button style={{ padding: '6px 14px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
