import React, { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "./styles/globals.css";

const slides = [
  {
    icon: "fi fi-rr-store-alt",
    label: "MADHAYANA MARKET",
    title: "Satu ekosistem untuk seluruh kebutuhan digital",
    description:
      "Temukan perangkat lunak, lisensi, template, kursus, jasa, dan produk digital pilihan dalam satu platform.",
  },
  {
    icon: "fi fi-rr-shield-check",
    label: "TRANSAKSI TERLINDUNGI",
    title: "Belanja lebih aman dengan perlindungan transaksi",
    description:
      "Pembayaran, pesanan, invoice, dan riwayat transaksi tercatat sehingga pembeli dan penjual mendapat perlindungan.",
  },
  {
    icon: "fi fi-rr-bolt",
    label: "CEPAT DAN PRAKTIS",
    title: "Produk digital dapat diterima lebih cepat",
    description:
      "File, lisensi, dan informasi pesanan dapat dikirim secara otomatis setelah pembayaran berhasil diverifikasi.",
  },
  {
    icon: "fi fi-rr-shop",
    label: "TUMBUH BERSAMA",
    title: "Bangun dan kembangkan toko digitalmu",
    description:
      "Reseller dapat mengelola produk, pesanan, promosi, pendapatan, serta performa toko melalui satu dashboard.",
  },
  {
    icon: "fi fi-rr-users-alt",
    label: "MULAI SEKARANG",
    title: "Pilih cara kamu menggunakan Madhayana",
    description:
      "Masuk sebagai buyer, reseller, operator, atau jelajahi produk terlebih dahulu sebagai guest.",
  },
];

const roles = [
  {
    key: "buyer",
    title: "Buyer",
    code: "BYR",
    icon: "fi fi-rr-shopping-bag",
    description: "Belanja, simpan produk favorit, dan kelola pesanan.",
    className: "buyer",
  },
  {
    key: "reseller",
    title: "Reseller",
    code: "RSL",
    icon: "fi fi-rr-shop",
    description: "Jual produk dan kelola perkembangan toko digital.",
    className: "reseller",
  },
  {
    key: "operator",
    title: "Operator",
    code: "OPR",
    icon: "fi fi-rr-headset",
    description: "Mengelola aktivitas dan operasional Madhayana Market.",
    className: "operator",
  },
  {
    key: "guest",
    title: "Guest",
    code: "GST",
    icon: "fi fi-rr-eye",
    description: "Jelajahi marketplace tanpa harus membuat akun.",
    className: "guest",
  },
];

const dashboardData = {
  buyer: {
    title: "Beranda Buyer",
    subtitle: "Temukan produk digital terbaik untuk kebutuhanmu.",
    icon: "fi fi-rr-shopping-bag",
    menus: [
      ["fi fi-rr-home", "Beranda"],
      ["fi fi-rr-box", "Pesanan"],
      ["fi fi-rr-heart", "Favorit"],
      ["fi fi-rr-download", "Unduhan"],
      ["fi fi-rr-coins", "Koin"],
      ["fi fi-rr-user", "Profil"],
    ],
    stats: [
      ["Pesanan aktif", "3", "fi fi-rr-box"],
      ["Madhayana Coin", "1.250", "fi fi-rr-coins"],
      ["Produk favorit", "12", "fi fi-rr-heart"],
    ],
  },
  reseller: {
    title: "Dashboard Reseller",
    subtitle: "Kelola penjualan dan perkembangan tokomu.",
    icon: "fi fi-rr-shop",
    menus: [
      ["fi fi-rr-home", "Ringkasan"],
      ["fi fi-rr-box-open", "Produk"],
      ["fi fi-rr-shopping-cart", "Pesanan"],
      ["fi fi-rr-chart-line-up", "Statistik"],
      ["fi fi-rr-wallet", "Saldo"],
      ["fi fi-rr-user", "Profil Toko"],
    ],
    stats: [
      ["Penjualan bulan ini", "Rp12,8 jt", "fi fi-rr-chart-histogram"],
      ["Pesanan baru", "18", "fi fi-rr-shopping-cart"],
      ["Saldo tersedia", "Rp4,6 jt", "fi fi-rr-wallet"],
    ],
  },
  operator: {
    title: "Pusat Operasional",
    subtitle: "Pantau dan kelola aktivitas marketplace.",
    icon: "fi fi-rr-headset",
    menus: [
      ["fi fi-rr-home", "Ringkasan"],
      ["fi fi-rr-check-circle", "Verifikasi Produk"],
      ["fi fi-rr-receipt", "Transaksi"],
      ["fi fi-rr-users-alt", "Pengguna"],
      ["fi fi-rr-wallet", "Settlement"],
      ["fi fi-rr-comment-alt", "Tiket Bantuan"],
    ],
    stats: [
      ["Produk menunggu", "24", "fi fi-rr-box"],
      ["Transaksi diproses", "128", "fi fi-rr-receipt"],
      ["Tiket terbuka", "17", "fi fi-rr-comment-alt"],
    ],
  },
  guest: {
    title: "Jelajahi Madhayana",
    subtitle: "Lihat produk terlebih dahulu sebelum bertransaksi.",
    icon: "fi fi-rr-eye",
    menus: [
      ["fi fi-rr-home", "Beranda"],
      ["fi fi-rr-apps", "Kategori"],
      ["fi fi-rr-sparkles", "Produk Baru"],
      ["fi fi-rr-flame", "Terlaris"],
      ["fi fi-rr-info", "Tentang"],
    ],
    stats: [
      ["Produk digital", "2.480+", "fi fi-rr-apps"],
      ["Seller aktif", "460+", "fi fi-rr-shop"],
      ["Kategori", "18", "fi fi-rr-grid"],
    ],
  },
};

const products = [
  {
    name: "Premium React Dashboard",
    category: "Template",
    price: "Rp150.000",
    icon: "fi fi-rr-layout-fluid",
  },
  {
    name: "Lisensi Aplikasi Kasir",
    category: "Software",
    price: "Rp490.000",
    icon: "fi fi-rr-computer",
  },
  {
    name: "Paket Branding UMKM",
    category: "Desain",
    price: "Rp275.000",
    icon: "fi fi-rr-palette",
  },
  {
    name: "Kursus Digital Marketing",
    category: "Kursus",
    price: "Rp119.000",
    icon: "fi fi-rr-graduation-cap",
  },
];

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.4 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function Brand() {
  return (
    <div className="modern-brand">
      <div className="modern-brand-logo">M</div>
      <div>
        <strong>MADHAYANA</strong>
        <span>MARKET</span>
      </div>
    </div>
  );
}

function MadhayanaApp() {
  const {
    user,
    loading,
    login,
    register,
    loginGoogle,
    enterAsGuest,
    logout,
  } = useAuth();

  const [page, setPage] = useState(() =>
    localStorage.getItem("madhayana_intro_done") ? "roles" : "opening"
  );
  const [slide, setSlide] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (user) setPage("dashboard");
  }, [user]);

  if (loading) {
    return (
      <main className="modern-loading">
        <div className="modern-loading-logo">M</div>
        <strong>Menyiapkan Madhayana Market</strong>
      </main>
    );
  }

  if (page === "opening") {
    const active = slides[slide];

    return (
      <main className="modern-opening">
        <div className="modern-orb orb-one" />
        <div className="modern-orb orb-two" />

        <header className="modern-topbar">
          <Brand />
          <button
            className="modern-text-button"
            onClick={() => {
              localStorage.setItem("madhayana_intro_done", "1");
              setPage("roles");
            }}
          >
            Lewati
          </button>
        </header>

        <section className="modern-opening-card">
          <div className="modern-opening-visual">
            <div className="modern-opening-icon">
              <i className={active.icon} />
            </div>
            <span>0{slide + 1}</span>
          </div>

          <div className="modern-opening-content">
            <span className="modern-eyebrow">{active.label}</span>
            <h1>{active.title}</h1>
            <p>{active.description}</p>

            <div className="modern-dots">
              {slides.map((item, index) => (
                <button
                  key={item.title}
                  className={index === slide ? "active" : ""}
                  onClick={() => setSlide(index)}
                />
              ))}
            </div>

            <div className="modern-opening-actions">
              <button
                className="modern-button secondary"
                disabled={slide === 0}
                onClick={() => setSlide((current) => current - 1)}
              >
                <i className="fi fi-rr-arrow-left" />
                Kembali
              </button>

              <button
                className="modern-button primary"
                onClick={() => {
                  if (slide === slides.length - 1) {
                    localStorage.setItem("madhayana_intro_done", "1");
                    setPage("roles");
                  } else {
                    setSlide((current) => current + 1);
                  }
                }}
              >
                {slide === slides.length - 1 ? "Mulai Sekarang" : "Selanjutnya"}
                <i className="fi fi-rr-arrow-right" />
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (page === "roles") {
    return (
      <main className="modern-role-page">
        <header className="modern-topbar">
          <Brand />
          <button
            className="modern-text-button"
            onClick={() => {
              localStorage.removeItem("madhayana_intro_done");
              setSlide(0);
              setPage("opening");
            }}
          >
            Putar ulang perkenalan
          </button>
        </header>

        <section className="modern-role-section">
          <div className="modern-heading">
            <span className="modern-eyebrow">PILIH JENIS AKSES</span>
            <h1>Kamu ingin masuk sebagai apa?</h1>
            <p>
              Tampilan, menu, dan fitur akan disesuaikan berdasarkan jenis
              pengguna yang dipilih.
            </p>
          </div>

          <div className="modern-role-grid">
            {roles.map((role) => (
              <button
                key={role.key}
                className={`modern-role-card ${role.className}`}
                onClick={() => {
                  if (role.key === "guest") {
                    enterAsGuest();
                    setPage("dashboard");
                  } else {
                    setSelectedRole(role);
                    setPage("auth");
                  }
                }}
              >
                <div className="modern-role-icon">
                  <i className={role.icon} />
                </div>

                <div className="modern-role-content">
                  <div>
                    <h2>{role.title}</h2>
                    <span>{role.code}</span>
                  </div>
                  <p>{role.description}</p>
                </div>

                <i className="fi fi-rr-arrow-up-right modern-role-arrow" />
              </button>
            ))}
          </div>

          <div className="modern-security-note">
            <i className="fi fi-rr-shield-check" />
            Operator tidak dapat mendaftar sendiri. Akun operator hanya dibuat
            oleh Super Admin.
          </div>
        </section>
      </main>
    );
  }

  if (page === "auth" && selectedRole) {
    return (
      <AuthPage
        role={selectedRole}
        login={login}
        register={register}
        loginGoogle={loginGoogle}
        onBack={() => setPage("roles")}
      />
    );
  }

  if (page === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        onLogout={async () => {
          await logout();
          setPage("roles");
        }}
      />
    );
  }

  return null;
}

