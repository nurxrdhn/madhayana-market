import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './AuthSlider.css';

export default function AuthSlider({ initialMode = 'login' }) {
  const { setUser } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleChoice, setRoleChoice] = useState('Buyer');

  const isRegister = mode === 'register';

  const handleEmailLogin = (e) => {
    e.preventDefault();

    // Logika lama dipertahankan
    setUser({ role: 'Buyer', id: 'BYR-2026-089123' });
    alert('Login via Email Sukses sebagai Buyer!');
  };

  const handleGoogleLogin = () => {
    // Logika lama dipertahankan
    setUser({ role: 'Seller', id: 'SLR-2026-044211' });
    alert('Login via Google Firebase Sukses sebagai Seller!');
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Logika lama dipertahankan
    alert(
      `Pendaftaran Akun Baru sebagai [${roleChoice}] Berhasil diproses!`
    );
  };

  return (
    <main className="mm-auth">
      <div className={`mm-auth-shell ${isRegister ? 'is-register' : ''}`}>

        <section className="mm-form-area">

          <div className="mm-form mm-login-form">
            <div className="mm-mobile-brand">
              <span className="mm-brand-mark">M</span>
              <span>MADHAYANA</span>
            </div>

            <span className="mm-eyebrow">WELCOME BACK</span>

            <h1>
              Masuk ke
              <br />
              Madhayana.
            </h1>

            <p className="mm-intro">
              Lanjutkan aktivitas Anda di Madhayana Market dengan akun yang
              sudah terdaftar.
            </p>

            <button
              type="button"
              className="mm-google-button"
              onClick={handleGoogleLogin}
            >
              <span className="mm-google-icon">G</span>
              <span>Masuk Direct Google</span>
            </button>

            <div className="mm-divider">
              <span />
              <small>atau gunakan email</small>
              <span />
            </div>

            <form className="mm-auth-form" onSubmit={handleEmailLogin}>
              <label>
                <span>Email</span>
                <div className="mm-input-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>

                  <input
                    type="email"
                    placeholder="nama@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>

              <label>
                <div className="mm-label-row">
                  <span>Kata sandi</span>
                  <button type="button" className="mm-text-button">
                    Lupa kata sandi?
                  </button>
                </div>

                <div className="mm-input-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    type="password"
                    placeholder="Masukkan kata sandi"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>

              <button className="mm-primary-button" type="submit">
                <span>Masuk ke akun</span>
                <span className="mm-button-arrow">→</span>
              </button>
            </form>

            <p className="mm-mobile-switch">
              Belum punya akun?
              <button type="button" onClick={() => setMode('register')}>
                Daftar
              </button>
            </p>
          </div>

          <div className="mm-form mm-register-form">
            <div className="mm-mobile-brand">
              <span className="mm-brand-mark">M</span>
              <span>MADHAYANA</span>
            </div>

            <span className="mm-eyebrow">CREATE ACCOUNT</span>

            <h1>
              Mulai dari
              <br />
              sini.
            </h1>

            <p className="mm-intro">
              Buat akun Madhayana dan tentukan peran yang paling sesuai dengan
              kebutuhan Anda.
            </p>

            <form className="mm-auth-form" onSubmit={handleRegister}>
              <label>
                <span>Username</span>
                <div className="mm-input-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21a7 7 0 0 1 14 0" />
                  </svg>

                  <input
                    type="text"
                    placeholder="Username unik"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Email</span>
                <div className="mm-input-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>

                  <input
                    type="email"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Pilih peran utama</span>

                <div className="mm-select-wrap">
                  <select
                    value={roleChoice}
                    onChange={(e) => setRoleChoice(e.target.value)}
                  >
                    <option value="Guest">
                      Guest · Hanya melihat
                    </option>

                    <option value="Buyer">
                      Buyer · Beli & Download Lisensi
                    </option>

                    <option value="Seller">
                      Seller · Jual & Kelola Produk
                    </option>
                  </select>

                  <span className="mm-select-arrow">⌄</span>
                </div>
              </label>

              <button className="mm-primary-button" type="submit">
                <span>Buat akun Madhayana</span>
                <span className="mm-button-arrow">→</span>
              </button>
            </form>

            <p className="mm-mobile-switch">
              Sudah punya akun?
              <button type="button" onClick={() => setMode('login')}>
                Masuk
              </button>
            </p>
          </div>

        </section>

        <aside className="mm-slider-panel">
          <div className="mm-panel-decoration mm-decoration-one" />
          <div className="mm-panel-decoration mm-decoration-two" />

          <div className="mm-brand">
            <div className="mm-brand-mark">M</div>

            <div className="mm-brand-name">
              <strong>MADHAYANA</strong>
              <small>MARKET</small>
            </div>
          </div>

          <div className="mm-panel-content mm-panel-register-copy">
            <span className="mm-panel-kicker">MADHAYANA MARKET</span>

            <h2>
              Belum punya
              <br />
              akun?
            </h2>

            <p>
              Bergabung dan temukan pengalaman transaksi digital yang lebih
              sederhana dalam satu tempat.
            </p>

            <div className="mm-feature-stack">
              <div>
                <i>01</i>
                <span>
                  <strong>Satu akun</strong>
                  <small>Akses ekosistem Madhayana</small>
                </span>
              </div>

              <div>
                <i>02</i>
                <span>
                  <strong>Multi peran</strong>
                  <small>Buyer, Seller, atau Guest</small>
                </span>
              </div>

              <div>
                <i>03</i>
                <span>
                  <strong>Lebih praktis</strong>
                  <small>Kelola aktivitas digital Anda</small>
                </span>
              </div>
            </div>

            <button
              className="mm-panel-button"
              type="button"
              onClick={() => setMode('register')}
            >
              Daftar sekarang
              <span>→</span>
            </button>
          </div>

          <div className="mm-panel-content mm-panel-login-copy">
            <span className="mm-panel-kicker">GOOD TO SEE YOU</span>

            <h2>
              Sudah menjadi
              <br />
              bagian kami?
            </h2>

            <p>
              Masuk kembali untuk melanjutkan aktivitas dan mengakses akun
              Madhayana Anda.
            </p>

            <div className="mm-feature-stack">
              <div>
                <i>01</i>
                <span>
                  <strong>Akses cepat</strong>
                  <small>Kembali ke akun Anda</small>
                </span>
              </div>

              <div>
                <i>02</i>
                <span>
                  <strong>Data tersimpan</strong>
                  <small>Aktivitas tetap terhubung</small>
                </span>
              </div>

              <div>
                <i>03</i>
                <span>
                  <strong>Direct login</strong>
                  <small>Masuk dengan metode yang tersedia</small>
                </span>
              </div>
            </div>

            <button
              className="mm-panel-button"
              type="button"
              onClick={() => setMode('login')}
            >
              Masuk kembali
              <span>←</span>
            </button>
          </div>

          <div className="mm-panel-footer">
            <span>madhayana.com</span>
            <span>MM / 2026</span>
          </div>
        </aside>

      </div>
    </main>
  );
}
