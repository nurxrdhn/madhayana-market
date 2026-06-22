import React from 'react';

export default function SupervisorDashboard() {
  const auditLogs = [
    { id: 1, action: "Approved PROD-091", staff: "OP-Iis2026", date: "2026-06-22" },
    { id: 2, action: "Processed Refund INV-882", staff: "CS-Team", date: "2026-06-22" }
  ];

  return (
    <div style={{ fontFamily: 'Arial', padding: '30px', backgroundColor: '#F1F5F9', minHeight: '100vh' }}>
      <h2 style={{ color: '#334155' }}>📊 Supervisor Analytics & Audit Panel</h2>
      
      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div style={{ backgroundColor: '#FFF', padding: '15px', border: '1px solid #CBD5E1', flex: 1 }}>
          <p style={{ margin: 0, color: '#64748B' }}>Total Gross Volume</p>
          <h3>Rp 45.230.000</h3>
        </div>
        <div style={{ backgroundColor: '#FFF', padding: '15px', border: '1px solid #CBD5E1', flex: 1 }}>
          <p style={{ margin: 0, color: '#64748B' }}>Platform Fee (2%) Earned</p>
          <h3 style={{ color: '#0F172A' }}>Rp 904.600</h3>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', padding: '20px', border: '1px solid #CBD5E1' }}>
        <h3>📝 System Activity Log</h3>
        {auditLogs.map(log => (
          <div key={log.id} style={{ borderBottom: '1px solid #F1F5F9', padding: '8px 0', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span>{log.action} ({log.staff})</span>
            <span style={{ color: '#94A3B8' }}>{log.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
