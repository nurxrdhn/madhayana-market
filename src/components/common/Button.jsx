import React from 'react';
export default function Button({ children, onClick, type = 'button', variant = 'primary' }) {
  const style = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: variant === 'primary' ? '#0052FF' : '#E2E8F0',
    color: variant === 'primary' ? '#FFFFFF' : '#1A202C'
  };
  return <button type={type} style={style} onClick={onClick}>{children}</button>;
}
