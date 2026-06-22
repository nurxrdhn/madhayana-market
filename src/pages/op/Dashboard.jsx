import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function OperatorDashboard() {
  const { user } = useAuth();
  const queue = [
    { id: "PROD-091", title: "React E-Commerce Script", cat: "Software" },
    { id: "PROD-092", title: "Premium Canva Template", cat: "Template" }
  ];

  return (
    <div style={{ fontFamily: 'Arial', padding: '30px', backgroundColor: '#FFF7ED', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2>Operator Control Center</h2>
          <p>ID: {user?.id || "OP-2026"}</p>
        </div>
        <button style={{ padding: '10px', backgroundColor: '#C2410C', color: '#fff', border: 'none', borderRadius: '6px' }}>➕ Banner</button>
      </div>
      <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
        <h3>🛡️ Panel Review Produk</h3>
        {queue.map(item => (
          <div key={item.id} style={{ padding: '10px', border: '1px solid #FED7AA', margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
            <div><b>[{item.cat}]</b> {item.title}</div>
            <div>
              <button style={{ backgroundColor: '#DC2626', color: '#fff', marginRight: '5px' }}>Tolak</button>
              <button style={{ backgroundColor: '#16A34A', color: '#fff' }}>Setuju</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
