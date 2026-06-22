import React from 'react';
export default function SearchBar({ onSearch }) {
  return (
    <input 
      type="text" 
      placeholder="Cari software, aplikasi, jasa digital..." 
      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
      onChange={(e) => onSearch && onSearch(e.target.value)}
    />
  );
}
