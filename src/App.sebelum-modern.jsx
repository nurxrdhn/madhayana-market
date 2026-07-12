import React, { useEffect, useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './styles/globals.css';

const slides = [
  { icon: '🌐', eyebrow: 'MADHAYANA MARKET', title: 'Satu ekosistem untuk kebutuhan digital Indonesia', text: 'Temukan produk digital, layanan profesional, perangkat lunak, lisensi, dan solusi bisnis dalam satu platform.' },
  { icon: '🛡️', eyebrow: 'AMAN & TERPERCAYA', title: 'Transaksi terlindungi dari awal sampai selesai', text: 'Dana ditahan dengan sistem escrow, aktivitas tercatat, dan setiap produk melalui proses moderasi.' },
  { icon: '⚡', eyebrow: 'CEPAT & PRAKTIS', title: 'Produk digital dikirim secara otomatis', text: 'Lisensi, file, invoice, dan notifikasi tersedia segera setelah transaksi dinyatakan berhasil.' },
  { icon: '🤝', eyebrow: 'TUMBUH BERSAMA', title: 'Ruang untuk pembeli, reseller, dan kreator', text: 'Bangun toko, kelola produk, pantau penjualan, dan perluas pasar melalui satu dashboard terpadu.' },
  { icon: '✨', eyebrow: 'SELAMAT DATANG', title: 'Pilih cara kamu menggunakan Madhayana', text: 'Setiap pengguna memiliki tampilan, fitur, serta akses yang disesuaikan dengan kebutuhannya.' }
];

const roles = [
  { key: 'operator', code: 'OPR', icon: '🛠️', title: 'Operator', desc: 'Kelola produk, transaksi, pengguna, laporan, dan dukungan operasional.', color: 'violet' },
  { key: 'reseller', code: 'RSL', icon: '🏪', title: 'Reseller', desc: 'Kelola toko, produk, pesanan, saldo, promosi, dan statistik penjualan.', color: 'emerald' },
  { key: 'buyer', code: 'BYR', icon: '🛍️', title: 'Buyer', desc: 'Belanja produk digital, pantau pesanan, unduh produk, dan kelola koin.', color: 'blue' },
  { key: 'guest', code: 'GST', icon: '👀', title: 'Guest', desc: 'Lihat-lihat katalog tanpa akun. Data diminta hanya ketika akan bertransaksi.', color: 'slate' }
];


function AppShell() {
  const {
    user,
    loading,
    login,
    register,
    loginGoogle,
    enterAsGuest,
    logout,
  } = useAuth();

  const { isDarkMode, toggleTheme } = useTheme();

  const [phase, setPhase] = useState(() =>
    localStorage.getItem("madhayana_intro_done")
      ? "role"
      : "intro"
  );

  const [slide, setSlide] = useState(0);
  const [chosenRole, setChosenRole] = useState(null);

  const completeIntro = () => {
    localStorage.setItem("madhayana_intro_done", "1");
    setPhase("role");
  };

  if (loading) {
    return (
      <div className="intro-page">
        <main className="intro-card">
          <div className="intro-icon">M</div>
          <p className="eyebrow">MADHAYANA MARKET</p>
          <h1>Menyiapkan akunmu...</h1>
          <p className="intro-copy">
            Mohon tunggu sebentar.
          </p>
        </main>
      </div>
    );
  }

  if (user) {
    return (
      <Dashboard
        role={user.role}
        user={user}
        onLogout={async () => {
          await logout();
          setPhase("role");
        }}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  if (phase === "intro") {
    return (
      <OpeningSlides
        slide={slide}
        setSlide={setSlide}
        onDone={completeIntro}
      />
    );
  }

  if (phase === "login" && chosenRole) {
    return (
      <LoginPanel
        role={chosenRole}
        onBack={() => setPhase("role")}
        onLogin={login}
        onRegister={register}
        onGoogle={loginGoogle}
      />
    );
  }

  return (
    <RolePicker
      onChoose={(role) => {
        if (role.key === "guest") {
          enterAsGuest();
          return;
        }

        setChosenRole(role);
        setPhase("login");
      }}
      onReplay={() => {
        localStorage.removeItem(
          "madhayana_intro_done"
        );
        setSlide(0);
        setPhase("intro");
      }}
    />
  );
}


function OpeningSlides({ slide, setSlide, onDone }) {
  const item = slides[slide];
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => s < slides.length - 1 ? s + 1 : s), 5500);
    return () => clearInterval(id);
  }, [setSlide]);
  return <div className="intro-page">
    <div className="intro-glow one"/><div className="intro-glow two"/>
    <button className="skip-btn" onClick={onDone}>Lewati</button>
    <div className="brand-lockup"><div className="brand-mark">M</div><div><strong>MADHAYANA</strong><span>MARKET</span></div></div>
    <main className="intro-card">
      <div className="intro-number">0{slide + 1}</div>
      <div className="intro-icon">{item.icon}</div>
      <p className="eyebrow">{item.eyebrow}</p>
      <h1>{item.title}</h1>
      <p className="intro-copy">{item.text}</p>
      <div className="dots">{slides.map((_, i) => <button key={i} className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`Slide ${i+1}`}/>)}</div>
      <div className="intro-actions">
        <button className="btn ghost" disabled={slide === 0} onClick={() => setSlide(slide - 1)}>Kembali</button>
        <button className="btn primary" onClick={() => slide === slides.length - 1 ? onDone() : setSlide(slide + 1)}>{slide === slides.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}</button>
      </div>
    </main>
  </div>;
}

