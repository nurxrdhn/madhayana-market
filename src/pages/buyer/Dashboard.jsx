import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function BuyerDashboard() {
  const { user } = useAuth();

  // Simulasi data dari Blueprint Poin 11 & 16
  const buyerStats = {
    coins: 120,
    membership: "Gold Member",
    referralCode: "MADHA-IIS2026",
    totalOrders: 4
  };

  const activeLicenses = [
    { id: "INV-9921", item: "SaaS Biometric Attendance System", status: "Siap Diunduh", type: "Software" },
    { id: "INV-9905", item: "Premium Web Source Code (Grid Layout)", status: "Sudah Diunduh", type: "Template" }
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '30px', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#1E293B', margin: 0 }}>Buyer Center Dashboard</h2>
          <p style={{ color: '#64748B', margin: '5px 0 0 0', fontSize: '14px' }}>ID: {user?.id || "BYR-2026-XXXXXX"}</p>
        </div>
        <span style={{ padding: '6px 16px', backgroundColor: '#0052FF', color: '#fff', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
          Status: Akun Aktif
        </span>
      </div>

      {/* 4 GRID OVERVIEW WIDGETS (Blueprint 11) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '14px', color: '#64748B' }}>🪙 Saldo Koin</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#D97706', marginTop: '5px' }}>{buyerStats.coins} Koin</div>
        </div>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '14px', color: '#64748B' }}>💎 Tingkat Membership</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7C3AED', marginTop: '5px' }}>{buyerStats.membership}</div>
        </div>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '14px', color: '#64748B' }}>🔗 Kode Referral Anda</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0052FF', marginTop: '8px' }}>{buyerStats.referralCode}</div>
        </div>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '14px', color: '#64748B' }}>📦 Total Transaksi</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0F172A', marginTop: '5px' }}>{buyerStats.totalOrders} Pesanan</div>
        </div>
      </div>

      {/* DOWNLOAD CENTER & LICENSES (Blueprint Poin 11 & 16) */}
      <div style={{ backgroundColor: '#FFF', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1E293B' }}>💾 Download Center & Lisensi Saya</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activeLicenses.map((lic, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #F1F5F9', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
              <div>
                <span style={{ fontSize: '11px', backgroundColor: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{lic.type}</span>
                <h4 style={{ margin: '5px 0 2px 0', color: '#1E293B' }}>{lic.item}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Invoice ID: {lic.id}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: lic.status === "Siap Diunduh" ? '#059669' : '#64748B' }}>
                  • {lic.status}
                </span>
                <button style={{ padding: '8px 16px', backgroundColor: lic.status === "Siap Diunduh" ? '#0052FF' : '#94A3B8', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: lic.status === "Siap Diunduh" ? 'pointer' : 'not-allowed' }}>
                  {lic.status === "Siap Diunduh" ? "Download (Max 1GB)" : "Download Lagi"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
