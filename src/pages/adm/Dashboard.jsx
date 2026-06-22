import React from 'react';
import { PLATFORM_CONFIG } from '../../utils/constants';

export default function AdminDashboard() {
  return (
    <div style={{ fontFamily: 'Arial', padding: '30px', backgroundColor: '#FEF2F2', minHeight: '100vh' }}>
      <h2 style={{ color: '#991B1B' }}>🚨 Administrator Global Command Center (Full Access)</h2>
      
      <div style={{ backgroundColor: '#FFF', padding: '20px', border: '1px solid #FCA5A5', borderRadius: '8px', margin: '20px 0' }}>
        <h3>⚙️ Master System Configurations</h3>
        <p><b>Platform Name:</b> {PLATFORM_CONFIG.NAME}</p>
        <p><b>Domain Core:</b> {PLATFORM_CONFIG.DOMAIN}</p>
        <p><b>Max File Limit:</b> 1 GB (1024 MB)</p>
        <p><b>Account Lockout Threshold:</b> {PLATFORM_CONFIG.ACCOUNT_LOCK_ATTEMPTS} Attempts</p>
      </div>

      <div style={{ backgroundColor: '#FFF', padding: '20px', border: '1px solid #FCA5A5', borderRadius: '8px' }}>
        <h3>👥 User Management Tools</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '8px', backgroundColor: '#1E293B', color: '#fff', border: 'none', cursor: 'pointer' }}>Database Backup</button>
          <button style={{ padding: '8px', backgroundColor: '#991B1B', color: '#fff', border: 'none', cursor: 'pointer' }}>Manage Blocked IP</button>
        </div>
      </div>
    </div>
  );
}