function AuthPage({ role, login, register, loginGoogle, onBack }) {
  const operatorMode = role.key === "operator";
  const [mode, setMode] = useState(operatorMode ? "login" : "register");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (mode === "register" && form.password !== form.confirmPassword) {
      setMessage("Konfirmasi kata sandi tidak sama.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "register") {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: role.key,
        });
      } else {
        const profile = await login({
          email: form.email,
          password: form.password,
        });

        if (operatorMode && profile.role !== "operator") {
          throw new Error("Akun ini bukan akun operator.");
        }
      }
    } catch (error) {
      console.error("AUTH ERROR:", error);

      const firebaseMessages = {
        "auth/invalid-credential": "Email atau kata sandi tidak sesuai.",
        "auth/email-already-in-use": "Email tersebut sudah terdaftar.",
        "auth/popup-closed-by-user": "Jendela login Google ditutup.",
        "auth/popup-blocked": "Popup Google diblokir oleh browser.",
        "auth/unauthorized-domain": "Domain belum diizinkan di Firebase.",
        "auth/operation-not-allowed": "Metode login belum diaktifkan di Firebase.",
        "permission-denied": "Firestore menolak penyimpanan profil pengguna.",
      };

      setMessage(
        firebaseMessages[error.code] ||
        `${error.code || "error"}: ${error.message || "Proses autentikasi gagal."}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setMessage("");
      await loginGoogle(role.key);
    } catch (error) {
      console.error("GOOGLE AUTH ERROR:", error);

      const firebaseMessages = {
        "auth/popup-closed-by-user": "Jendela login Google ditutup.",
        "auth/popup-blocked": "Popup Google diblokir oleh browser.",
        "auth/unauthorized-domain": "Domain belum diizinkan di Firebase.",
        "auth/operation-not-allowed": "Login Google belum diaktifkan di Firebase.",
        "permission-denied": "Login berhasil, tetapi Firestore menolak penyimpanan profil.",
      };

      setMessage(
        firebaseMessages[error.code] ||
        `${error.code || "error"}: ${error.message || "Login Google gagal."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`modern-auth-page auth-${role.className}`}>
      <section className="modern-auth-visual">
        <button className="modern-back-button" onClick={onBack}>
          <i className="fi fi-rr-arrow-left" />
          Kembali
        </button>

        <div>
          <div className="modern-auth-role-icon">
            <i className={role.icon} />
          </div>
          <span className="modern-eyebrow">PORTAL {role.title.toUpperCase()}</span>
          <h1>
            {operatorMode
              ? "Kelola operasional Madhayana Market"
              : role.key === "reseller"
                ? "Bangun toko digitalmu bersama Madhayana"
                : "Nikmati pengalaman belanja digital yang lebih praktis"}
          </h1>
          <p>{role.description}</p>

          <div className="modern-auth-features">
            <span>
              <i className="fi fi-rr-check-circle" />
              Dashboard khusus berdasarkan peran
            </span>
            <span>
              <i className="fi fi-rr-check-circle" />
              Sistem autentikasi menggunakan Firebase
            </span>
            <span>
              <i className="fi fi-rr-check-circle" />
              Data akun tersimpan secara aman
            </span>
          </div>
        </div>
      </section>

      <section className="modern-auth-form-area">
        <form className="modern-auth-card" onSubmit={submit}>
          <Brand />

          <span className="modern-eyebrow">
            {mode === "register" ? "BUAT AKUN BARU" : "SELAMAT DATANG"}
          </span>

          <h2>
            {mode === "register"
              ? `Daftar sebagai ${role.title}`
              : `Masuk sebagai ${role.title}`}
          </h2>

          <p>
            {operatorMode
              ? "Gunakan akun operator yang telah diberikan oleh Super Admin."
              : "Gunakan email atau lanjutkan menggunakan akun Google."}
          </p>

          {!operatorMode && (
            <>
              <button
                type="button"
                className="modern-google-button"
                onClick={handleGoogle}
                disabled={loading}
              >
                <GoogleLogo />
                {mode === "register"
                  ? "Daftar dengan Google"
                  : "Masuk dengan Google"}
              </button>

              <div className="modern-divider">
                <span>atau gunakan email</span>
              </div>
            </>
          )}

          {mode === "register" && (
            <ModernInput
              icon="fi fi-rr-user"
              label="Nama lengkap"
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Masukkan nama lengkap"
            />
          )}

          <ModernInput
            icon="fi fi-rr-envelope"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="nama@gmail.com"
          />

          {mode === "register" && (
            <ModernInput
              icon="fi fi-rr-phone-call"
              label="Nomor WhatsApp"
              name="phone"
              value={form.phone}
              onChange={update}
              placeholder="08xxxxxxxxxx"
            />
          )}

          <ModernInput
            icon="fi fi-rr-lock"
            label="Kata sandi"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            placeholder="Minimal 6 karakter"
          />

          {mode === "register" && (
            <ModernInput
              icon="fi fi-rr-lock"
              label="Konfirmasi kata sandi"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={update}
              placeholder="Ulangi kata sandi"
            />
          )}

          {message && <div className="modern-error">{message}</div>}

          <button
            type="submit"
            className="modern-button primary full"
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : mode === "register"
                ? "Daftar dan Buka Beranda"
                : "Masuk ke Beranda"}
            <i className="fi fi-rr-arrow-right" />
          </button>

          {!operatorMode && (
            <button
              type="button"
              className="modern-switch-auth"
              onClick={() =>
                setMode((current) =>
                  current === "register" ? "login" : "register"
                )
              }
            >
              {mode === "register"
                ? "Sudah mempunyai akun? Masuk sekarang"
                : `Belum mempunyai akun? Daftar sebagai ${role.title}`}
            </button>
          )}

          {operatorMode && (
            <div className="modern-operator-note">
              <i className="fi fi-rr-shield-check" />
              Akun operator hanya dibuat oleh Super Admin.
            </div>
          )}
        </form>
      </section>
    </main>
  );
}

