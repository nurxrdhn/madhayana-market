import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function SellerDashboard() {
  const { user } = useAuth();

  // Simulasi data dari Blueprint Poin 1, 12 & 17
  const sellerStats = {
    balance: "Rp 3.450.000",
    totalSales: 12,
    commissionPaid: "2% (Marketplace Fee)",
    verificationStatus: "Terverifikasi (KTP & Rekening OK)"
  };

  const productSummary = [
    { name: "SaaS Biometric Attendance System", status: "Aktif", downloads: 8 },
    { name: "Premium Web Source Code (Grid Layout)", status: "Aktif", downloads: 4 },
    { name: "Ebook Panduan Integrasi WhatsApp API", status: "Draft", downloads: 0 }
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '30px', backgroundColor: '#F0FDF4', minHeight: '100vh' }}>
      {/* Top Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#166534', margin: 0 }}>Seller Center Dashboard</h2>
          <p style={{ color: '#3f6212', margin: '5px 0 0 0', fontSize: '14px' }}>ID Penjual: {user?.id || "SLR-2026-XXXXXX"}</p>
        </div>
        <span style={{ padding: '6px 16px', backgroundColor: '#10B981', color: '#fff', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
          🔒 {sellerStats.verificationStatus}
        </span>
      </div>

      {/* 4 GRID OVERVIEW WIDGETS (Blueprint 12) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: '14px', color: '#166534' }}>💰 Saldo Pendapatan</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', marginTop: '5px' }}>{sellerStats.balance}</div>
        </div>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: '14px', color: '#166534' }}>📈 Total Produk Terjual</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B', marginTop: '5px' }}>{sellerStats.totalSales} Kali</div>
        </div>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: '14px', color: '#166534' }}>✂️ Potongan Komisi</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', marginTop: '8px' }}>{sellerStats.commissionPaid}</div>
        </div>
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: '14px', color: '#166534' }}>🚀 Menu Kontrol</div>
          <button style={{ marginTop: '5px', width: '100%', padding: '6px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
            + Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* PRODUCT MANAGEMENT LIST (Blueprint Poin 12) */}
      <div style={{ backgroundColor: '#FFF', padding: '25px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#166534' }}>📦 Daftar & Status Produk Digital</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {productSummary.map((prod, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1E293B' }}>{prod.name}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Total Diunduh Buyer: <b>{prod.downloads}x</b></p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ 
                  fontSize: '12px', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold',
                  backgroundColor: prod.status === "Aktif" ? '#D1FAE5' : '#FEF3C7', 
                  color: prod.status === "Aktif" ? '#065F46' : '#D97706' 
                }}>
                  {prod.status}
                </span>
                <button style={{ padding: '6px 12px', backgroundColor: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                  Kelola
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