function RolePicker({ onChoose, onReplay }) {
  return <div className="auth-page">
    <header className="simple-header"><div className="brand-lockup dark"><div className="brand-mark">M</div><div><strong>MADHAYANA</strong><span>MARKET</span></div></div><button className="text-btn" onClick={onReplay}>Putar ulang perkenalan</button></header>
    <main className="role-wrap">
      <span className="section-label">PILIH AKSES</span><h1>Kamu ingin masuk sebagai apa?</h1><p>Setiap peran memiliki dashboard dan hak akses yang berbeda.</p>
      <div className="role-grid">{roles.map(role => <button key={role.key} className={`role-card ${role.color}`} onClick={() => onChoose(role)}>
        <div className="role-top"><span className="role-icon">{role.icon}</span><span className="role-code">{role.code}</span></div><h2>{role.title}</h2><p>{role.desc}</p><span className="role-link">Masuk sebagai {role.title} →</span>
      </button>)}</div>
      <div className="security-note">🔒 Operator tidak dapat mendaftar sendiri. Akun operator hanya dibuat oleh pemilik sistem.</div>
    </main>
  </div>;
}


function GoogleLogo() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
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

function LoginPanel({
  role,
  onBack,
  onLogin,
  onRegister,
  onGoogle,
}) {
  const operatorMode = role.key === "operator";

  const [mode, setMode] = useState(
    operatorMode ? "login" : "register"
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const getErrorMessage = (error) => {
    const messages = {
      "auth/email-already-in-use":
        "Email tersebut sudah terdaftar.",
      "auth/invalid-email":
        "Format email belum benar.",
      "auth/weak-password":
        "Kata sandi terlalu lemah.",
      "auth/invalid-credential":
        "Email atau kata sandi tidak sesuai.",
      "auth/user-not-found":
        "Akun tidak ditemukan.",
      "auth/wrong-password":
        "Kata sandi tidak sesuai.",
      "auth/popup-closed-by-user":
        "Jendela Google ditutup sebelum proses selesai.",
      "auth/popup-blocked":
        "Popup Google diblokir oleh browser.",
      "auth/unauthorized-domain":
        "Domain ini belum diizinkan di Firebase Authentication.",
    };

    return (
      messages[error?.code] ||
      error?.message ||
      "Proses autentikasi gagal."
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (
      mode === "register" &&
      form.password !== form.confirmPassword
    ) {
      setMessage(
        "Konfirmasi kata sandi tidak sama."
      );
      return;
    }

    if (form.password.length < 6) {
      setMessage(
        "Kata sandi minimal terdiri dari 6 karakter."
      );
      return;
    }

    try {
      setProcessing(true);

      if (mode === "register") {
        await onRegister({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: role.key,
        });
      } else {
        const profile = await onLogin({
          email: form.email,
          password: form.password,
        });

        if (
          operatorMode &&
          profile.role !== "operator"
        ) {
          throw new Error(
            "Akun ini bukan akun operator."
          );
        }
      }
    } catch (error) {
      console.error(error);
      setMessage(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setProcessing(true);
      setMessage("");

      await onGoogle(role.key);
    } catch (error) {
      console.error(error);
      setMessage(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-visual ${role.color}`}>
        <button
          className="back-link"
          onClick={onBack}
        >
          ← Kembali
        </button>

        <div className="visual-content">
          <span className="giant-icon">
            {role.icon}
          </span>

          <p className="eyebrow">
            AKSES {role.title.toUpperCase()}
          </p>

          <h1>
            {operatorMode
              ? "Pusat operasional Madhayana Market"
              : mode === "register"
                ? `Mulai sebagai ${role.title}`
                : `Selamat datang kembali`}
          </h1>

          <p>{role.desc}</p>

          <div className="feature-pills">
            <span>Akses berbasis peran</span>
            <span>Profil tersimpan aman</span>
            <span>Login Firebase</span>
          </div>
        </div>
      </div>

      <form
        className="login-form"
        onSubmit={submit}
      >
        <div className="form-brand">
          MADHAYANA MARKET
        </div>

        <h2>
          {mode === "register"
            ? `Daftar sebagai ${role.title}`
            : `Masuk sebagai ${role.title}`}
        </h2>

        <p>
          {operatorMode
            ? "Gunakan akun operator yang diberikan oleh Super Admin."
            : "Gunakan email atau lanjutkan dengan akun Google."}
        </p>

        {!operatorMode && (
          <>
            <button
              type="button"
              className="google-login-btn"
              onClick={handleGoogle}
              disabled={processing}
            >
              <GoogleLogo />
              {processing
                ? "Menghubungkan..."
                : mode === "register"
                  ? "Daftar dengan Google"
                  : "Masuk dengan Google"}
            </button>

            <div className="auth-divider">
              <span>atau gunakan email</span>
            </div>
          </>
        )}

        {mode === "register" && (
          <label>
            Nama lengkap
            <input
              name="name"
              required
              value={form.name}
              onChange={updateForm}
              placeholder="Contoh: Nur Ramadhan"
            />
          </label>
        )}

        <label>
          Email
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={updateForm}
            placeholder="nama@gmail.com"
          />
        </label>

        {mode === "register" && (
          <label>
            Nomor WhatsApp
            <input
              name="phone"
              required
              value={form.phone}
              onChange={updateForm}
              placeholder="08xxxxxxxxxx"
            />
          </label>
        )}

        <label>
          Kata sandi
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={updateForm}
            placeholder="Minimal 6 karakter"
          />
        </label>

        {mode === "register" && (
          <label>
            Konfirmasi kata sandi
            <input
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={updateForm}
              placeholder="Ulangi kata sandi"
            />
          </label>
        )}

        {message && (
          <div className="operator-warning">
            {message}
          </div>
        )}

        <button
          className="btn primary full"
          type="submit"
          disabled={processing}
        >
          {processing
            ? "Memproses..."
            : mode === "register"
              ? "Daftar dan Buka Beranda"
              : "Masuk ke Beranda"}
        </button>

        {!operatorMode && (
          <p className="signup-copy">
            {mode === "register"
              ? "Sudah mempunyai akun?"
              : "Belum mempunyai akun?"}

            {" "}

            <button
              type="button"
              className="text-btn"
              onClick={() => {
                setMode(
                  mode === "register"
                    ? "login"
                    : "register"
                );
                setMessage("");
              }}
            >
              {mode === "register"
                ? "Masuk sekarang"
                : `Daftar sebagai ${role.title}`}
            </button>
          </p>
        )}

        {operatorMode && (
          <p className="operator-warning">
            Akun operator hanya dibuat oleh
            Super Admin.
          </p>
        )}
      </form>
    </div>
  );
}


const dashboardConfig = {
  operator: { title:'Pusat Operasional', accent:'violet', nav:['Ringkasan','Moderasi Produk','Transaksi','Pengguna','Settlement','Tiket Bantuan','Laporan'], stats:[['Produk menunggu','24','+6 hari ini'],['Transaksi diproses','128','92% otomatis'],['Tiket terbuka','17','4 prioritas tinggi'],['Settlement','Rp 18,4 jt','Menunggu persetujuan']], actions:['Tinjau produk','Verifikasi pembayaran','Proses refund','Balas tiket'], tableTitle:'Aktivitas yang perlu ditangani' },
  reseller: { title:'Toko Reseller', accent:'emerald', nav:['Ringkasan','Produk Saya','Pesanan','Saldo & Pencairan','Promosi','Ulasan','Statistik'], stats:[['Penjualan bulan ini','Rp 12,8 jt','+18,4%'],['Pesanan aktif','36','8 perlu diproses'],['Produk tayang','42','3 stok menipis'],['Saldo tersedia','Rp 4,6 jt','Siap dicairkan']], actions:['Tambah produk','Buat voucher','Tarik saldo','Lihat toko'], tableTitle:'Pesanan terbaru' },
  buyer: { title:'Ruang Belanja', accent:'blue', nav:['Beranda','Pesanan Saya','Unduhan','Lisensi','Wishlist','Koin & Membership','Profil'], stats:[['Koin tersedia','1.250','Gold Member'],['Pesanan aktif','3','1 siap diunduh'],['Total hemat','Rp 245 rb','Dari voucher'],['Wishlist','12 produk','2 sedang diskon']], actions:['Belanja sekarang','Lihat pesanan','Top up koin','Buka unduhan'], tableTitle:'Rekomendasi untukmu' },
  guest: { title:'Jelajahi Madhayana', accent:'slate', nav:['Beranda','Kategori','Produk Terbaru','Terlaris','Tentang Kami'], stats:[['Produk digital','2.480+','Terverifikasi'],['Kategori','18','Untuk berbagai kebutuhan'],['Seller aktif','460+','Dari seluruh Indonesia'],['Rating rata-rata','4,9/5','Dari pembeli']], actions:['Jelajahi produk','Lihat kategori','Produk terlaris','Cara berbelanja'], tableTitle:'Produk pilihan hari ini' }
};

function Dashboard({ role, user, onLogout, isDarkMode, toggleTheme }) {
  const cfg = dashboardConfig[role] || dashboardConfig.guest;
  const [active, setActive] = useState(cfg.nav[0]); const [search, setSearch] = useState(''); const [showCheckout, setShowCheckout] = useState(false);
  const rows = useMemo(() => role === 'operator' ? [
    ['Produk #PRD-2041','Menunggu moderasi','5 menit lalu'],['Refund #RF-0392','Perlu persetujuan','18 menit lalu'],['Tiket #TKT-1128','Prioritas tinggi','31 menit lalu'],['Settlement #ST-4901','Verifikasi rekening','1 jam lalu']
  ] : role === 'reseller' ? [
    ['ORD-28410','Website Template Pro','Rp 325.000'],['ORD-28409','Lisensi POS 1 Tahun','Rp 490.000'],['ORD-28406','UI Kit Dashboard','Rp 175.000'],['ORD-28402','Jasa Landing Page','Rp 850.000']
  ] : [
    ['SaaS Biometric Attendance','Aplikasi','Rp 450.000'],['Premium React Dashboard','Template','Rp 150.000'],['Paket Branding UMKM','Jasa','Rp 800.000'],['Lisensi POS Professional','Software','Rp 490.000']
  ], [role]);

  const transact = () => role === 'guest' ? setShowCheckout(true) : alert('Fitur transaksi siap dihubungkan ke sistem pembayaran.');
  return <div className={`dashboard ${isDarkMode ? 'dark' : ''}`}>
    <aside className={`sidebar ${cfg.accent}`}><div className="side-brand"><div className="brand-mark">M</div><div><strong>MADHAYANA</strong><span>MARKET</span></div></div><div className="role-badge">{roles.find(r=>r.key===role)?.icon} {roles.find(r=>r.key===role)?.title}</div><nav>{cfg.nav.map(item=><button key={item} className={active===item?'active':''} onClick={()=>setActive(item)}><span>{navIcon(item)}</span>{item}</button>)}</nav><div className="side-bottom"><button onClick={toggleTheme}>{isDarkMode?'☀️':'🌙'} {isDarkMode?'Mode terang':'Mode gelap'}</button><button onClick={onLogout}>↪ Keluar</button></div></aside>
    <main className="dash-main"><header className="dash-header"><div><p className="muted">Selamat datang kembali,</p><h1>{user.name || roles.find(r=>r.key===role)?.title}</h1></div><div className="header-tools"><div className="search-box">⌕<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari di dashboard..."/></div><button className="icon-btn">🔔<span className="notification-dot"/></button><div className="avatar">{(user.name||'G').charAt(0).toUpperCase()}</div></div></header>
      <section className={`welcome-banner ${cfg.accent}`}><div><span className="section-label">{active.toUpperCase()}</span><h2>{cfg.title}</h2><p>{welcomeText(role)}</p></div><div className="banner-art">{roles.find(r=>r.key===role)?.icon}</div></section>
      <section className="stat-grid">{cfg.stats.map(([label,value,note])=><div className="stat-card" key={label}><p>{label}</p><h3>{value}</h3><span>{note}</span></div>)}</section>
      <section className="quick-section"><div className="section-heading"><div><h2>Aksi cepat</h2><p>Akses fungsi yang paling sering digunakan.</p></div></div><div className="quick-grid">{cfg.actions.map((a,i)=><button key={a} onClick={transact}><span>{['＋','▣','⇄','↗'][i]}</span>{a}</button>)}</div></section>
      <section className="data-card"><div className="section-heading"><div><h2>{cfg.tableTitle}</h2><p>Data terbaru sesuai peran dan aktivitas akun.</p></div><button className="text-btn">Lihat semua →</button></div><div className="data-list">{rows.map((r,i)=><div className="data-row" key={i}><div className="product-thumb">{['💻','🔐','🎨','📦'][i]}</div><div className="row-main"><strong>{r[0]}</strong><span>{r[1]}</span></div><div className="row-end"><strong>{r[2]}</strong><button onClick={transact}>Detail</button></div></div>)}</div></section>
    </main>
    {showCheckout && <GuestDataModal onClose={()=>setShowCheckout(false)} onContinue={(data)=>{ setShowCheckout(false); alert(`Data ${data.name} sudah dicatat. Selanjutnya dapat diarahkan ke checkout.`); }}/>} 
  </div>;
}

function GuestDataModal({ onClose, onContinue }) { const [data,setData]=useState({name:'',email:'',phone:''}); return <div className="modal-backdrop"><form className="modal-card" onSubmit={e=>{e.preventDefault();onContinue(data)}}><button type="button" className="modal-close" onClick={onClose}>×</button><span className="modal-icon">🛒</span><h2>Isi data sebelum transaksi</h2><p>Guest tetap dapat berbelanja tanpa membuat akun. Data ini dipakai untuk invoice, status pesanan, dan pengiriman produk.</p><label>Nama lengkap<input required value={data.name} onChange={e=>setData({...data,name:e.target.value})}/></label><label>Email aktif<input required type="email" value={data.email} onChange={e=>setData({...data,email:e.target.value})}/></label><label>Nomor WhatsApp<input required value={data.phone} onChange={e=>setData({...data,phone:e.target.value})}/></label><button className="btn primary full">Lanjut ke Checkout</button><small>Dengan melanjutkan, kamu menyetujui syarat dan kebijakan privasi Madhayana.</small></form></div> }

const navIcon = (x) => ({'Ringkasan':'⌂','Beranda':'⌂','Produk Saya':'□','Moderasi Produk':'✓','Pesanan':'▤','Pesanan Saya':'▤','Transaksi':'⇄','Pengguna':'♙','Saldo & Pencairan':'◉','Settlement':'◉','Tiket Bantuan':'☏','Laporan':'▥','Promosi':'✦','Ulasan':'★','Statistik':'▥','Unduhan':'⇩','Lisensi':'◇','Wishlist':'♡','Koin & Membership':'●','Profil':'♙','Kategori':'▦','Produk Terbaru':'✧','Terlaris':'★','Tentang Kami':'ⓘ'}[x] || '•');
const welcomeText = (role) => role === 'operator' ? 'Pantau operasional marketplace, selesaikan antrean, dan jaga kualitas layanan.' : role === 'reseller' ? 'Kelola toko digital, proses pesanan, dan tingkatkan performa penjualanmu.' : role === 'buyer' ? 'Temukan produk digital terbaik, kelola pesanan, dan nikmati keuntungan membership.' : 'Lihat katalog secara bebas. Saat ingin membeli, kamu cukup mengisi data transaksi.';

export default function App(){return <ThemeProvider><NotificationProvider><AuthProvider><AppShell/></AuthProvider></NotificationProvider></ThemeProvider>}
