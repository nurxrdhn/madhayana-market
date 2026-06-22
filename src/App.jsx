import React from 'react';
import Home from './pages/home/Home';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Komponen Detektor Eror Darurat
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Misteri Layar Putih:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#991B1B', backgroundColor: '#FEF2F2', fontFamily: 'Arial' }}>
          <h2>🚨 Waduh, React Mengalami Crash!</h2>
          <p><b>Pesan Eror:</b> {this.state.error?.toString()}</p>
          <p>Coba kirim tulisan di atas ke chat ini biar kita bereskan!</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