function ModernInput({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="modern-field">
      <span>{label}</span>
      <div>
        <i className={icon} />
        <input
          required
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function Dashboard({ user, onLogout }) {
  const role = user.role || "buyer";
  const config = dashboardData[role] || dashboardData.buyer;
  const [activeMenu, setActiveMenu] = useState(config.menus[0][1]);
  const [guestModal, setGuestModal] = useState(false);

  const firstName = useMemo(
    () => user.name?.split(" ")[0] || "Pengguna",
    [user.name]
  );

  return (
    <main className={`modern-dashboard dashboard-${role}`}>
      <header className="modern-dashboard-header">
        <Brand />

        <div className="modern-dashboard-search">
          <i className="fi fi-rr-search" />
          <input placeholder="Cari produk, software, jasa, atau kursus..." />
        </div>

        <div className="modern-dashboard-actions">
          <button>
            <i className="fi fi-rr-bell" />
          </button>
          <div className="modern-profile">
            <div className="modern-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <strong>{user.name}</strong>
              <span>{role}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="modern-dashboard-layout">
        <aside className="modern-sidebar">
          <div className="modern-role-badge">
            <i className={config.icon} />
            <span>{role}</span>
          </div>

          <nav>
            {config.menus.map(([icon, label]) => (
              <button
                key={label}
                className={activeMenu === label ? "active" : ""}
                onClick={() => setActiveMenu(label)}
              >
                <i className={icon} />
                {label}
              </button>
            ))}
          </nav>

          <button className="modern-logout" onClick={onLogout}>
            <i className="fi fi-rr-sign-out-alt" />
            Keluar
          </button>
        </aside>

        <section className="modern-main-content">
          <div className="modern-dashboard-hero">
            <div>
              <span className="modern-eyebrow">{activeMenu}</span>
              <h1>
                Halo, {firstName}
                <span>!</span>
              </h1>
              <p>{config.subtitle}</p>

              <button
                className="modern-button light"
                onClick={() => role === "guest" && setGuestModal(true)}
              >
                <i
                  className={
                    role === "reseller"
                      ? "fi fi-rr-add"
                      : role === "operator"
                        ? "fi fi-rr-dashboard-monitor"
                        : "fi fi-rr-shopping-bag"
                  }
                />
                {role === "reseller"
                  ? "Tambah Produk"
                  : role === "operator"
                    ? "Buka Monitoring"
                    : role === "guest"
                      ? "Daftar untuk Bertransaksi"
                      : "Mulai Belanja"}
              </button>
            </div>

            <div className="modern-dashboard-hero-icon">
              <i className={config.icon} />
            </div>
          </div>

          <div className="modern-stats">
            {config.stats.map(([label, value, icon]) => (
              <article key={label}>
                <div>
                  <i className={icon} />
                </div>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          <section className="modern-product-section">
            <div className="modern-section-header">
              <div>
                <span className="modern-eyebrow">PILIHAN POPULER</span>
                <h2>Rekomendasi untukmu</h2>
              </div>
              <button className="modern-text-button">
                Lihat semua
                <i className="fi fi-rr-arrow-right" />
              </button>
            </div>

            <div className="modern-products">
              {products.map((product) => (
                <article key={product.name}>
                  <div className="modern-product-image">
                    <i className={product.icon} />
                    <button>
                      <i className="fi fi-rr-heart" />
                    </button>
                  </div>

                  <span>{product.category}</span>
                  <h3>{product.name}</h3>

                  <div className="modern-rating">
                    <i className="fi fi-sr-star" />
                    4,9
                    <small>128 terjual</small>
                  </div>

                  <footer>
                    <strong>{product.price}</strong>
                    <button
                      onClick={() => role === "guest" && setGuestModal(true)}
                    >
                      <i className="fi fi-rr-shopping-cart-add" />
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>

      {guestModal && (
        <GuestModal
          onClose={() => setGuestModal(false)}
          onRegister={() => {
            setGuestModal(false);
            onLogout();
          }}
        />
      )}
    </main>
  );
}

function GuestModal({ onClose, onRegister }) {
  return (
    <div className="modern-modal-backdrop">
      <div className="modern-modal">
        <button className="modern-modal-close" onClick={onClose}>
          <i className="fi fi-rr-cross-small" />
        </button>

        <div className="modern-modal-icon">
          <i className="fi fi-rr-shopping-cart" />
        </div>

        <h2>Lengkapi data sebelum bertransaksi</h2>
        <p>
          Guest dapat melihat katalog. Untuk melakukan transaksi, silakan
          mendaftar sebagai Buyer terlebih dahulu.
        </p>

        <button className="modern-button primary full" onClick={onRegister}>
          Daftar sebagai Buyer
          <i className="fi fi-rr-arrow-right" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <MadhayanaApp />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
